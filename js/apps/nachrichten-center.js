import Vue from './../vue.js';

Vue.component('user-thumb', {
    props: {
        user: {
            type: Object,
            required: true
        },
        activeuser: {
            type: [Number, String],
            required: true
        },
        chatList: {
            type: Array,
            required: false
        },
        isUser: {
            type: Number,
            required: true
        },
        index: {
            type: Number,
            required: true
        }
    },
    data: function () {
        return {
            hasUserImage: false,
            seenAll: true
        };
    },
    template: `
        <div v-on:click="handleUserClick" class="user-preview" :class="{ active : isActive, unseen : !seenAll }">
            <img v-if="hasUserImage" :src="imageUrl" :alt="user.name">
            <div v-if="!hasUserImage" :style="{backgroundColor: randDarkColor}" class="userInitial">
                <span>{{ acronym }}</span>
            </div>
            <span>{{ user.name }}</span>
        </div>
    `,
    computed: {
        imageUrl: function () {
            return `../uploads/${this.user.profilepic}`;
        },
        isActive: function () {
            if (this.user.p_id == this.activeuser) {
                return true;
            }
        },
        acronym: function() {
            let userName = this.user.name.split(' ');
            if (userName.length >= 2) {
                return userName[0][0] + userName[1][0];
            } else {
                return userName[0][0];
            }
        },
        randDarkColor: function() {
            var lum = -0.25;
            var hex = String('#' + Math.random().toString(16).slice(2, 8).toUpperCase()).replace(/[^0-9a-f]/gi, '');
            if (hex.length < 6) {
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            }
            var rgb = "#",
                c, i;
            for (i = 0; i < 3; i++) {
                c = parseInt(hex.substr(i * 2, 2), 16);
                c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
                rgb += ("00" + c).substr(c.length);
            }
            return rgb;
        },
    },
    created: function () {
        if (this.user.profilepic) {
            this.hasUserImage = true;
        } else {
            this.hasUserImage = false;
        }
    },
    mounted: function(){
        let chatList = this.chatList[1];
        if(chatList.length >= 1 && this.index !== 0) {
            for (let i = chatList.length - 1; i >= 0; i--) {
                let msg = chatList[i];
                if(msg.rec_p_id == this.isUser) {
                    if (!msg.last_visited) {
                        this.seenAll = false;
                    }
                    break;
                }
            }
        }
    },
    methods: {
        handleUserClick: function () {
            this.seenAll = true;
            this.$emit('handle-user-click');
        }
    }
});
Vue.component('chat-bubble', {
    props: ['chat', 'iamuser'],
    data: function () {
        return {

        };
    },
    template: `
        <div class="chat-bubble" :class="{send : isSender}">
            <span class="message" v-html="chatMessage"></span>
            <span class="time">{{ this.chatTime }} Uhr</span>
        </div>
    `,
    computed: {
        isSender: function () {
            if (this.chat.send_p_id == this.iamuser) {
                return true;
            }
        },
        chatTime: function () {
            const date = new Date(this.chat.timestamp.replace(/-/g, "/"));
            const clockTime = date.toLocaleTimeString();
            const dateTime = date.toLocaleDateString();
            return `${dateTime} - ${clockTime}`;
        },
        chatMessage: function() {

            let chatMsg = this.chat.message;
            chatMsg = chatMsg.replaceAll("&lt;p&gt;", "");
            chatMsg = chatMsg.replaceAll("&lt;/p&gt;", "<br>");

            return chatMsg;
        }
    }
});
Vue.component('flat-details', {
    props: ['flat'],
    template: `
        <a class="flat-details" :href="flatLink" title="zum Mietobjekt wechseln">
            <div class="flat-preview-img primaryOverlay">
                <img :src="imgLink" class="cover">
            </div>
            <div class="description">
                <span class="headline">{{ flat.name }}</span>
                <span class="address">{{ flat.adresse }}</span>
            </div>
            <span class="price">{{ flat.kalt }} €</span>  
        </a>
    `,
    computed: {
        imgLink: function() {
            return `${root}/uploads/${this.flat.image_1}`;
        },
        flatLink: function() {
            return `${root}/objekte/${this.flat.link}`;
        }
    }
});
export const vm = new Vue({
    el: '.message-ctn',
    data: {
        outputData: null,
        errorMsg: {
            isError: false,
            message: 'Bitte logge dich zuerst ein.',
        },
        isUser: null,
        chatList: [],
        userList: [],
        activeChatWithUser: null,
        activeChatList: [],
        messageContent: null,
        activeFlat: null,
        firstChat: true,
        updateTimer: '',
        sentFromFlat: null,
        sentFromUser: null,
        sentParamsValid: false,
        sentIsAlreadyInChats: false,
        activeUserIds: [],
        updateChatTime: 3000
    },
    created: function () {
        // check if valid session exists
        fetch('./../essentials/get-session.php')
        .then((json) => json.json())
        .then((sessionId) => {
            this.isUser = sessionId.p_id; 
            this.updateChat(true);
            // update chat every 2 seconds
            this.updateTimer = setInterval(this.updateChat, this.updateChatTime);
        })
        .catch((err) => {
            if (isDev) {
                console.log(err);
            } else {
                this.errorMsg.isError = true;
            }
        });
    },
    watch: {
        activeChatList: function () {
            this.setScrollPos();
        },
    },
    methods: {
        formatMsg: function() {
            return '<p>' + this.messageContent.replace(/\n/g, "</p>\n<p>") + '</p>';
        },
        getUrlParameters: function(getName) {
            var url = new URL(window.location.href);
            var param = url.searchParams.get(getName);
            return param;
        },
        getChatsWithUserId: function (userId) {
            const res = this.chatList.find((ele) => {
                return ele[0] == userId;
            });
            if(res) {
                return res[1];
            } else {
                return [];
            }
        },
        userChatFrom: function(userId) {
            let relevantChat = this.chatList.find(e=>{
                return e[0] == userId;
            });
            return relevantChat;
        },
        saveLastChatVisit: function(foreignUserId) {
            
            let relevantChat = this.userChatFrom(foreignUserId);

            let lastRelevantChatId;

            for (let i = relevantChat[1].length - 1; i >= 0; i--) {
                let msg = relevantChat[1][i];
                if(msg.rec_p_id == this.isUser) {
                    lastRelevantChatId = msg.c_id;
                    break;
                }
            }

            let fetchBody = `user_id=${this.isUser}&c_id=${lastRelevantChatId}&csrf-token=${window.csrfToken}`;
            
            fetch('./../actions/set-last-chat-visit.php',
            {
                method: 'POST',
                body: fetchBody,
                headers:
                {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            })
            .catch(err=> {
                console.log(err);
            });
        },

        handleUserClick: function(userId) {
            this.activeChatWithUser = userId;
            
            this.saveLastChatVisit(this.activeChatWithUser);

            this.updateChat(true, false);
        },
        changeActiveChat: async function (userId, isFirstChat = false) {
            this.activeChatWithUser = userId;

            if(isFirstChat) {
                this.saveLastChatVisit(this.activeChatWithUser);
            }

            let newChatList = [];
            if(this.sentParamsValid && isFirstChat) {
                if(this.sentIsAlreadyInChats) {
                    newChatList = this.getChatsWithUserId(this.activeChatWithUser);
                }
            } else {
                newChatList = this.getChatsWithUserId(this.activeChatWithUser);
            }

            let isSameChatList = this.isSameArray(this.activeChatList, newChatList);

            if(!isFirstChat) {
                if (!isSameChatList) {
                    this.activeChatList = [...newChatList];
                    this.$nextTick(function () {
                        this.setScrollPos();
                    });
                }
            } else {
                this.activeChatList = [...newChatList];
                this.$nextTick(function () {
                    this.setScrollPos();
                });
            }

            if(this.sentParamsValid && isFirstChat) {
                this.firstChat = false;
                this.activeFlat = this.sentFromFlat;
                this.setScrollPos();
            } else if(this.sentParamsValid && this.activeChatWithUser == this.sentFromUser.p_id && !isFirstChat) {
                this.activeFlat = this.sentFromFlat;
            } else {
                await fetch('./../essentials/dbs_json.php',
                {
                    method: 'POST',
                    body: `flat_by_id=${this.activeChatList[this.activeChatList.length - 1].o_id}`,
                    headers:
                    {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                })
                .then((res) => res.json())
                .then((data) => {
                    // console.log(data);
                    this.activeFlat = data[0];

                    // if this is not the first chat
                    if(isFirstChat) {
                        this.setScrollPos();
                        this.firstChat = false;
                        // if new chats are not the same as active chat set scroll
                    } else if (!isSameChatList) {
                        this.setScrollPos();
                    }
                });
            }
            
        },
        updateChat: async function (isFirst = false, fetchURLParams = true) {
            if(fetchURLParams) {
                if (this.getUrlParameters('user_by_id') && this.getUrlParameters('flat_by_id')) {
                    await fetch('./../essentials/dbs_json.php',
                    {
                        method: 'POST',
                        body: `user_by_id=${this.getUrlParameters('user_by_id')}&flat_by_id=${this.getUrlParameters('flat_by_id')}`,
                        headers:
                        {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        // data array index of flat and user
                        // 0 = flat
                        // 1 = user
                        // if flat by id foreign key is user id 
                        if(data[1].p_id === data[0].p_id && data[1].p_id != this.isUser) {
                            // if user comes from wohnung-finden page, add to userList
                            this.sentParamsValid = true;
                            this.sentFromFlat = data[0];
                            this.sentFromUser = data[1];
                        }
                        
                    });
                } else if (this.getUrlParameters('user_by_id')){
                    await fetch('./../essentials/dbs_json.php',
                    {
                        method: 'POST',
                        body: `user_by_id=${this.getUrlParameters('user_by_id')}`,
                        headers:
                        {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        // data array index of user
                        // 0 = user
                        if(data[0].p_id != this.isUser) {
                            // if user comes from wohnung-finden page, add to userList
                            this.sentParamsValid = true;
                            this.sentFromUser = data[0];
                        }
                        
                    });
                }
            }
            // get relevant chats
            await fetch('./../essentials/dbs_json.php',
            {
                method: 'POST',
                body: `chats&user=${this.isUser}`,
                headers:
                {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            })
            .then((response) => response.json())
            .then(async (data) => {

                this.activeUserIds = [];

                //Comparing based on the property qty
                function compare_time(a, b){
                    // a should come before b in the sorted order
                    if (Date.parse(a[1][a[1].length - 1].timestamp) > Date.parse(b[1][b[1].length - 1].timestamp)){
                        return -1;
                    // a should come after b in the sorted order
                    } else if (Date.parse(a[1][a[1].length - 1].timestamp) < Date.parse(b[1][b[1].length - 1].timestamp)){
                        return 1;
                    // a and b are the same
                    } else{
                        return 0;
                    }
                }

                const newChats = Object.entries(data).sort(compare_time);
                // hier ansetzen für clientside
                if(!isFirst) {
                    if (!this.isSameArray(this.chatList, newChats)) {
                        console.log('irgendein chat hat sich geändert');
                    } else {
                        console.log('kein Chat hat sich geändert')
                    }
                }
                console.log(isFirst);
                // if(chatlist.last.timestamp > lastVisited) {
                //     addActiveClass
                // }

                this.chatList = newChats;

                this.chatList.forEach((user) => {
                    this.activeUserIds.push(user[0]);
                });

                await fetch('./../essentials/dbs_json.php',
                {
                    method: 'POST',
                    body: `users_by_id=${this.activeUserIds.join('-')}`,
                    headers:
                    {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                })
                .then((response) => response.json())
                .then((data) => {
                    data.forEach((user) => {
                        if (this.firstChat || !this.userList.some(e => e.p_id == user.p_id)) {
                            this.userList.push(user);
                        }
                    });

                    if (this.firstChat && this.sentParamsValid) {
                        if (this.chatList.some(e => e[0] == this.sentFromUser.p_id)) {
                            this.sentIsAlreadyInChats = true;
                        }
                        if (!this.sentIsAlreadyInChats) {
                            this.userList.unshift(this.sentFromUser);
                        }
                    }
                    
                    
                    if (this.firstChat && this.sentParamsValid && !this.sentIsAlreadyInChats) {
                        this.chatList.unshift([this.sentFromUser.p_id.toString(), []]);
                    }

                    if (this.chatList.length > 0 && this.firstChat) {
                        // set first chat as initial
                        if(this.sentParamsValid) {
                            this.changeActiveChat(this.sentFromUser.p_id, this.firstChat);
                        } else {   
                            this.changeActiveChat(this.chatList[0][0], this.firstChat);
                        }
                    } else if (!this.sentIsAlreadyInChats && this.sentFromUser && this.activeChatWithUser == this.sentFromUser.p_id) {
                        this.changeActiveChat(this.sentFromUser.p_id);
                    } else {
                        this.changeActiveChat(this.activeChatWithUser);
                    }
                });

            });
            if(isFirst) {
                this.setScrollPos();
            }

        },
        setScrollPos: function () {
            this.$refs.chatCtn.scrollTop = 30000000;
        },
        onSubmit: async function () {
            console.log('SQL QUERY: SELECT c_id, last_visited, send_p_id, rec_p_id, timestamp FROM chat AS c WHERE c_id=(SELECT MAX(c1.c_id) FROM chat AS c1 WHERE c.send_p_id = c1.send_p_id) AND rec_p_id = "4" ORDER BY timestamp');
            let fetchBody = '';

            if(this.activeFlat) {
                fetchBody = `rec=${this.activeChatWithUser}&send=${this.isUser}&msg=${this.formatMsg()}&o_id=${this.activeFlat.o_id}&csrf-token=${window.csrfToken}`
            } else {
                fetchBody = `rec=${this.activeChatWithUser}&send=${this.isUser}&msg=${this.formatMsg()}&csrf-token=${window.csrfToken}`
            }

            await fetch('./../actions/send-chat.php',
            {
                method: 'POST',
                body: fetchBody,
                headers:
                {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }).then(res=>res.text())
            .then(data=>{
                // if data true
                if (data == 1) {
                    this.updateChat();
                    this.messageContent = '';
                    this.setScrollPos();
                }
            }).catch(err=> { 
                console.log(err);
            });
        },
        isSameArray: function(arr1, arr2) {
            arr1 = JSON.stringify(arr1);
            arr2 = JSON.stringify(arr2);

            return arr1 === arr2;
        }
    },
});