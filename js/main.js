// wohnung-finden
(function(){
    if(document.body.classList.contains('wohnung-finden')) {
        Vue.component('min-max', {
            props: ['element'],
            template: `
                <div class="min-max">
                    <span @click="toggleActive('min')" :class="{ active : element.min }" class="min">min</span>
                    <span @click="toggleActive('max')" :class="{ active : element.max }" class="max">max</span>
                </div>
            `,
            methods: {
                toggleActive: function(direction) {
                    if(direction === 'min') {
                        this.element.min = true;
                        this.element.max = false;
                    } else if(direction === 'max') {
                        this.element.min = false;
                        this.element.max = true;
                    }
                }
            }
        });

        Vue.component('filter-box', {
            props: ['ele'],
            template: `
                <div class="filter">
                    <span class="heading">{{ ele.name }}</span>
                    <input v-model="ele.val" type="number" :max="ele.maxVal" :min="ele.minVal" :step="ele.step">
                    <min-max v-bind:element="ele"></min-max>
                </div>
            `
        });
        
        Vue.component('object-item', {
            props: ['object'],
            data: function(){
                return {
                    maxWordLength: 150
                }
            },
            template: `
                <div class="teaser">
                    <div class="teaser-box">
                        <div class="teaser-img">
                            <img src="images/layout/placeholder.png" alt="Platzhalter">
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
                            <a :href="'http://localhost:8888/nachmieter-suche/objekte/'+ object.link" class="btn secondary">Mehr erfahren</a>
                        </div>
                    </div> 
                </div> 
            `,
            computed: {
                shortenedDesc: function() {
                    if(this.object.beschreibung.length >= this.maxWordLength) {
                        return this.object.beschreibung.slice(0, this.maxWordLength)+'...';
                    } else {
                        return this.object.beschreibung;
                    }
                }
            }
        });

        let vm = new Vue({
            el: '.all-objects',
            data: {
                objects: [],
                filterList: {
                    quadratmeter: { 
                        id: 1, 
                        name: 'Quadratmeter', 
                        val: '', minVal: 20, maxVal: 1000, step: 5, 
                        min: true, 
                        max: false 
                    },
                    zimmer: { 
                        id: 2, 
                        name: 'Zimmer', 
                        val: '', minVal: 1, maxVal: 100, step: 0.5, 
                        min: true, 
                        max: false 
                    },
                    kalt: { 
                        id: 3, 
                        name: 'Kaltmiete', 
                        val: '', minVal: 50, maxVal: 1000000, step: 10, 
                        max: true 
                    },
                    etage: { 
                        id: 4, 
                        name: 'Etage', 
                        val: '', minVal: 1, maxVal: 200, step: 1, 
                        min: false,
                        max: true 
                    }
                },
                errorMsg: false                
            },
            created: function() {
                let fetched = fetch('essentials/dbs_json.php?page=1&limit=50').then(data=>data.json());
                fetched.then((data)=>{
                    vm.objects = data;

                    // for debugging
                    // vm.objects.forEach(e=>console.log(e));
                })
                .catch((err)=>{
                    console.log(err);
                })
            },
            methods: {
                filterIt: function() {
                    const fL = this.filterList;
                    let paramStr = '';

                    for(let i in fL) {
                        const filter = fL[i];
                        const getMaxMin = function(){
                            if(filter.min == true) {
                                return 'min'
                            } else if(filter.max = true) {
                                return 'max';
                            }
                        }
                        if(filter.val !== '') {
                            paramStr += i+'='+getMaxMin()+'-'+filter.val+'&';
                        }
                    }

                    let fetched = fetch('essentials/dbs_json.php?'+paramStr+'page=1&limit=50').then(data=>data.json());
                    fetched.then((data)=>{
                        this.objects = data;
                        if(this.objects.length === 0) {
                            this.errorMsg = true
                        } else {
                            this.errorMsg = false
                        }
                    })
                    .catch((err)=>{
                        console.log(err);
                    })
                }
            }
        });
    }
})();


// register-login page
(function(){
    if(document.body.classList.contains('registrierung-login')) {
        let vm = new Vue({
            el: '.register-login-app',
            data: {
                registrationShow: true,
                loginShow: false,
                logMail: '',
                regMail: ''
            },
            created: function() {
                const loc = document.location.search.substr(1);
                const clearLoc = loc.split('&');

                if(clearLoc) {
                    this.changeVal(clearLoc[0]);
                }
            },
            methods: {
                changeVal: function(operation) {
                    if(operation == 'login') {
                        this.loginShow = true;
                        this.registrationShow = false;
                    } else if(operation == 'register') {
                        this.loginShow = false;
                        this.registrationShow = true;
                    }
                },
                validate: function ($event) {
                    const form = $event.target;

                    const mail = form.querySelector('input[type=mail]');
                    // check if email is valid
                    var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;                    
                    if(!reg.test(String(mail.value).toLowerCase())) {
                        mail.classList.add('error');
                        mail.setCustomValidity('Bitte gib eine gültige E-Mail-Adresse ein.');
                        mail.reportValidity();
                    } else {
                        mail.classList.remove('error');
                        form.submit();
                    }

                    const allInputs = form.querySelectorAll('input[type=text], input[type=password]');
                    allInputs.forEach(e=>{
                        if(e.value.length === 0) {
                            e.classList.add('error');
                        } else {
                            e.classList.remove('error');
                            
                        }
                    });
                }
            }
        });
    }
})();

// new object page
(function(){
    if(document.body.classList.contains('neues-objekt')) {
        let timeOut;
        let vm = new Vue({
            el: '.obj-ctn',
            data: {
                objIsSet: false,
                objAddress: '',
                objAddressMenu: {
                    visible: false
                },
                placeList: [],
                waitForTypedSpeed: 600,
                showLoader: true,
                noPlace: false
            },
            watch: {
                objAddress: function(search) {                
                    if(!this.objIsSet) {
                        if(timeOut) {
                            clearTimeout(timeOut);
                        }
                        timeOut = setTimeout(()=>{
                            this.generateAddress(search);
                        }, this.waitForTypedSpeed);
                    }
                }
            },
            methods: {
                generateAddress: function(search) {
                    // reset array on new Search
                    this.placeList.length = 0;
                        
                    // set searchString and replace all whitespaces
                    let searchStr = search.replace(/ /g, '%20');
                    if(searchStr.length > 2) {
                        let searchQuery = `https://public.opendatasoft.com/api/records/1.0/search/?dataset=postleitzahlen-deutschland&q=${searchStr}`;
                        let fetched = fetch(searchQuery).then(res=>res.json());
                        this.objAddressMenu.visible = true;
                        this.showLoader = true;
                        
                        fetched.then(data=> {
                            let places = data.records;
                            // check if results exist
                            if(places.length >= 1) {
                                
                                places.forEach(e=>{
                                    let ortData = e.fields.note;
                                    let plzData = e.fields.plz;
                                    
                                    this.placeList.push({ort: ortData, plz: plzData});
                                });
                                this.showLoader = false;
                                this.noPlace = false;
                                // console.log(this.placeList);
                            } else {
                                // do this if not
                                // this.objAddressMenu.visible = false;

                                // reset array if non result
                                this.noPlace = true;
                                this.showLoader = false;
                                this.placeList.length = 0;
                                // console.log("kein Ergebnis");
                            }
                        });
                        
                    } else {
                        this.objAddressMenu.visible = false;
                        this.noPlace = false;
                        this.showLoader = true
                        // this.timeoutActive = false;
                    }
                    
                },
                setAddress: function(e) {
                    clearTimeout(timeOut);
                    this.objAddressMenu.visible = false;
                    this.objIsSet = true;

                    this.objAddress = e.target.textContent;
                },
                setFirstAddress: function() {
                    clearTimeout(timeOut);
                    this.objAddressMenu.visible = false;
                    this.objIsSet = true;

                    if(this.placeList.length === 0) {
                        this.objAddress = '';
                    } else {
                        let firstPlace = this.placeList[0];
                        this.objAddress = `${firstPlace.plz} ${firstPlace.ort}`;
                    }
                },
                allowInput: function() {
                    this.objIsSet = false;
                    this.showLoader = true;
                }
            }
        });
    }
})();