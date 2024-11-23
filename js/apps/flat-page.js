import Vue from './../vue.js';

export const vm = new Vue({
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