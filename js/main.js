import './../styles/styles';
import "regenerator-runtime/runtime";
import Vue from './vue.js';

const isDev = true;
const root = window.root;

// general page js
(function() {
    class Website {
        constructor() {}

        debounce(func, wait) {
            let timeout;
            
            return function() {
                let context = this, args = arguments;
          
                let later = function() {
                    timeout = null;
                    func.apply(context, args);
                };
            
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        minMainHeight() {
            const headerHeight = document.querySelector('header').offsetHeight;
            const footerHeight = document.querySelector('footer').offsetHeight;
            const windowHeight = window.innerHeight;

            const main = document.querySelector('main');
            main.style.minHeight = windowHeight - footerHeight - headerHeight + 'px';
        }

        lazyLoadImg() {
            const allLazyImages = document.querySelectorAll('.lazyImg');
            allLazyImages.forEach(e=>{
                e.src = e.dataset.src;
                e.classList.remove('lazyImg');
                e.classList.add('lazyLoaded');
            });
        }
        
        initWebpage() {
            const me = this;
            document.addEventListener("DOMContentLoaded", function() {
                me.minMainHeight();
                me.lazyLoadImg();
            });
        }

    }

    const web = new Website();
    web.initWebpage();

    function debounce(func, wait = 100) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
            func.apply(this, args);
            }, wait);
        };
    }

    const footerFunc = function parallaxFooterImg() {
        let footer = document.querySelector('footer');
        let footerImg = document.querySelector('.footer-img');
        let footerImgHeight = footerImg.offsetHeight - 50;
        let windowHeight = window.innerHeight;
        let scrollPosBottom = window.scrollY + windowHeight;

        if(scrollPosBottom >= footer.offsetTop - 400) {
            let procentualFooterScroll = 100 / (footer.offsetHeight + 400) * -(footer.offsetTop - 400 - scrollPosBottom);
            let footerImgUnit = footerImgHeight / 100;
            
            footerImg.style.top = 'calc(' + 100 +'% - ' + footerImgUnit * procentualFooterScroll + 'px)';
        }
    }

    footerFunc();

    // const debounced = debounce(footerFunc, 100);

    window.addEventListener('scroll', footerFunc);

    if (document.body.classList.contains('objekte')) {
        const editBtn = document.querySelector('.edit-flat-btn');

        const deleteBtn = document.querySelector('.delete-flat-btn');
        const deleteWindow = document.querySelector('.info-up-window__delete');
        
        if(editBtn && deleteBtn) {
            const closeDelete = deleteWindow.querySelector('.info-up-window__close');
            const abortBtn = deleteWindow.querySelector('.info-up-window__buttons .abort');
            
            deleteBtn.addEventListener('click', function(){
                deleteWindow.classList.add('active');
            });
            
            closeDelete.addEventListener('click', function(){
                deleteWindow.classList.remove('active');
            });

            abortBtn.addEventListener('click', function(){
                deleteWindow.classList.remove('active');
            });
        }
    }
})();

const helperFunctions = {
    methods: {
        getUrlParameters: function(getName) {
            var url = new URL(window.location.href);
            var param = url.searchParams.get(getName);
            return param;
        },
        randomId: function() {
            return '_' + Math.random().toString(36).substr(2, 9);
        }
    }
};

// index page
(function() {
    if (document.body.classList.contains('index')) {
        Vue.component('address-list-item', {
            props: ['place'],
            template: `
                <li @mousedown="handleAddressClick(place);">{{ placeContent }}</li>
            `,
            computed: {
                placeContent: function() {
                    if(this.place.std) {
                        return `${this.place.std} - ${this.place.ort}`;
                    } else {
                        return `${this.place.ort}`;
                    }
                },
            },
            methods: {
                handleAddressClick: function(place){
                    this.$emit('handle-address-click', place)
                }
            }
        });

        const vm = new Vue({
            el: '.header-ctn',
            data: {
                activeClass: 'primary',
                flatIsActive: true,
                mieterIsActive: false,
                lfAddress: '',
                placeList: [],
                recentPlaceList: [],
                maxAllowedSuggestions: 30,
            },
            computed: {
                showSuggestions: function() {
                    if (this.recentPlaceList.length == 0) {
                        return false;
                    } else {
                        return true;
                    }
                }
            },
            watch: {
                lfAddress: function() {
                    this.refreshPlaceList();
                }
            },
            created: function () {
                fetch('./js/json/orte.json',
                {
                    headers:
                    {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                })
                .then((res) => res.json())
                .then((data) => {
                    this.placeList = data;
                })
                .catch((err) => {
                    console.log(err);
                });
                this.changeSearchType('primary');

            },
            methods: {
                eraseSuggestions: function() {
                    this.recentPlaceList = [];
                },
                changeSearchType: function(searchType) {
                    this.activeClass = searchType;
                    
                    if (searchType === 'primary') {
                        this.flatIsActive = true;
                        this.mieterIsActive = false;
                        document.headerSearchForm.action = `${root}/wohnung-finden.php`;
                    } else if (searchType === 'secondary') {
                        this.flatIsActive = false;
                        this.mieterIsActive = true;
                        document.headerSearchForm.action = `${root}/mieter-finden.php`;
                    }
                },
                handleAddressClick: function(place) {
                    if (place.std) {
                        this.lfAddress = place.std + ' - ' + place.ort;
                    } else {
                        this.lfAddress = place.ort;
                    }
                    this.recentPlaceList = [];
                },
                refreshPlaceList: function(){
                    if (this.lfAddress.length > 2) {
                        let searchAddress = this.lfAddress.toLowerCase().trim();
                        
                        this.recentPlaceList = this.placeList.filter(ele => {
                            if (ele.std) {
                                let searchCombi1 = ele.std.toLowerCase() + ' ' + ele.ort.toLowerCase();
                                let searchCombi2 = ele.ort.toLowerCase() + ' ' + ele.std.toLowerCase();
                                let searchCombi3 = ele.std.toLowerCase() + ' - ' + ele.ort.toLowerCase();
                                return ele.ort.toLowerCase().includes(searchAddress) || ele.std.toLowerCase().includes(searchAddress) || searchCombi1.includes(searchAddress) || searchCombi2.includes(searchAddress) || searchCombi3.includes(searchAddress);
                            } else {
                                return ele.ort.toLowerCase().includes(searchAddress);
                            }
                        });

                        if (this.recentPlaceList.length >= this.maxAllowedSuggestions) {
                            this.recentPlaceList = this.recentPlaceList.slice(0, this.maxAllowedSuggestions);
                        }
                    } else {
                        this.recentPlaceList = [];
                    }
                },
            },
        });
    }
})();


// mieter-finden page
(function() { 
    if (document.body.classList.contains('mieter-finden')) {
        Vue.component('address-list-item', {
            props: ['place'],
            template: `
                <li @mousedown="handleAddressClick(place);">{{ placeContent }}</li>
            `,
            computed: {
                placeContent: function() {
                    if(this.place.std) {
                        return `${this.place.std} - ${this.place.ort}`;
                    } else {
                        return `${this.place.ort}`;
                    }
                },
            },
            methods: {
                handleAddressClick: function(place){
                    this.$emit('handle-address-click', place)
                }
            }
        });

        Vue.component('filter-box', {
            props: ['ele'],
            template: `
                <div class="filter">
                    <span class="heading">{{ ele.name }}</span>
                    <select v-model="ele.selectedVal" :name="ele.name" :id="ele.name">
                        <option value="" selected></option>
                        <option v-for="filter in ele.values" :value="filter"> {{ filter }} </option>
                    </select>
                </div>
            `,
        });

        Vue.component('user-item', {
            props: {
                user: Object,
                page: Number,
                id: [String, Number]
            },
            data: function (){
                return {
                    maxWordLength: 150,
                };
            },
            template: `
                <div class="teaser" :id="id">
                    <div class="teaser-box">
                        <a :title="user.name" :href="objLinkPath" class="teaser-img" @click.prevent="savePageToStorage">
                            <img :src="imgLink">
                        </a> 
                        <div class="teaser-content">
                            <span class="heading">{{ user.name }}</span>
                            <span class="time" v-show="user.lf_adresse">{{ user.lf_adresse }}</span>
                            <span class="desc">{{ shortenedDesc }}</span>
                            <div class="infoBox" v-show="showUserInfos">
                                <span v-show="user.lf_quadratmeter"><small>Quadratmeter</small> <span>{{ user.lf_quadratmeter }} m²</span></span>
                                <span v-show="user.lf_zimmer"><small>Zimmer</small> <span>{{ user.lf_zimmer }}</span></span>
                                <span v-show="user.lf_kalt"><small>Kaltmiete</small> <span>{{ user.lf_kalt }} €</span></span>
                            </div>
                            <a @click.prevent="savePageToStorage" :href="objLinkPath" class="btn secondary">Mehr erfahren</a>
                        </div>
                    </div> 
                </div> 
            `,
            methods: {
                savePageToStorage: function () {
                    sessionStorage.setItem('userSavedPage', this.page);
                    sessionStorage.setItem('userSavedItemId', this.id);
                    window.location = this.objLinkPath;
                }
            },
            computed: {
                showUserInfos: function () {
                    if (this.user.lf_quadratmeter || this.user.lf_zimmer || this.user.lf_kaltmiete) {
                        return true;
                    } else {
                        return false;
                    }
                },
                shortenedDesc: function () {
                    if (this.user.beschreibung && this.user.beschreibung.length >= this.maxWordLength) {
                        return `${this.user.beschreibung.slice(0, this.maxWordLength)}...`;
                    }
                    return this.user.beschreibung;
                },
                objLinkPath: function () {
                    return `${root}/user/user.php?id=${this.user.p_id}`;
                },
                imgLink: function () {
                    if(!this.user.profilepic) {
                        return `${root}/uploads/placeholder.jpg`;
                    }
                    return `${root}/uploads/${this.user.profilepic}`;
                },
            },
        });
        const vm = new Vue({
            el: '.all-users',
            data: {
                users: [],
                filterList: {
                    lf_quadratmeter: {
                        id: 1,
                        name: 'Quadratmeter',
                        values: [
                            '0 - 49',
                            '50 - 99',
                            '100 - 149',
                            '150 - 250',
                            'Über 250',
                        ],
                        selectedVal: null
                    },
                    lf_zimmer: {
                        id: 2,
                        name: 'Zimmer',
                        values: [
                            '1 - 2',
                            '2 - 3',
                            '3 - 4',
                            '4 - 5',
                            '5 - 6',
                            '6 - 7',
                            '7 - 10',
                            'Über 10',
                        ], 
                        selectedVal: null
                    },
                    lf_kaltmiete: {
                        id: 3,
                        name: 'Kaltmiete',
                        values: [
                            '0 - 300',
                            '300 - 500',
                            '500 - 700',
                            '700 - 1000',
                            '1000 - 1500',
                            '1500 - 3000',
                            '3000 - 5000',
                            'Über 5000',
                        ],
                        selectedVal: null
                    },
                    lf_warmmiete: {
                        id: 4,
                        name: 'Warmmiete',
                        values: [
                            '0 - 300',
                            '300 - 500',
                            '500 - 700',
                            '700 - 1000',
                            '1000 - 1500',
                            '1500 - 3000',
                            '3000 - 5000',
                            'Über 5000',
                        ], 
                        selectedVal: null
                    },
                },
                lfAddress: null,
                errorMsg: false,
                placeList: [],
                recentPlaceList: [],
                maxAllowedSuggestions: 30,
                newPageAvailable: true,
                nextPage: 2,
                pageLimitation: 20
            },
            mixins: [helperFunctions],
            computed: {
                showSuggestions: function() {
                    if (this.recentPlaceList.length == 0) {
                        return false;
                    } else {
                        return true;
                    }
                }
            },
            watch: {
                lfAddress: function() {
                    this.refreshPlaceList();
                }
            },
            created: function () {
                fetch('./js/json/orte.json',
                {
                    headers:
                    {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                })
                .then((res) => res.json())
                .then((data) => {
                    this.placeList = data;
                })
                .catch((err) => {
                    console.log(err);
                });
            },
            mounted: function () {

                // handle if came from flat page
                let savedPage = null;
                const savedPageVal = this.getSessionStorage('userSavedPage');
                if(savedPageVal) {
                    savedPage = parseInt(savedPageVal) * this.pageLimitation;
                    this.nextPage = parseInt(savedPageVal) + 1;
                }

                let requestStr = '';
                const createdAddress = this.getUrlParameters('lf_address');

                if(createdAddress) {
                    if(savedPage) {
                        requestStr = `users&address=${createdAddress}&limit=${this.pageLimitation}&savedPage=${savedPage}`
                    } else {
                        requestStr = `users&address=${createdAddress}&page=1&limit=${this.pageLimitation}`
                    }
                    this.lfAddress = createdAddress;
                } else {
                    if(savedPage) {
                        requestStr = `users&limit=${this.pageLimitation}&savedPage=${savedPage}`;
                    } else {
                        requestStr = `users&page=1&limit=${this.pageLimitation}`;
                    }
                }

                const fetched = fetch('./essentials/dbs_json.php',
                {
                    method: 'POST',
                    body: requestStr,
                    headers:
                    {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }).then((data) => data.text());
                fetched.then((data) => {
                    console.log(data);
                    // this.users = data;
                    // window.addEventListener('scroll', this.getNewPage);

                    // if(savedPage) {
                    //     this.$nextTick(function () {
                    //         const header = document.querySelector('header');
                    //         const lastVisitedFlat = document.getElementById(this.getSessionStorage('userSavedItemId'));
                    //         const scrollAmount = lastVisitedFlat.offsetTop + header.offsetHeight - 16;
                    //         window.scrollTo(0, scrollAmount);
                    //         window.sessionStorage.removeItem('userSavedItemId');
                    //         window.sessionStorage.removeItem('userSavedPage');
                    //     });
                    // }
                })
                .catch((err) => {
                    console.log(err);
                });
            },
            methods: {
                getSessionStorage: function(item) {
                    return window.sessionStorage[item];
                },
                getNewPage: function() {
                    
                    let bodyHeight = document.body.scrollHeight;
                    let scrollBottom = window.scrollY + window.innerHeight;
                    
                    if (this.newPageAvailable && scrollBottom >= bodyHeight - 200) {
                    this.newPageAvailable = false;
                    this.filterIt(this.nextPage, this.pageLimitation, true)
                    }

                },
                eraseSuggestions: function() {
                    this.recentPlaceList = [];
                },
                handleAddressClick: function(place) {
                    if (place.std) {
                        this.lfAddress = place.std + ' - ' + place.ort;
                    } else {
                        this.lfAddress = place.ort;
                    }
                    this.filterIt(1, this.pageLimitation);
                },
                refreshPlaceList: function(){
                    if (this.lfAddress.length >= 2) {
                        let searchAddress = this.lfAddress.toLowerCase().trim();
                        
                        this.recentPlaceList = this.placeList.filter(ele => {
                            if (ele.std) {
                                let searchCombi1 = ele.std.toLowerCase() + ' ' + ele.ort.toLowerCase();
                                let searchCombi2 = ele.ort.toLowerCase() + ' ' + ele.std.toLowerCase();
                                let searchCombi3 = ele.std.toLowerCase() + ' - ' + ele.ort.toLowerCase();
                                return ele.ort.toLowerCase().includes(searchAddress) || ele.std.toLowerCase().includes(searchAddress) || searchCombi1.includes(searchAddress) || searchCombi2.includes(searchAddress) || searchCombi3.includes(searchAddress);
                            } else {
                                return ele.ort.toLowerCase().includes(searchAddress);
                            }
                        });

                        if (this.recentPlaceList.length >= this.maxAllowedSuggestions) {
                            this.recentPlaceList = this.recentPlaceList.slice(0, this.maxAllowedSuggestions);
                        }
                    } else {
                        this.recentPlaceList = [];
                    }
                },
                handleFilterClick: function () {
                    this.filterIt(1, this.pageLimitation);
                },
                changeAddress: function () {
                    this.filterIt(1, this.pageLimitation);
                },
                filterIt: function (pageVal, limit, isAnotherPage = false) {
                    const fL = this.filterList;
                    let paramStr = '';

                    for (const i in fL) {
                        if (Object.prototype.hasOwnProperty.call(fL, i)) {
                            const filter = fL[i];
                            if (filter.selectedVal) {
                                paramStr += `${i}=${filter.selectedVal}&`;
                            }
                        }
                    }

                    if(this.lfAddress) {
                        paramStr = 'address=' + this.lfAddress.trim() + '&' + paramStr;
                    }

                    const fetched = fetch('./essentials/dbs_json.php',
                    {
                        method: 'POST',
                        body: `users&${paramStr}page=${pageVal}&limit=${limit}`,
                        headers:
                        {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    }).then((data) => data.json());
                    fetched.then((data) => {
                        if(data.length >= 1) {
                            this.errorMsg = false;
                            if(isAnotherPage) {
                                data.forEach(e=>{
                                    this.users.push(e);
                                });
                                this.nextPage++;
                                this.newPageAvailable = true;
                            } else {
                                this.nextPage = 2;
                                this.users = data;
                            }
                        } else {
                            if(!isAnotherPage) {
                                this.errorMsg = true;
                                this.users = [];
                            }
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


// objekte
(function() { 
    if (document.body.classList.contains('objekte')) {
        const vm = new Vue({
            el: '.obj-slider-app',
            data: {
                mainImgSrc: null,
                flatImages: [],
                showLeftArrow: false,
                showRightArrow: false,
                scrolledThisTimes: 0,
                thumbsVisible: 3,
                thumbsVisibleBefore: null,
                sliderVisible: true,
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
                        this.showRightArrow = true;
                    } else if (this.scrolledThisTimes == this.imageCount - this.thumbsVisible) {
                        this.showRightArrow = false;
                        this.showLeftArrow = true;
                    } else {
                        this.showLeftArrow = true;
                        this.showRightArrow = true;
                    }
                },
                
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
                        return this.scrolledThisTimes * -(this.flatImages[0].offsetWidth + 10);
                    } else {
                        return 0;
                    }
                }
            },
            methods: {
                handleArrowVisibility: function() {
                    if(this.imageCount <= 1) {
                        this.sliderVisible = false;
                    } else {
                        this.sliderVisible = true;
                    }
                    if (this.imageCount > this.thumbsVisible) {
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
                },
                swipeRight: function() {
                    if (this.scrolledThisTimes <= this.imageCount - this.thumbsVisible) {
                        this.scrolledThisTimes++;
                    }
                },
            }
        });
    }
})();

// user js
(function() { 
    if (document.body.classList.contains('profil-bearbeiten')) {
        Vue.component('address-list-item', {
            props: ['place'],
            template: `
                <li @mousedown="handleAddressClick(place);">{{ placeContent }}</li>
            `,
            computed: {
                placeContent: function() {
                    if(this.place.std) {
                        return `${this.place.std} - ${this.place.ort}`;
                    } else {
                        return `${this.place.ort}`;
                    }
                },
            },
            methods: {
                handleAddressClick: function(place){
                    this.$emit('handle-address-click', place)
                }
            }
        });

        const vm = new Vue({
            el: '.edit-profile-app',
            data: {
                userProfile: {},
                fileList: [],
                objIsSet: false,
                objAddressMenu: {
                    visible: false,
                },
                noPlace: false,
                lastValidObj: {},
                addressList: [],
                maxAllowedSuggestions: 20,
                recentPlaceList: [],
                lfAddress: '',
                name: null,
                gender: null,
                description: null,
                job: null,
                lfQuadratmeter: "",
                lfZimmer: "",
                lfKalt: "",
                lfWarm: "",
                lookingfrom: null,
                birthdate: null,
            },
            watch: {
                lfAddress: function (search) {
                    if (!this.objIsSet) {
                        this.generateAddress(search);
                    }
                },
            },
            computed: {
                placeContent: function() {
                    if(this.place.std) {
                        return `${this.place.std} - ${this.place.ort}`;
                    } else {
                        return `${this.place.ort}`;
                    }
                },
            },
            created: function () {
                fetch('./../essentials/get-session.php')
                .then((json) => json.json())
                .then((sessionId) => {
                    let isUser = sessionId.p_id; 
                    
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

                        if (this.userProfile.lf_adresse) {
                            this.lfAddress = this.userProfile.lf_adresse;
                            this.objIsSet = true;
                            this.objAddressMenu.visible = false;
                            this.lastValidObj.ort = this.lfAddress;
                        }

                        if(this.userProfile.name) {
                            this.name = this.userProfile.name;
                        }
                        if(this.userProfile.gender) {
                            this.gender = this.userProfile.gender;
                        }
                        if(this.userProfile.beschreibung) {
                            this.description = this.htmlDecode(this.userProfile.beschreibung);
                        }
                        if(this.userProfile.job) {
                            this.job = this.userProfile.job;
                        }
                        if(this.userProfile.lf_quadratmeter) {
                            this.lfQuadratmeter = this.userProfile.lf_quadratmeter;
                        }
                        if(this.userProfile.lf_zimmer) {
                            this.lfZimmer = this.userProfile.lf_zimmer;
                        }
                        if(this.userProfile.lf_kaltmiete) {
                            this.lfKalt = this.userProfile.lf_kaltmiete;
                        }
                        if(this.userProfile.lf_warmmiete) {
                            this.lfWarm = this.userProfile.lf_warmmiete;
                        }
                        if(this.userProfile.lookingfrom) {
                            this.lookingfrom = this.userProfile.lookingfrom;
                        } 
                        if(this.userProfile.birthdate) {
                            this.birthdate = this.userProfile.birthdate;
                        }

                    })
                    .catch((err) => {
                        if (isDev) {
                            console.log(err);
                        }
                    });
                })
                .catch((err) => {
                    if (isDev) {
                        console.log(err);
                    }
                });

                fetch('./../js/json/orte.json',
                {
                    headers:
                    {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                })
                .then((res) => res.json())
                .then((data) => {
                    this.placeList = data;
                })
                .catch((err) => {
                    console.log(err);
                });
            },
            methods: {
                showFileDetails: function ($event) {
                    this.fileList = $event.target.files;
                },
                htmlDecode: function (input) {
                    var doc = new DOMParser().parseFromString(input, "text/html");
                    return doc.documentElement.textContent;
                },
                generateAddress: function (search) {
                    if (this.lfAddress.length >= 2) {
                        let searchAddress = this.lfAddress.toLowerCase().trim();
                        
                        this.recentPlaceList = this.placeList.filter(ele => {
                            if (ele.std) {
                                let searchCombi1 = ele.std.toLowerCase() + ' ' + ele.ort.toLowerCase();
                                let searchCombi2 = ele.ort.toLowerCase() + ' ' + ele.std.toLowerCase();
                                let searchCombi3 = ele.std.toLowerCase() + ' - ' + ele.ort.toLowerCase();
                                return ele.ort.toLowerCase().includes(searchAddress) || ele.std.toLowerCase().includes(searchAddress) || searchCombi1.includes(searchAddress) || searchCombi2.includes(searchAddress) || searchCombi3.includes(searchAddress);
                            } else {
                                return ele.ort.toLowerCase().includes(searchAddress);
                            }
                        });

                        if (this.recentPlaceList.length >= this.maxAllowedSuggestions) {
                            this.recentPlaceList = this.recentPlaceList.slice(0, this.maxAllowedSuggestions);
                        }
                        this.objAddressMenu.visible = true;
                    } else {
                        this.recentPlaceList = [];
                    }
                },
                setAddress: function (place) {
                    this.objAddressMenu.visible = false;
                    this.objIsSet = true;
                    this.lastValidObj = place;
                },
                setFirstAddress: function () {
                    this.objAddressMenu.visible = false;
                    this.objIsSet = true;

                    if (this.lfAddress.length < 2) {
                        this.lfAddress = '';
                        this.lastValidObj = {};
                        this.recentPlaceList = [];
                    } else if (this.recentPlaceList.length === 0) {
                        if (!this.objIsEmpty(this.lastValidObj)) {
                            if(this.lastValidObj.std) {
                                this.lfAddress = `${this.lastValidObj.std} -  ${this.lastValidObj.ort}`;
                            } else {
                                this.lfAddress = this.lastValidObj.ort;
                            }
                        } else {
                            this.lfAddress = '';
                            this.lastValidObj = {};
                            this.recentPlaceList = [];
                        }
                    } else if (this.lfAddress !== '' && this.lfAddress.length >= 3 && this.recentPlaceList.length === 1){
                        const firstPlace = this.recentPlaceList[0];
                        if(firstPlace.std) {
                            this.lfAddress = `${firstPlace.std} - ${firstPlace.ort}`;
                        } else {
                            this.lfAddress = `${firstPlace.ort}`;
                        }
                    } else if (this.recentPlaceList.length >= 2) {
                        if (!this.objIsEmpty(this.lastValidObj) && this.lastValidObj.std) {
                            this.lfAddress = `${this.lastValidObj.std} - ${this.lastValidObj.ort}`;
                        } else if(!this.objIsEmpty(this.lastValidObj)) {
                            this.lfAddress = `${this.lastValidObj.ort}`;
                        } else {
                            this.lfAddress = '';
                            this.lastValidObj = {};
                            this.recentPlaceList = [];
                        }
                    }
                },
                objIsEmpty: function(obj) {
                    if(obj) {
                        return (Object.keys(obj).length === 0 && obj.constructor === Object);
                    } else {
                        return true;
                    }
                },
                allowInput: function () {
                    this.objIsSet = false;
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

        Vue.component('flat-item', {
            props: {
                flat: Object,
                page: Number,
                id: [String, Number]
            },
            data: function (){
                return {
                    maxWordLength: 150,
                };
            },
            template: `
                <div class="teaser" :id="id">
                    <div class="teaser-box">
                        <a :href="objLinkPath" class="teaser-img" @click.prevent="savePageToStorage">
                            <img :src="imgLink" alt="Platzhalter">
                        </a> 
                        <div class="teaser-content">
                            <span class="heading">{{ flat.name }}</span>
                            <span class="time">{{ flat.adresse }} </span>
                            <span class="desc">{{ shortenedDesc }}</span>
                            <div class="infoBox">
                                <span><small>Quadratmeter</small> <span>{{ flat.quadratmeter }} m²</span></span>
                                <span><small>Zimmer</small> <span>{{ flat.zimmer }}</span></span>
                                <span><small>Kaltmiete</small> <span>{{ flat.kalt }} €</span></span>
                            </div>
                            <a @click.prevent="savePageToStorage" :href="objLinkPath" class="btn secondary">Mehr erfahren</a>
                        </div>
                    </div> 
                </div> 
            `,
            methods: {
                savePageToStorage: function () {
                    sessionStorage.setItem('flatSavedPage', this.page);
                    sessionStorage.setItem('flatSavedItemId', this.id);
                    window.location = this.objLinkPath;
                }
            },
            computed: {
                shortenedDesc: function () {
                    if (this.flat.beschreibung.length >= this.maxWordLength) {
                        return `${this.flat.beschreibung.slice(0, this.maxWordLength)}...`;
                    }
                    return this.flat.beschreibung;
                },
                objLinkPath: function () {
                    return `${root}/objekte/${this.flat.link}`;
                },
                imgLink: function () {
                    return `${root}/uploads/${this.flat.image_1}`;
                },
            },
        });

        Vue.component('address-list-item', {
            props: ['place'],
            template: `
                <li @mousedown="handleAddressClick(place);">{{ placeContent }}</li>
            `,
            computed: {
                placeContent: function() {
                    if(this.place.std) {
                        return `${this.place.std} - ${this.place.ort}`;
                    } else {
                        return `${this.place.ort}`;
                    }
                },
            },
            methods: {
                handleAddressClick: function(place){
                    this.$emit('handle-address-click', place)
                }
            }
        });

        const vm = new Vue({
            el: '.all-objects',
            data: {
                flatList: [],
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
                lfAddress: '',
                placeList: [],
                recentPlaceList: [],
                maxAllowedSuggestions: 24,
                newPageAvailable: true,
                nextPage: 2,
                pageLimitation: 20
            },
            mixins: [helperFunctions],
            watch: {
                lfAddress: function() {
                    this.refreshPlaceList();
                }
            },
            computed: {
                showSuggestions: function() {
                    if (this.recentPlaceList.length == 0) {
                        return false;
                    } else {
                        return true;
                    }
                }
            },
            created: function(){
                fetch('./js/json/orte.json',
                {
                    headers:
                    {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                })
                .then((res) => res.json())
                .then((data) => {
                    this.placeList = data;
                })
                .catch((err) => {
                    console.log(err);
                });
            },
            mounted: function () {
                // handle if came from flat page
                let savedPage = null;
                const savedPageVal = this.getSessionStorage('flatSavedPage');
                if(savedPageVal) {
                    savedPage = parseInt(savedPageVal) * this.pageLimitation;
                    this.nextPage = parseInt(savedPageVal) + 1;
                }

                let requestStr = '';
                const createdAddress = this.getUrlParameters('lf_address');
                if(createdAddress) {
                    if(savedPage) {
                        requestStr = `wohnungen&address=${createdAddress}&limit=${this.pageLimitation}&savedPage=${savedPage}`
                    } else {
                        requestStr = `wohnungen&address=${createdAddress}&page=1&limit=${this.pageLimitation}`
                    }
                    this.lfAddress = createdAddress;
                } else {
                    if(savedPage) {
                        requestStr = `wohnungen&limit=${this.pageLimitation}&savedPage=${savedPage}`;
                    } else {
                        requestStr = `wohnungen&page=1&limit=${this.pageLimitation}`;
                    }
                }

                const fetched = fetch('./essentials/dbs_json.php',
                {
                    method: 'POST',
                    body: requestStr,
                    headers:
                    {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }).then((data) => data.json());
                fetched.then((data) => {
                    this.flatList = data;
                    window.addEventListener('scroll', this.getNewPage);

                    if(savedPage) {
                        this.$nextTick(function () {
                            const header = document.querySelector('header');
                            const lastVisitedFlat = document.getElementById(this.getSessionStorage('flatSavedItemId'));
                            const scrollAmount = lastVisitedFlat.offsetTop + header.offsetHeight - 16;
                            window.scrollTo(0, scrollAmount);
                            window.sessionStorage.removeItem('flatSavedItemId');
                            window.sessionStorage.removeItem('flatSavedPage');
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            },
            methods: {
                getSessionStorage: function(item) {
                    return window.sessionStorage[item];
                },
                getNewPage: function() {
                    
                    let bodyHeight = document.body.scrollHeight;
                    let scrollBottom = window.scrollY + window.innerHeight;
                    
                    if (this.newPageAvailable && scrollBottom >= bodyHeight - 200) {
                    this.newPageAvailable = false;
                    this.filterIt(this.nextPage, this.pageLimitation, true)
                    }

                },
                eraseSuggestions: function() {
                    this.recentPlaceList = [];
                },
                handleAddressClick: function(place) {
                    if (place.std) {
                        this.lfAddress = place.std + ' - ' + place.ort;
                    } else {
                        this.lfAddress = place.ort;
                    }
                    this.filterIt(1, this.pageLimitation);
                },
                refreshPlaceList: function(){
                    if (this.lfAddress.length >= 2) {
                        let searchAddress = this.lfAddress.toLowerCase().trim();
                        
                        this.recentPlaceList = this.placeList.filter(ele => {
                            if (ele.std) {
                                let searchCombi1 = ele.std.toLowerCase() + ' ' + ele.ort.toLowerCase();
                                let searchCombi2 = ele.ort.toLowerCase() + ' ' + ele.std.toLowerCase();
                                let searchCombi3 = ele.std.toLowerCase() + ' - ' + ele.ort.toLowerCase();
                                return ele.ort.toLowerCase().includes(searchAddress) || ele.std.toLowerCase().includes(searchAddress) || searchCombi1.includes(searchAddress) || searchCombi2.includes(searchAddress) || searchCombi3.includes(searchAddress);
                            } else {
                                return ele.ort.toLowerCase().includes(searchAddress);
                            }
                        });

                        if (this.recentPlaceList.length >= this.maxAllowedSuggestions) {
                            this.recentPlaceList = this.recentPlaceList.slice(0, this.maxAllowedSuggestions);
                        }
                    } else {
                        this.recentPlaceList = [];
                    }
                },
                handleFilterClick: function() {
                    this.filterIt(1, this.pageLimitation);
                },
                changeAddress: function () {
                    this.filterIt(1, this.pageLimitation);
                },
                filterIt: function (pageVal, limit, isAnotherPage = false) {
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

                    if(this.lfAddress) {
                        paramStr = 'address=' + this.lfAddress + '&' + paramStr;
                    }

                    const fetched = fetch('./essentials/dbs_json.php',
                    {
                        method: 'POST',
                        body: `wohnungen&${paramStr}page=${pageVal}&limit=${limit}`,
                        headers:
                        {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    }).then((data) => data.json());
                    fetched.then((data) => {
                        // Seitenanzahlrelevantes
                        if(data.length >= 1) {
                            this.errorMsg = false;
                            if(isAnotherPage) {
                                data.forEach(e=>{
                                    this.flatList.push(e);
                                });
                                this.nextPage++;
                                this.newPageAvailable = true;
                            } else {
                                this.nextPage = 2;
                                this.flatList = data;
                            }
                        } else {
                            if(!isAnotherPage) {
                                this.errorMsg = true;
                                this.flatList = [];
                            }
                        }

                        this.recentPlaceList = [];
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
        Vue.component('flat-image', {
            props: ['file', 'fId', 'edit-mode'],
            data: function() {
                return {
                    imgSrc: null,
                    fileName: null,
                    removeIsVisible: null,
                    copiedFile: null
                }
            },
            template: `
                <fieldset class="image-ctn">
                    <label class="opt-sec" :for="'obj-image-' + fId">
                        <div class="icon-ctn">
                            <i class="icon fa fa-images"></i>
                            <span>Objektbild {{ fId }}</span>
                        </div>
                        
                        <span class="img-placeholder optional">
                            <span v-show="fileName" class="file-item"><img :src="imgSrc" alt="Bild" class="obj-image__preview"> {{ fileName }}</span>
                            <span class="img-btn" v-show="!fileName">
                                Bild hochladen <i class="fa fa-plus"></i> 
                            </span>
                        </span>
                    </label>
                    <div v-show="removeIsVisible" @click="removeFile" class="removeBtn"><i class="fa fa-times"></i></div>
                    <input type="file" @click="copyFile" @change="showPreview" :name="'obj-image-' + fId" :id="'obj-image-' + fId" accept="image/*">
                </fieldset>
            `,
            mounted: function() {
                if(this.file.fileName) {
                    this.imgSrc = root + '/uploads/' + this.file.fileName;
                    this.fileName = this.file.fileName;
                    this.removeIsVisible = true;
                }
            },
            methods: {
                isDataURL: function(s) {
                    let regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
                    return !!s.match(regex);
                },
                copyFile: function(event) {
                    this.copiedFile = event.target.files;
                },
                removeFile: function(){
                    this.$emit('delete-from-file-list', (this.fId - 1));
                },
                showPreview: function(event) {
                    if (event.target.value) {
                        let imgFile = event.target.files[0];

                        this.readUrl(imgFile);
                        this.fileName = imgFile.name;
                        this.removeIsVisible = true;
                        
                        this.$emit('show-add-img', imgFile, this.fId - 1);
                    } else {
                        event.target.files = this.copiedFile;
                    }
                },
                readUrl: function (input) {
                    if (input.size && input.size > 1) {
                        let me = this;
                        let reader = new FileReader();

                        reader.onload = function(e) {
                            me.imgSrc = e.target.result;
                        }
                        
                        reader.readAsDataURL(input); // convert to base64 string
                    }
                }
            },
        });
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
                lastValidObj: null,
                addressList: [],
                limitAddressSuggestions: 10,
                flatDetails: {
                    name: null,
                    quadratmeter: null,
                    zimmer: null,
                    bad: null,
                    kalt: null,
                    warm: null,
                    typ: null,
                    etage: null,
                    einzug: null,
                    adresse: null,
                    beschreibung: null
                },
                imageFileList: [],
                addImageIsVisible: false,
                isEditMode: false
            },
            mixins: [helperFunctions],
            watch: {
                objAddress: function (search) {
                    if (!this.objIsSet) {
                        this.generateAddress(search);
                    }
                },
            },
            created: function() {
                fetch('./../essentials/get-session.php')
                .then((json) => json.json())
                .then((sessionId) => {
                    let isUser = sessionId.p_id; 
                    let lfFlat = this.getUrlParameters('flat_id');
                    
                    if(lfFlat){
                        this.isEditMode = true;
                        fetch('./../essentials/dbs_json.php',
                        {
                            method: 'POST',
                            body: 'flat_by_id=' + lfFlat,
                            headers:
                            {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                        })
                        .then((data) => data.json())
                        .then((data) => {
                            let flatData = data[0];

                            if (flatData.p_id == isUser) {
                                if (flatData.name) {
                                    this.flatDetails.name = flatData.name;
                                }
                                if (flatData.quadratmeter) {
                                    this.flatDetails.quadratmeter = flatData.quadratmeter;
                                }
                                if (flatData.zimmer) {
                                    this.flatDetails.zimmer = flatData.zimmer;
                                }
                                if (flatData.bad) {
                                    this.flatDetails.bad = flatData.bad;
                                }
                                if (flatData.kalt) {
                                    this.flatDetails.kalt = flatData.kalt;
                                }
                                if (flatData.warm) {
                                    this.flatDetails.warm = flatData.warm;
                                }
                                if (flatData.typ) {
                                    this.flatDetails.typ = flatData.typ;
                                }
                                if (flatData.etage) {
                                    this.flatDetails.etage = flatData.etage;
                                }
                                if (flatData.einzug) {
                                    this.flatDetails.einzug = flatData.einzug;
                                }
                                if (flatData.adresse) {
                                    this.objAddress = flatData.adresse;

                                    const flatArr = flatData.adresse.split(' - ');
                                    const betweenArr = flatArr[0].split(' ');
                                    let flatObj = {};

                                    if (betweenArr.length >= 2) {
                                        flatObj.plz = betweenArr[0];
                                        flatObj.std = betweenArr[1];
                                        flatObj.ort = flatArr[1];
                                    } else {
                                        flatObj.plz = flatArr[0];
                                        flatObj.ort = flatArr[1];
                                    } 

                                    this.setAddress(flatObj);
                                }
                                if (flatData.beschreibung) {
                                    this.flatDetails.beschreibung = flatData.beschreibung
                                }
                            }

                            if(flatData['image_1'] !== 'placeholder.jpg') {
                                this.imageFileList.push({
                                    fileName: flatData['image_1'],
                                    id: this.randomId()
                                });
                            }
                            if (flatData['image_2']) {
                                this.imageFileList.push({
                                    fileName: flatData['image_2'],
                                    id: this.randomId()
                                });
                            }
                            if (flatData['image_3']) {
                                this.imageFileList.push({
                                    fileName: flatData['image_3'],
                                    id: this.randomId()
                                });
                            }
                            if (flatData['image_4']) {
                                this.imageFileList.push({
                                    fileName: flatData['image_4'],
                                    id: this.randomId()
                                });
                            }
                            if (flatData['image_5']) {
                                this.imageFileList.push({
                                    fileName: flatData['image_5'],
                                    id: this.randomId()
                                });
                            }
                            if (flatData['image_6']) {
                                this.imageFileList.push({
                                    fileName: flatData['image_6'],
                                    id: this.randomId()
                                });
                            }
                            if (flatData['image_7']) {
                                this.imageFileList.push({
                                    fileName: flatData['image_7'],
                                    id: this.randomId()
                                });
                            } else {
                                this.imageFileList.push({
                                    fileName: '',
                                    id: this.randomId()
                                });
                            }

                        })
                        .catch((err) => {
                            if (isDev) {
                                console.log(err);
                            }
                        })
                    } else {
                        this.imageFileList.push({
                            fileName: '',
                            id: this.randomId()
                        });
                    }
                })
                .catch((err) => {
                    if (isDev) {
                        console.log(err);
                    }
                });

                fetch('./../js/json/plz-ort-min.json',
                {
                    headers:
                    {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                })
                .then((res) => res.json())
                .then((data) => {
                    this.addressList = data;
                })
                .catch((err) => {
                    console.log(err);
                });
            },
            methods: {
                deleteFromFileList: function(file_id) {
                    this.imageFileList.splice(file_id, 1);
                    this.addImage();
                },
                handleFocusOut: function(imgFile, index) {
                    this.addImageIsVisible = true;
                    this.imageFileList[index].fileName = imgFile.name;
                    this.addImage();
                },
                addImage: function() {
                    this.addImageIsVisible = false;
                    if (this.imageFileList.length < this.maxFiles && this.imageFileList[this.imageFileList.length - 1].fileName !== '') {
                        this.imageFileList.push({
                            fileName: '',
                            id: this.randomId()
                        });
                        if(this.imageFileList.length == this.maxFiles) {
                            this.addImageIsVisible = false;
                        } 
                    }
                },
                deleteWholeInput: function(event) {
                    event.target.value = '';
                },
                generateAddress: function (search) {

                    // reset array on new Search
                    this.placeList.length = 0;
                    
                    if (search.length > 2) {
                        search = search.toLowerCase();
                        this.objAddressMenu.visible = true;
                        this.showLoader = true;
                        
                        for (let i = 0; i < this.addressList.length; i++) {
                            if (this.placeList.length < this.limitAddressSuggestions) {
                                let ele = this.addressList[i];

                                let validPostal = ele.plz.toLowerCase().includes(search);
                                let validPlace = ele.ort.toLowerCase().includes(search);
                                let validCity = false;

                                if(ele.std) {
                                    validCity = ele.std.toLowerCase().includes(search);
                                }

                                if (validPostal || validPlace || validCity ) {
                                    this.placeList.push(ele);
                                }
                            } else {
                                break;
                            }
                        }
                        this.showLoader = false;
                        this.noPlace = false;
                        this.lastValidObj = this.placeList[0];
                        if(this.placeList.length == 0) {
                            this.noPlace = true;
                            this.showLoader = false;
                            this.placeList.length = 0;
                        }
                    } else {
                        this.objAddressMenu.visible = false;
                        this.noPlace = false;
                        this.showLoader = true;
                    }
                },
                setAddress: function (place) {
                    this.objAddressMenu.visible = false;
                    this.objIsSet = true;
                    this.lastValidObj = place;
                },
                setFirstAddress: function () {
                    this.objAddressMenu.visible = false;
                    this.objIsSet = true;

                    if (this.objAddress.length <= 2) {
                        this.objAddress = '';
                    } else if (this.placeList.length === 0) {
                        if (this.lastValidObj) {
                            if(this.lastValidObj.std) {
                                this.objAddress = `${this.lastValidObj.plz} ${this.lastValidObj.std} - ${this.lastValidObj.ort}`;
                            } else {
                                this.objAddress = `${this.lastValidObj.plz} - ${this.lastValidObj.ort}`;
                            }
                        } else {
                            this.objAddress = '';
                        }
                    } else if (this.objAddress !== '' && this.objAddress.length >= 3 && this.placeList.length === 1){
                        const firstPlace = this.placeList[0];
                        if(firstPlace.std) {
                            this.objAddress = `${firstPlace.plz} ${firstPlace.std} - ${firstPlace.ort}`;
                        } else {
                            this.objAddress = `${firstPlace.plz} - ${firstPlace.ort}`;
                        }
                    } else if (this.placeList.length >= 2) {
                        if (this.lastValidObj && this.lastValidObj.std) {
                            this.objAddress = `${this.lastValidObj.plz} ${this.lastValidObj.std} - ${this.lastValidObj.ort}`;
                        } else {
                            this.objAddress = `${this.lastValidObj.plz} - ${this.lastValidObj.ort}`;
                        }
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
            },
        });
    }
}());

(function (){
    // Nachrichten Center App
    if (document.body.classList.contains('nachrichten-center')) {
        const chatMixin = {
            methods: {
                saveChatVisit: function(user, c_id) {
                    let fetchBody = `user_id=${user}&c_id=${c_id}&csrf-token=${window.csrfToken}`;
                    
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
                }
            }
        }
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
                },
                newMessage: {
                    type: Array,
                    required: false,
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
                    <div v-if="!hasUserImage" class="userInitial">
                        <span>{{ acronym }}</span>
                    </div>
                    <span>{{ user.name }}</span>
                </div>
            `,
            mixins: [chatMixin],
            watch: {
                newMessage: function() {
                    for(let i = 0; i < this.newMessage.length; i++) {
                        const msgData = this.newMessage[i];
                        if(msgData.send_p_id == this.user.p_id) {
                            if(msgData.send_p_id != this.activeuser) {
                                this.seenAll = false;
                            } else {
                                this.saveChatVisit(msgData.rec_p_id, msgData.c_id);
                            }
                            break;
                        }

                    }
                }
            },
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
                }
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
            props: ['flat', 'userList', 'activeChatWithUser'],
            data: function(){
                return {
                    user: {},
                }
            },
            template: `
                <div class="flat-details-user-details">
                    <a v-if="flat" class="flat-details" :href="flatLink" title="zum Mietobjekt wechseln">
                        <div class="flat-preview-img primaryOverlay">
                            <img :src="imgLink" class="cover">
                        </div>
                        <div class="description">
                            <span class="headline">{{ flat.name }}</span>
                            <span class="address">{{ flat.adresse }}</span>
                        </div>
                    </a>
                    <a :href="userUrl" :class="{ isAlone : !flat }" class="flat-details-user-details__user">
                        <img v-if="hasUserImage" :src="imageUrl" :alt="user.name">
                        <div v-if="!hasUserImage" class="userInitial">
                            <span>{{ acronym }}</span>
                        </div>
                        <span class="name">
                            {{ user.name }}
                            <span>
                                Profil&nbsp;ansehen
                            </span>
                        </span>
                    </a>
                            
                </div>
            `,
            created: function() {
                this.changeUser();
            },
            watch: {
                activeChatWithUser: function() {
                    this.changeUser();
                },
            },
            methods: {
                changeUser() {
                    for (let i = 0; i < this.userList.length; i++) {
                        if (this.userList[i].p_id == this.activeChatWithUser) {
                            this.user = this.userList[i];
                            break;
                        }
                    }
                    
                    if (this.user.profilepic) {
                        this.hasUserImage = true;
                    } else {
                        this.hasUserImage = false;
                    }
                }
            },
            computed: {
                userUrl: function() {
                    return `${root}/user/user.php?id=${this.user.p_id}`;
                },
                imageUrl: function () {
                    return `../uploads/${this.user.profilepic}`;
                },
                acronym: function() {
                    let userName = this.user.name.split(' ');
                    if (userName.length >= 2) {
                        return userName[0][0] + userName[1][0];
                    } else {
                        return userName[0][0];
                    }
                },
                imgLink: function() {
                    return `${root}/uploads/${this.flat.image_1}`;
                },
                flatLink: function() {
                    return `${root}/objekte/${this.flat.link}`;
                }
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
                sentFromFlat: null,
                sentFromUser: null,
                sentParamsValid: false,
                sentIsAlreadyInChats: false,
                activeUserIds: [],
                updateChatTime: 3000,
                newMessageData: null,
                refreshAmount: 0
            },
            mixins: [chatMixin],
            created: function () {
                // check if valid session exists
                fetch('./../essentials/get-session.php')
                .then((json) => json.json())
                .then((sessionId) => {
                    this.isUser = sessionId.p_id; 
                    this.updateChat(true);
                })
                .catch((err) => {
                    if (isDev) {
                        console.log(err);
                    } else {
                        this.errorMsg.isError = true;
                    }
                });
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

                    let lastRelevantChatId, lastVisited;

                    for (let i = relevantChat[1].length - 1; i >= 0; i--) {
                        let msg = relevantChat[1][i];
                        if(msg.rec_p_id == this.isUser) {
                            lastVisited = msg.last_visited;
                            lastRelevantChatId = msg.c_id;
                            break;
                        }
                    }

                    if(!lastVisited) {
                        this.saveChatVisit(this.isUser, lastRelevantChatId);
                    }
                    
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
                        // update chat every 2 seconds
                        this.updateTimer = setInterval(this.updateChat, this.updateChatTime);
                        this.$nextTick(function () {
                            this.setScrollPos();
                        });
                    }

                    if(this.sentParamsValid && isFirstChat) {
                        this.firstChat = false;
                        this.activeFlat = this.sentFromFlat;
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
                                this.firstChat = false;
                                // if new chats are not the same as active chat set scroll
                            } else if (!isSameChatList) {
                            }
                        });
                    }

                    
                },
                updateChat: async function (isFirst = false, fetchURLParams = true) {
                    this.refreshAmount++;
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

                        if(!isFirst) {
                            if (!this.isSameArray(this.chatList, newChats)) {
                                let fetchBody = `csrf-token=${window.csrfToken}`;
                    
                                fetch('./../actions/get-latest-chats.php',
                                {
                                    method: 'POST',
                                    body: fetchBody,
                                    headers:
                                    {
                                        'Content-Type': 'application/x-www-form-urlencoded',
                                    },
                                })
                                .then(data=>data.json())
                                .then(data=>{
                                    if(data.length >= 1){
                                        this.newMessageData = data;
                                    }
                                })
                                .catch(err=> {
                                    console.log(err);
                                });
                            }
                        }

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

                },
                setScrollPos: function () {
                    this.$refs.chatCtn.scrollTop = 30000000;
                },
                onSubmit: async function () {
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
    }
}());


(function (){
    // Nachrichten Center App
    if (document.body.classList.contains('settings')) {
        Vue.component('account-tab', {
            data: function () {
                return {
                    hasUserImage: false,
                    headline: 'Accounteinstellungen',
                    windowIsOpen: false,
                    firstNewPassword: null,
                    secondNewPassword: null,
                    passwordsNotTheSame: false
                };
            },
            template: `
                <div class="account-tab">
                    <h4 class="align-left">{{ headline }}</h4>
                    <div class="whiteBox morePad">
                        <span class="account-tab__heading">Passwort ändern</span>
                        <p>Bitte achte zu deiner eigenen Sicherheit darauf, deine Daten nicht an Dritte weiterzugeben. Bei uns sind deine Daten in Sicherheit, da auch wir diese nicht
                        an Dritte weitergeben. Solltest du hierzu fragen haben kannst du uns gerne jederzeit kontaktieren.</p>
                        <form @submit.prevent="checkForPasswords($event);" action="${root}/actions/change-password.php" method="POST" class="default">
                            <input type="hidden" id="csrf-token" name="csrf-token" value="${window.csrfToken}">
                            <fieldset class="account-tab__fieldset">
                                <label class="account-tab__label" for="acc_pw_old"><i class="fa fa-key icon-space-right"></i> Altes Passwort</label>
                                <input name="acc_pw_old" id="acc_pw_old" required oninvalid="this.setCustomValidity('Bitte gib dein altes Passwort ein')" oninput="setCustomValidity('')" type="password" placeholder="Bitte altes Passwort eingeben"/>
                            </fieldset>
                            <fieldset class="account-tab__fieldset">
                                <label class="account-tab__label" for="acc_pw_new"><i class="fa fa-key icon-space-right"></i> Neues Passwort</label>
                                <input v-model="firstNewPassword" name="acc_pw_new" minlength="6" id="acc_pw_new" type="password" placeholder="Bitte neues Passwort eingeben" required oninvalid="this.setCustomValidity('Bitte gib dein neues Passwort ein')" oninput="setCustomValidity('')"/>
                            </fieldset>
                            <fieldset class="account-tab__fieldset">
                                <label :class="{alert : passwordsNotTheSame}" class="account-tab__label" for="acc_pw_new_rep"><i class="fa fa-key icon-space-right"></i> Wiederholen</label>
                                <input v-model="secondNewPassword" name="acc_pw_new_rep" minlength="6" id="acc_pw_new_rep" type="password" placeholder="Bitte neues Passwort wiederholen" required oninvalid="this.setCustomValidity('Bitte gib dein neues Passwort erneut ein')" oninput="setCustomValidity('')"/>
                            </fieldset>
                            <span class="error" v-if="passwordsNotTheSame"">Deine Passwörter stimmen nicht überein.</span>
                            <button type="submit" class="account-tab__button--delete btn secondary"><i class="fa fa-edit"></i> Passwort ändern</button>
                        </form>
                    </div>
                    <div class="whiteBox morePad">
                        <span class="account-tab__heading">Account löschen</span>
                        <p>Du möchtest wirklich deinen Account löschen? Nimm dir noch einmal eine ruhige Minute und denke darüber nach für was du dich gerade entscheidest.
                        Trotzdem noch? Kann man nichts machen.</p>
                        <a href="javascript:void(0)" @click="openWindow" class="account-tab__button--delete btn alert"><i class="fa fa-trash-alt icon-space-right"></i> Account löschen</a>
                        <div class="account-tab__delete-window" :class="{ active: windowIsOpen }">
                            <div class="account-tab__delete-window__content">
                                <span class="h4">Account löschen</span>
                                <span>Wenn du deinen Account wirklich löschen möchtest, gebe dein Passwort ein und drücke den Bestätigen-Button</span>
                                <form action="${root}/actions/delete-user.php" method="POST" class="account-tab__delete-window__buttons default">
                                    <input type="hidden" id="csrf-token" name="csrf-token" value="${window.csrfToken}">
                                    <fieldset class="account-tab__fieldset">
                                        <label class="account-tab__label--small" for="user_del_pw"><i class="fa fa-key icon-space-right"></i> Passwort</label>
                                        <input type="password" name="user_del_pw" id="user_del_pw" required oninvalid="this.setCustomValidity('Bitte gib dein Passwort ein')" oninput="setCustomValidity('')"/>
                                    </fieldset>

                                    <button type="submit" class="btn alert"><i class="fa fa-trash-alt icon-space-right"></i> Bestätigen</button>
                                    <span class="btn secondary" @click="closeWindow"><i class="fa fa-times icon-space-right"></i> Abbrechen</span>
                                </form>
                            </div>
                            <div class="account-tab__delete-window__close" @click="closeWindow"></div>
                        </div>
                    </div>

                </div>
            `,
            methods: {
                checkForPasswords: function($event) {
                    if(this.firstNewPassword !== this.secondNewPassword) {
                        this.passwordsNotTheSame = true;
                    } else {
                        $event.target.submit();
                    }
                },
                openWindow: function() {
                    this.windowIsOpen = true;
                },
                closeWindow: function() {
                    this.windowIsOpen = false;
                }
            }
        });
        const vm = new Vue({
            el: '.user-settings',
            data: {
                activeUserSetting: 'account-tab',
            },
            created: function () {
                console.log(`Hier entsteht eine neue Entwicklungsumgebung`)
            },
            methods: {
                changeActiveUserComp: function(activeSetting) {
                    this.activeUserSetting = activeSetting;
                }
            },
        });
    }
}());

(function (){
    // delete every storage when not on wohnung-finden or flat-page
    if (!document.body.classList.contains('wohnung-finden') && !document.body.classList.contains('objekte')) {
        window.sessionStorage.removeItem('flatSavedItemId');
        window.sessionStorage.removeItem('flatSavedPage');
    }
    if (!document.body.classList.contains('mieter-finden') && !document.body.classList.contains('user-template')) {
        window.sessionStorage.removeItem('userSavedItemId');
        window.sessionStorage.removeItem('userSavedPage');
    }
}());