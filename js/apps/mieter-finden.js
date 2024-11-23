
import Vue from './../vue.js';

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
            return `${document.location.origin}/nachmieter-suche/user/user.php?id=${this.user.p_id}`;
        },
        imgLink: function () {
            if(!this.user.profilepic) {
                return `${document.location.origin}/nachmieter-suche/uploads/placeholder.jpg`;
            }
            return `${document.location.origin}/nachmieter-suche/uploads/${this.user.profilepic}`;
        },
    },
});
export const vm = new Vue({
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
        }).then((data) => data.json());
        fetched.then((data) => {
            this.users = data;
            window.addEventListener('scroll', this.getNewPage);

            if(savedPage) {
                this.$nextTick(function () {
                    const header = document.querySelector('header');
                    const lastVisitedFlat = document.getElementById(this.getSessionStorage('userSavedItemId'));
                    const scrollAmount = lastVisitedFlat.offsetTop + header.offsetHeight - 16;
                    window.scrollTo(0, scrollAmount);
                    window.sessionStorage.removeItem('userSavedItemId');
                    window.sessionStorage.removeItem('userSavedPage');
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