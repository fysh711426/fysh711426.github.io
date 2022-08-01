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
        isLoaded: false,
        errorImage: null,
        datas: []
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
            $m.selectMenu(this.menu);
            $m.selectSubMenu(this.submenu);
            $m.gotop('.gotop');
            this.errorImage = await this.loadedErrorImage(
                'https://cdn.statically.io/gh/fysh711426/fysh711426.github.io/master/mini-form-ui/images/default-head-176x176.png');
            this.datas = await this.getData();
            this.isLoaded = true;
            setTimeout(function () {
                $m.tooltip('.tooltip');
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
        }
    },
    mounted() {
        this.init();
    }
});
