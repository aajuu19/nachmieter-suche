import './../styles/styles';
import "regenerator-runtime/runtime";
import Vue from './vue.js';

const isDev = false;
const root = `${document.location.origin}/nachmieter-suche`;

// objekte
(function() { 
    if (document.body.classList.contains('objekte')) {
        window.vm = new Vue({
            el: '.obj-slider-app',
            data: {
                mainImgSrc: null,
                flatImages: [],
                showLeftArrow: false,
                showRightArrow: false,
                scrolledThisTimes: 0,
                thumbsVisible: 3,
                thumbsVisibleBefore: null
            },
            created: function() {
                this.handleResponsive();
                window.addEventListener('resize', this.handleResponsive);
            },
            mounted: function () {
                this.flatImages = Object.values(this.$refs);
                
                this.handleArrowVisibility();
            },
            watch: {
                scrolledThisTimes: function() {
                    if (this.scrolledThisTimes === 0) {
                        this.showLeftArrow = false;
                    } else if (this.scrolledThisTimes == this.imageCount - this.thumbsVisible) {
                        this.showRightArrow = false;
                    } else {
                        this.showLeftArrow = true;
                        this.showRightArrow = true;
                    }
                }
            },
            computed: {
                imageCount: function() {
                    return this.flatImages.length;
                },
                sliderPosition: function() {
                    if (this.imageCount > this.thumbsVisible) {
                        if ((this.imageCount - this.scrolledThisTimes) < this.thumbsVisible) {
                            this.scrolledThisTimes--;
                        }
                        //  if ((this.imageCount - this.scrolledThisTimes) == this.thumbsVisible) {
                        //     this.scrolledThisTimes++;
                        // }
                        return this.scrolledThisTimes * -(this.flatImages[0].offsetWidth + 10);
                    } else {
                        return 0;
                    }
                }
            },
            methods: {
                handleArrowVisibility: function() {
                    if (this.imageCount >= this.thumbsVisible) {
                        this.showLeftArrow = true;
                        this.showRightArrow = true;
                    } else {
                        this.showLeftArrow = false;
                        this.showRightArrow = false;
                    }
    
                    if (this.scrolledThisTimes === 0) {
                        this.showLeftArrow = false;
                    }
                },
                handleResponsive: function() {
                    
                    let windowWidth = window.innerWidth;

                    if (windowWidth < 480) { 
                        this.handlePositionOnResize();
                        this.thumbsVisible = 1; // default breakpoint under 480
                    } else if (windowWidth < 680) {
                        this.handlePositionOnResize();
                        this.thumbsVisible = 2; // higher than 480 lower than 680
                    } else if (windowWidth < 850) {
                        this.handlePositionOnResize();
                        this.thumbsVisible = 3; // higher than 680 lower than 850
                    } else if (windowWidth < 1200) {
                        this.handlePositionOnResize();
                        this.thumbsVisible = 2; // higher than 850 lower than 1200
                    } else if (windowWidth >= 1200) {
                        this.handlePositionOnResize();
                        this.thumbsVisible = 3; // higher than 1200
                    }


                },
                handlePositionOnResize: function() {
                    if(this.thumbsVisible !== this.thumbsVisibleBefore) {
                        if ((this.imageCount - this.scrolledThisTimes == this.thumbsVisibleBefore) && this.thumbsVisibleBefore > this.thumbsVisible) {
                            this.scrolledThisTimes++;
                        }
                        this.thumbsVisibleBefore = this.thumbsVisible;
                    }
                },
                changeMainImg: function(event) {
                    const ele = event.target;
                    this.mainImgSrc = ele.src;
                },
                swipeLeft: function() {
                    if (this.scrolledThisTimes >= 0) {
                        this.scrolledThisTimes--;
                    }
                    console.log('So oft gescrollt '+this.scrolledThisTimes);
                    console.log('imagecount '+this.imageCount);
                    console.log('sichtbare thumbs '+this.thumbsVisible);
                },
                swipeRight: function() {
                    if (this.scrolledThisTimes <= this.imageCount - this.thumbsVisible) {
                        this.scrolledThisTimes++;
                    }
                    console.log('So oft gescrollt '+this.scrolledThisTimes);
                    console.log('imagecount '+this.imageCount);
                    console.log('sichtbare thumbs davor '+this.thumbsVisibleBefore);
                    console.log('sichtbare thumbs '+this.thumbsVisible);
                },
            }
        });
    }
})();

// user js
(function() { 
    if (document.body.classList.contains('profil-bearbeiten')) {
        const vm = new Vue({
            el: '.edit-profile-app',
            data: {
                userProfile: {},
                fileList: [],
            },
            computed: {
                name: function() {
                    if(this.userProfile.name) {
                        return this.userProfile.name;
                    } else {
                        return "";
                    }
                },
                gender: function() {
                    if(this.userProfile.gender) {
                        return this.userProfile.gender;
                    } else {
                        return "";
                    }
                },
                description: function() {
                    if(this.userProfile.beschreibung) {
                        return this.userProfile.beschreibung;
                    } else {
                        return "";
                    }
                },
                job: function() {
                    if(this.userProfile.job) {
                        return this.userProfile.job;
                    } else {
                        return "";
                    }
                },
                lookingfrom: function() {
                    if(this.userProfile.lookingfrom) {
                        return this.userProfile.lookingfrom;
                    } else {
                        return "";
                    }
                },
                birthdate: function() {
                    if(this.userProfile.birthdate) {
                        return this.userProfile.birthdate;
                    } else {
                        return "";
                    }
                }
            },
            created: function () {
                fetch('./../essentials/get-session.php')
                .then((json) => json.json())
                .then((sessionId) => {
                    let isUser = sessionId.person.p_id; 
                    
                    fetch('./../essentials/dbs_json.php',
                    {
                        method: 'POST',
                        body: 'user_by_id=' + isUser,
                        headers:
                        {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    })
                    .then((data) => data.json())
                    .then((data) => {
                        this.userProfile = data[0];
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                })
                .catch((err) => {
                    if (isDev) {
                        console.log(err);
                    }
                });
            },
            methods: {
                showFileDetails: function ($event) {
                    this.fileList = $event.target.files;
                },
            }
        });
    }
})();

// wohnung-finden page
(function() { 
    if (document.body.classList.contains('wohnung-finden')) {
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

        Vue.component('filter-box', {
            props: ['ele'],
            template: `
                <div class="filter">
                    <span class="heading">{{ ele.name }}</span>
                    <input v-model="ele.val" type="number" autocomplete="off" :max="ele.maxVal" :min="ele.minVal" :step="ele.step">
                    <min-max v-bind:element="ele"></min-max>
                </div>
            `,
        });

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
        const vm = new Vue({
            el: '.all-objects',
            data: {
                objects: [],
                filterList: {
                    quadratmeter: {
                        id: 1,
                        name: 'Quadratmeter',
                        val: '', 
                        minVal: 20, 
                        maxVal: 1000, 
                        step: 5,
                        min: true,
                        max: false,
                    },
                    zimmer: {
                        id: 2,
                        name: 'Zimmer',
                        val: '', 
                        minVal: 1, 
                        maxVal: 100, 
                        step: 0.5,
                        min: true,
                        max: false,
                    },
                    kalt: {
                        id: 3,
                        name: 'Kaltmiete',
                        val: '', 
                        minVal: 50, 
                        maxVal: 1000000, 
                        step: 10,
                        max: true,
                    },
                    etage: {
                        id: 4,
                        name: 'Etage',
                        val: '', 
                        minVal: 1, 
                        maxVal: 200, 
                        step: 1,
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
                    this.objects = data;

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
                registration: {
                    isActive: true,
                    title: 'Registrierung'
                },
                login: {
                    isActive: false,
                    title: 'Login'
                },
                logMail: '',
                regMail: ''
            },
            computed: {
                appTitle: function() {
                    if (this.registration.isActive) {
                        return this.registration.title;
                    } else if (this.login.isActive) {
                        return this.login.title;
                    }
                }
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
                        this.login.isActive = true;
                        this.registration.isActive = false;
                    } else if (operation === 'register') {
                        this.login.isActive = false;
                        this.registration.isActive = true;
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
                                    let ortData = e.fields.note;
                                    let plzData = e.fields.plz;
                                    ortData = ortData.replace('Ã¶', 'ö');
                                    ortData = ortData.replace('Ã', 'Ö');
                                    ortData = ortData.replace('Ã', 'Ü');
                                    ortData = ortData.replace('Ã¼', 'ü');
                                    ortData = ortData.replace('Ã¤', 'ä');
                                    ortData = ortData.replace('Ã', 'ß');

                                    this.placeList.push({ ort: ortData, plz: plzData });
                                });
                                this.showLoader = false;
                                this.noPlace = false;
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
if (document.body.classList.contains('nachrichten-center')) {
    Vue.component('user-thumb', {
        props: ['user', 'activeuser'],
        data: function () {
            return {
                hasUserImage: false,
            };
        },
        template: `
            <div v-on:click="handleUserClick" class="user-preview" :class="{ active : isActive }">
                <img v-if="hasUserImage" :src="imageUrl" :alt="user.name">
                <div v-if="!hasUserImage" :style="{backgroundColor: randDarkColor}" class="userInitial">
                    <span>{{ acronym }}</span>
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
        methods: {
            handleUserClick: function () {
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
    window.vm = new Vue({
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
            sentIsAlreadyinChats: false
        },
        created: function () {
            // check if valid session exists
            fetch('./../essentials/get-session.php')
            .then((json) => json.json())
            .then((sessionId) => {
                this.isUser = sessionId.person.p_id; 
                this.updateChat(true);
                // update chat every 2 seconds
                this.updateTimer = setInterval(this.updateChat, 3000);
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
                return res[1];
            },
            handleUserClick: function(userId) {
                this.activeChatWithUser = userId;
                this.updateChat(true);
            },
            changeActiveChat: async function (userId, isFirstChat = false) {
                this.activeChatWithUser = userId;
                let newChatList = [];
                if(this.sentParamsValid && isFirstChat) {
                    if(this.sentIsAlreadyinChats) {
                        newChatList = this.getChatsWithUserId(this.activeChatWithUser);
                    }
                } else {
                    newChatList = this.getChatsWithUserId(this.activeChatWithUser);
                }
                let isSameChatList = this.isSameArray(this.activeChatList, newChatList);

                if(!isFirstChat) {
                    if (!isSameChatList) {
                        this.activeChatList = [...newChatList];
                    }
                } else {
                    this.activeChatList = [...newChatList];
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
            updateChat: async function (isFirst) {
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
                .then((data) => {
                    this.chatList = Object.entries(data);

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

                    this.chatList.sort(compare_time);

                    // sentUser muss hier geprüft werden ob bereits miteinander geschrieben wurde
                    this.chatList.forEach(async (user) => {
                        await fetch('./../essentials/dbs_json.php',
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
                            if (this.firstChat || !this.userList.some(e => e.p_id == data[0].p_id)) {
                                // hier sortieren
                                this.userList.push(data[0]);
                            }
                        });
                    });
                    
                    if (this.firstChat && this.sentParamsValid) {
                        this.userList.push(this.sentFromUser);
                        if (this.chatList.some(e => e[0] == this.sentFromUser.p_id)) {
                            this.sentIsAlreadyinChats = true;
                        }
                    }

                    if (this.firstChat && this.sentParamsValid && !this.sentIsAlreadyinChats) {
                        this.chatList.unshift([this.sentFromUser.p_id.toString(), []]);
                    }
                    
                    if (this.chatList.length > 0 && this.firstChat) {
                        // set first chat as initial
                        if(this.sentParamsValid) {
                            this.changeActiveChat(this.sentFromUser.p_id, this.firstChat);
                        } else {   
                            this.changeActiveChat(this.chatList[0][0], this.firstChat);
                        }
                    } else {
                        this.changeActiveChat(this.activeChatWithUser);
                    }

                });
                if(isFirst) {
                    this.setScrollPos();
                }

            },
            setScrollPos: function () {
                this.$refs.chatCtn.scrollTop = 30000000;
            },
            onSubmit: async function () {
                let fetchBody = '';

                if(this.activeFlat) {
                    fetchBody = `rec=${this.activeChatWithUser}&send=${this.isUser}&msg=${this.formatMsg()}&o_id=${this.activeFlat.o_id}`
                } else {
                    fetchBody = `rec=${this.activeChatWithUser}&send=${this.isUser}&msg=${this.formatMsg()}`
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
                    console.log(data);
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
                if(arr1.length === arr2.length) {
                    return true
                } else {
                    return false;
                }
            }
        },
    });
}