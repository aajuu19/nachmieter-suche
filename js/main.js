/* eslint-disable vue/no-side-effects-in-computed-properties */
/* eslint-disable func-names */
/* eslint-disable no-useless-escape */
/* eslint-disable consistent-return */
/* eslint-disable object-property-newline */
/* eslint-disable object-shorthand */
/* eslint-disable indent */
/* eslint-disable space-before-blocks */

const isDev = true;

// wohnung-finden
(function (){
    if (document.body.classList.contains('wohnung-finden')) {
        // eslint-disable-next-line indent
        // eslint-disable-next-line no-undef
        Vue.component('min-max', {
            props: ['element'],
            template: `
                <div class="min-max">
                    <span @click="toggleActive('min')" :class="{ active : element.min }" class="min">min</span>
                    <span @click="toggleActive('max')" :class="{ active : element.max }" class="max">max</span>
                </div>
            `,
            methods: {
                toggleActive: function (direction) {
                    if (direction === 'min') {
                        this.element.min = true;
                        this.element.max = false;
                    } else if (direction === 'max') {
                        this.element.min = false;
                        this.element.max = true;
                    }
                },
            },
        });

        // eslint-disable-next-line no-undef
        Vue.component('filter-box', {
            props: ['ele'],
            template: `
                <div class="filter">
                    <span class="heading">{{ ele.name }}</span>
                    <input v-model="ele.val" type="number" :max="ele.maxVal" :min="ele.minVal" :step="ele.step">
                    <min-max v-bind:element="ele"></min-max>
                </div>
            `,
        });

        // eslint-disable-next-line no-undef
        Vue.component('object-item', {
            props: ['object'],
            data: function (){
                return {
                    maxWordLength: 150,
                };
            },
            template: `
                <div class="teaser">
                    <div class="teaser-box">
                        <div class="teaser-img">
                            <img :src="imgLink" alt="Platzhalter">
                        </div> 
                        <div class="teaser-content">
                            <span class="heading">{{ object.name }}</span>
                            <span class="time">{{ object.einstellungsdatum }} Uhr</span>
                            <span class="desc">{{ shortenedDesc }}</span>
                            <div class="object-infos">
                                <span><small>Quadratmeter</small> <span>{{ object.quadratmeter }} m²</span></span>
                                <span><small>Zimmer</small> <span>{{ object.zimmer }}</span></span>
                                <span><small>Kaltmiete</small> <span>{{ object.kalt }} €</span></span>
                            </div>
                            <a :href="objLinkPath" class="btn secondary">Mehr erfahren</a>
                        </div>
                    </div> 
                </div> 
            `,
            computed: {
                shortenedDesc: function () {
                    if (this.object.beschreibung.length >= this.maxWordLength) {
                        return `${this.object.beschreibung.slice(0, this.maxWordLength)}...`;
                    }
                    return this.object.beschreibung;
                },
                objLinkPath: function () {
                    return `${document.location.origin}/nachmieter-suche/objekte/${this.object.link}`;
                },
                imgLink: function () {
                    return `${document.location.origin}/nachmieter-suche/uploads/${this.object.image_1}`;
                },
            },
        });

        // eslint-disable-next-line no-undef
        const vm = new Vue({
            el: '.all-objects',
            data: {
                objects: [],
                filterList: {
                    quadratmeter: {
                        id: 1,
                        name: 'Quadratmeter',
                        val: '', minVal: 20, maxVal: 1000, step: 5,
                        min: true,
                        max: false,
                    },
                    zimmer: {
                        id: 2,
                        name: 'Zimmer',
                        val: '', minVal: 1, maxVal: 100, step: 0.5,
                        min: true,
                        max: false,
                    },
                    kalt: {
                        id: 3,
                        name: 'Kaltmiete',
                        val: '', minVal: 50, maxVal: 1000000, step: 10,
                        max: true,
                    },
                    etage: {
                        id: 4,
                        name: 'Etage',
                        val: '', minVal: 1, maxVal: 200, step: 1,
                        min: false,
                        max: true,
                    },
                },
                errorMsg: false,
            },
            created: function () {
                const fetched = fetch('./essentials/dbs_json.php',
                {
                    method: 'POST',
                    body: 'wohnungen&page=1&limit=50',
                    headers:
                    {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }).then((data) => data.json());
                fetched.then((data) => {
                    vm.objects = data;

                    // for debugging
                    // vm.objects.forEach(e=>console.log(e));
                })
                .catch((err) => {
                    console.log(err);
                });
            },
            methods: {
                filterIt: function () {
                    const fL = this.filterList;
                    let paramStr = '';

                    // eslint-disable-next-line no-restricted-syntax
                    for (const i in fL) {
                        if (Object.prototype.hasOwnProperty.call(fL, i)) {
                            const filter = fL[i];
                            const getMaxMin = function (){
                                if (filter.min === true) {
                                    return 'min';
                                }
                                if (filter.max === true) {
                                    return 'max';
                                }
                            };
                            if (filter.val !== '') {
                                paramStr += `${i}=${getMaxMin()}-${filter.val}&`;
                            }
                        }
                    }

                    const fetched = fetch('./essentials/dbs_json.php',
                    {
                        method: 'POST',
                        body: `wohnungen&${paramStr}page=1&limit=50`,
                        headers:
                        {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    }).then((data) => data.json());
                    fetched.then((data) => {
                        this.objects = data;
                        if (this.objects.length === 0) {
                            this.errorMsg = true;
                        } else {
                            this.errorMsg = false;
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                },
            },
        });
    }
}());


// register-login page
(function (){
    if (document.body.classList.contains('registrierung-login')) {
        const vm = new Vue({
            el: '.register-login-app',
            data: {
                registrationShow: true,
                loginShow: false,
                logMail: '',
                regMail: '',
            },
            created: function () {
                const loc = document.location.search.substr(1);
                const clearLoc = loc.split('&');

                if (clearLoc) {
                    this.changeVal(clearLoc[0]);
                }
            },
            methods: {
                changeVal: function (operation) {
                    if (operation === 'login') {
                        this.loginShow = true;
                        this.registrationShow = false;
                    } else if (operation === 'register') {
                        this.loginShow = false;
                        this.registrationShow = true;
                    }
                },
                validate: function ($event) {
                    const form = $event.target;

                    const mail = form.querySelector('input[type=mail]');
                    // check if email is valid
                    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if (!reg.test(String(mail.value).toLowerCase())) {
                        mail.classList.add('error');
                        mail.setCustomValidity('Bitte gib eine gültige E-Mail-Adresse ein.');
                        mail.reportValidity();
                    } else {
                        mail.classList.remove('error');
                        form.submit();
                    }

                    const allInputs = form.querySelectorAll('input[type=text], input[type=password]');
                    allInputs.forEach((e) => {
                        if (e.value.length === 0) {
                            e.classList.add('error');
                        } else {
                            e.classList.remove('error');
                        }
                    });
                },
            },
        });
    }
}());

// new object page
(function (){
    if (document.body.classList.contains('neues-objekt')) {
        let timeOut;
        const vm = new Vue({
            el: '.obj-ctn',
            data: {
                objIsSet: false,
                objAddress: '',
                objAddressMenu: {
                    visible: false,
                },
                placeList: [],
                waitForTypedSpeed: 600,
                showLoader: true,
                noPlace: false,
                maxFiles: 7,
                fileList: [],
                lastValidObj: null,
            },
            watch: {
                objAddress: function (search) {
                    if (!this.objIsSet) {
                        if (timeOut) {
                            clearTimeout(timeOut);
                        }
                        timeOut = setTimeout(() => {
                            this.generateAddress(search);
                        }, this.waitForTypedSpeed);
                    }
                },
            },
            methods: {
                generateAddress: function (search) {
                    // reset array on new Search
                    this.placeList.length = 0;

                    // set searchString and replace all whitespaces
                    const searchStr = search.replace(/ /g, '%20');
                    if (searchStr.length > 2) {
                        const searchQuery = `https://public.opendatasoft.com/api/records/1.0/search/?dataset=postleitzahlen-deutschland&q=${searchStr}`;
                        const fetched = fetch(searchQuery).then((res) => res.json());
                        this.objAddressMenu.visible = true;
                        this.showLoader = true;

                        fetched.then((data) => {
                            const places = data.records;
                            // check if results exist
                            if (places.length >= 1) {
                                places.forEach((e) => {
                                    const ortData = e.fields.note;
                                    const plzData = e.fields.plz;

                                    this.placeList.push({ ort: ortData, plz: plzData });
                                });
                                this.showLoader = false;
                                this.noPlace = false;
                                // eslint-disable-next-line prefer-destructuring
                                this.lastValidObj = this.placeList[0];
                                // console.log(this.placeList);
                            } else {
                                // do this if not

                                // reset array if non result
                                this.noPlace = true;
                                this.showLoader = false;
                                this.placeList.length = 0;
                            }
                        });
                    } else {
                        this.objAddressMenu.visible = false;
                        this.noPlace = false;
                        this.showLoader = true;
                    }
                },
                setAddress: function (place) {
                    clearTimeout(timeOut);
                    this.objAddressMenu.visible = false;
                    this.objIsSet = true;
                    this.lastValidObj = place;
                },
                setFirstAddress: function () {
                    clearTimeout(timeOut);
                    this.objAddressMenu.visible = false;
                    this.objIsSet = true;

                    if (this.objAddress.length <= 2) {
                        this.objAddress = '';
                    } else if (this.placeList.length === 0) {
                        if (this.lastValidObj) {
                            this.objAddress = `${this.lastValidObj.plz} ${this.lastValidObj.ort}`;
                        } else {
                            this.objAddress = '';
                        }
                    } else if (this.objAddress !== '' && this.objAddress.length >= 3 && this.placeList.length === 1){
                        const firstPlace = this.placeList[0];
                        this.objAddress = `${firstPlace.plz} ${firstPlace.ort}`;
                    } else if (this.placeList.length >= 2) {
                        this.objAddress = `${this.lastValidObj.plz} ${this.lastValidObj.ort}`;
                    }
                },
                allowInput: function () {
                    this.objIsSet = false;
                    this.showLoader = true;
                },
                validate: function ($event) {
                    const input = document.querySelector('input[type="file"]');

                    if (input.files.length > this.maxFiles) {
                        input.setCustomValidity('Du kannst nicht mehr als 7 Bilder hochladen.');
                        input.reportValidity();
                    } else {
                        $event.target.submit();
                    }
                },
                showFileDetails: function ($event) {
                    this.fileList = $event.target.files;
                },
            },
        });
    }
}());

// Nachrichten Center App
(function (){
    if (document.body.classList.contains('nachrichten-center')) {
        Vue.component('user-thumb', {
            props: ['user', 'activeuser'],
            data: function () {
                return {
                    hasUserImage: false,
                };
            },
            template: `
                <div v-on:click="changeActiveChat" class="user-preview" :class="{ active : isActive }">
                    <img v-if="hasUserImage" :src="imageUrl" :alt="user.name">
                    <div v-if="!hasUserImage" class="userInitial">
                        <span>{{ user.name[0] }}</span>
                    </div>
                    <span>{{ user.name }}</span>
                </div>
            `,
            computed: {
                imageUrl: function () {
                    // return `../uploads/${this.user.profilepic}`;
                    return '../uploads/placeholder.jpg';
                },
                isActive: function () {
                    if (this.user.p_id == this.activeuser) {
                        return true;
                    }
                }
            },
            created: function () {
                if (this.user.profilepic) {
                    this.hasUserImage = true;
                } else {
                    this.hasUserImage = false;
                }
            },
            methods: {
                changeActiveChat: function () {
                    this.$emit('change-active-chat');
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
                    <span class="message">{{ chat.message }}</span>
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
            }
        });
        const vm = new Vue({
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
                hasScrolled: false,
            },
            created: function () {
                // check if valid session exists
                fetch('./../essentials/get-session.php')
                .then((json) => json.json())
                .then((sessionId) => {
                    this.isUser = sessionId.person.p_id;
                    this.updateChat();
                })
                .catch((err) => {
                    if (isDev) {
                        console.log(err);
                    } else {
                        this.errorMsg.isError = true;
                    }
                });
                this.updateTimer = setInterval(this.updateChat, 2000);
            },
            methods: {
                getChatsWithUserId: function (userId) {
                    const res = this.chatList.find((ele) => {
                        return ele[0] == userId;
                    });
                    return res[1];
                },
                changeActiveChat: function (userId) {
                    this.activeChatWithUser = userId;
                    this.activeChatList = this.getChatsWithUserId(this.activeChatWithUser);
                    fetch('./../essentials/dbs_json.php',
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
                        this.activeFlat = data;
                        // this.hasScrolled = false;
                        if (!this.hasScrolled) {
                            this.setScrollPos();
                            this.hasScrolled = true;
                        }
                    });
                },
                updateChat: function () {
                    // get relevant chats
                    fetch('./../essentials/dbs_json.php',
                    {
                        method: 'POST',
                        body: `chats&user=${this.isUser}`,
                        headers:
                        {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        this.chatList = Object.entries(data);
                        this.chatList.forEach((user) => {
                            fetch('./../essentials/dbs_json.php',
                            {
                                method: 'POST',
                                body: `user_by_id=${user[0]}`,
                                headers:
                                {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                },
                            })
                            .then((response) => response.json())
                            .then((data) => {
                                if (this.firstChat || !this.userList.some(e => e.p_id == data.p_id)) {
                                    this.userList.push(data);
                                }
                                if (!this.hasScrolled) {
                                    this.setScrollPos();
                                    this.hasScrolled = true;
                                }
                            });
                        });

                        // if chats were found
                        if (this.chatList.length > 0 && this.firstChat) {
                            // set first chat as initial
                            this.changeActiveChat(this.chatList[0][0]);
                            this.firstChat = false;
                        } else {
                            this.changeActiveChat(this.activeChatWithUser);
                        }
                    });
                },
                setScrollPos: function () {
                    const chatCtn = document.querySelector('.message-box .inner-ctn');
                    chatCtn.scrollTop = chatCtn.scrollHeight;
                    chatCtn.addEventListener('scroll', function (){
                        this.hasScrolled = true;
                    });
                },
                onSubmit: function () {
                    fetch('./../actions/send-chat.php',
                    {
                        method: 'POST',
                        body: `rec=${this.activeChatWithUser}&send=${this.isUser}&msg=${this.messageContent}&o_id=${this.activeFlat.o_id}`,
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
                            this.hasScrolled = false;
                        }
                    });
                },
            },
        });
    }
}());