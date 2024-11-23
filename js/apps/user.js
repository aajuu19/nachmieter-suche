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