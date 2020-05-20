// 路由封装
layui.define(function (exports) {
    window.Router = function () {

        let self = this;
        self.hashList = {};
        /* 路由表 */
        self.index = null;
        self.key = '/';
        window.onHashChange = function () {
            self.reload();
        };
        window.onLoad = function () {
            let address = window.location.hash.replace('#' + "/", '').split('/')[0];
            self.go(address);
        }
    };
    /**
     * 添加路由,如果路由已经存在则会覆盖
     * @param address: 地址
     * @param callback: 回调函数，调用回调函数的时候同时也会传入相应参数
     */
    Router.prototype.add = function (address, callback) {

        let self = this;
        self.hashList[address] = callback;
    };
    /**
     * 删除路由
     * @param address: 地址
     */
    Router.prototype.remove = function (address) {
        let self = this;
        delete self.hashList[address];
    };
    /**
     * 设置主页地址
     * @param index: 主页地址
     */
    Router.prototype.setIndex = function (index) {
        let self = this;
        self.index = index;
    };
    /**
     * 跳转到指定地址
     * @param address: 地址值
     */
    Router.prototype.go = function (address) {
        let self = this;
        window.location.hash = '#' + self.key + address;
    };
    /**
     * 重载页面
     */
    Router.prototype.reload = function () {
        // console.log(this.hashList)
        let self = this;
        let hash = window.location.hash.replace('#' + self.key, '');
        let address = hash.split('/')[0];
        let cb = getCb(address, self.hashList);

        if (cb !== false) {
            let arr = hash.split('/');
            arr.shift();
            cb.apply(self, arr);
        } else {
            self.index && self.go(self.index);
        }
    };
    /**
     * 开始路由，实际上只是为了当直接访问路由路由地址的时候能够及时调用回调
     */
    Router.prototype.start = function () {
        let self = this;
        self.reload();
    };

    Router.prototype.lists = function () {
        return this.hashList;
    };

    /**
     * 获取callback
     * @return boolean or callback
     */
    function getCb(address, hashList) {
        for (let key in hashList) {
            if (key === address) {
                return hashList[key];//?
            }
        }
        return false;
    }

    const router = new Router();

    exports('routerMod', router);
});