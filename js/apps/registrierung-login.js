import Vue from './../vue.js';

export const vm = new Vue({
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