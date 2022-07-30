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
            await this.getData();
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
                this.datas = response.data;
            }
        }
    },
    mounted() {
        this.init();
    }
});
