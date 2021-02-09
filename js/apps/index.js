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

export const vm = new Vue({
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