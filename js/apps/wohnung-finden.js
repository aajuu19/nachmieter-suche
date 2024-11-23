import Vue from './../vue.js';

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
            return `${document.location.origin}/nachmieter-suche/objekte/${this.flat.link}`;
        },
        imgLink: function () {
            return `${document.location.origin}/nachmieter-suche/uploads/${this.flat.image_1}`;
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

export const vm = new Vue({
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