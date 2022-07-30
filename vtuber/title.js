(function () {
    var menu = getParameter('m') || 'popular';
    document.title = 'Vtuber - ' + getTitle();
    function getTitle() {
        if (menu === 'popular')
            return '熱度排行';
        if (menu === 'subscribe')
            return '訂閱排行';
        if (menu === 'singing')
            return '歌回排行';
        if (menu === 'growing')
            return '本周成長';
        if (menu === 'newcomer')
            return '本月新人';
    }
})();