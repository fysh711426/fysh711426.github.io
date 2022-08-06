var vm = new Vue({
    el: '#app',
    data: {
        // apiBase: 'https://cdn.statically.io/gh/fysh711426/VtuberData/master/api/',
        apiBase: 'https://raw.githubusercontent.com/fysh711426/VtuberData/master/api/',
        menu: '',
        submenu: '',
        day: '',
        showDay: false,
        showRankVar: false,
        errorImage: null,
        isLoaded: false,
        datas: [],
        showCount: 20,
        showSpinner: false,
        showSpinnerBlock: false,
        isLoadMore: false,
        nameOver: null,
        videoOver: null
    },
    methods: {
        init: async function () {
            this.menu = getParameter('m') || 'popular';
            this.submenu = getParameter('s') || 'tw';
            if (this.menu === 'popular' || this.menu === 'singing') {
                this.day = getParameter('d') || '7';
                this.showDay = true;
            }
            this.showRankVar = true;
            // if (this.menu === 'popular' || this.menu === 'subscribe') {
            //     this.showRankVar = true;
            // }
            progress.start();
            selectMenu(this.menu);
            selectSubMenu(this.submenu);
            gotop('.gotop');
            onScrollEnd(this.onScrollEnd, 50);
            this.errorImage = await this.loadedErrorImage(
                'https://cdn.statically.io/gh/fysh711426/fysh711426.github.io/master/mini-form-ui/images/default-head-176x176.png');
            this.datas = await this.getData();
            this.checkSpinnerBlock();
            var _this = this;
            setTimeout(function () {
                _this.isLoaded = true;
                setTimeout(function () {
                    tooltip('.tooltip');
                    spinner('.spinner');
                    progress.done();
                }, 1);
            }, 1);
        },
        getApi: function () {
            return this.apiBase +
                this.menu + '_' +
                this.submenu + (this.showDay ? '_day' + this.day : '') + '.json';
        },
        getData: async function () {
            var api = this.getApi();
            if (api) {
                var response = await axios.get(api);
                return response.data;
            }
        },
        onScrollEnd: function() {
            if (!this.isLoadMore) {
                this.isLoadMore = true;
                this.showSpinner = true;
                setTimeout(() => {
                    if (this.showCount < this.datas.length) {
                        this.showCount += 20;
                    }
                    this.checkSpinnerBlock();
                    this.isLoadMore = false;
                    this.showSpinner = false;
                }, 500);
            }
        },
        checkSpinnerBlock: function() {
            this.showSpinnerBlock = false;
            if (this.showCount < this.datas.length) {
                this.showSpinnerBlock = true;
            }
        },
        imgError: function (e) {
            if (this.errorImage) {
                e.target.src = this.errorImage;
            }
        },
        loadedErrorImage: function (url) {
            return new Promise(function (resolve) {
                var img = new Image();
                img.onload = function () {
                    if (this.complete === true) {
                        resolve(url);
                        img = null;
                    }
                }
                img.onerror = function () {
                    resolve(null);
                    img = null;
                }
                img.src = url;
            });
        },
        onNameOver: function(item) {
            this.nameOver = item.channelUrl;
        },
        onVideoOver: function(item) {
            this.videoOver = item.channelUrl;
        },
        onItemMounted: function(el) {
            tooltip('#' + el.id, {
                template: '.video-tooltip-template',
                placement: 'left'
            });
        }
    },
    mounted() {
        this.init();
    }
});
