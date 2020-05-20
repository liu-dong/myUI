// ajax 封装
layui.define(['jquery', 'layer'], function (exports) {
    const $ = layui.jquery,
        layer = layui.layer;
    // 获取全局变量
    const urlPrefix = baseUrl;
    
    //提示：模块也可以依赖其它模块，如：layui.define('layer', callback);
    /* layui ajax 封装
     * url 接口地址
     * data 数据
     * success 成功回调函数
     * cache 浏览器缓存
     * alone 独立提交
     * async 异步请求
     * type 请求的类型
     * dataType 接收数据类型
     * error ： 请求失败后执行的函数
     */
    function ajax(parameters) {

        let url = parameters.url;
        let data = parameters.data;
        let type = parameters.type || 'post'; //请求类型
        let dataType = parameters.dataType || 'json'; //接收数据类型
        let async = parameters.async || true; //异步请求
        let alone = parameters.alone || false; //独立提交（一次有效的提交）
        let cache = parameters.cache || false; //浏览器历史缓存
        let ajaxStatus = true;

        let success = parameters.success || function (data) {
            console.log('请求成功');
            setTimeout(function () {
                layer.msg(data.msg); //通过layer插件来进行提示信息
            }, 200);
            if (data.status) { //服务器处理成功
                setTimeout(function () {
                    if (data.url) {
                        location.replace(data.url);
                    } else {
                        location.reload(true);
                    }
                }, 500);
            } else {
                //服务器处理失败
                if (alone) { //改变ajax提交状态
                    ajaxStatus = true;
                }
            }
        };

        let error = parameters.error || function (data) {
            console.log('请求失败');
            /*data.status;//错误状态吗*/
            layer.closeAll('loading');
            setTimeout(function () {
                if (data.status === 404) {
                    layer.msg('请求失败，请求未找到');
                } else if (data.status === 503) {
                    layer.msg('请求失败，服务器内部错误');
                } else {
                    // layer.msg('请求失败,网络连接超时');
                    layer.msg('请求失败,服务器报错');
                }
                ajaxStatus = true;
            }, 500);
        };

        /*判断是否可以发送请求*/
        if (!ajaxStatus) {
            return false;
        }
        ajaxStatus = false; //禁用ajax请求
        /*正常情况下1秒后可以再次多个异步请求，为true时只可以有一次有效请求（例如添加数据）*/
        if (!alone) {
            setTimeout(function () {
                ajaxStatus = true;
            }, 1000);
        }
        $.ajax({
            url: url,
            data: data,
            type: type,
            dataType: dataType,
            async: async,
            success: success,
            error: error,
            jsonCallback: 'json' + (new Date()).valueOf().toString().substr(-4),
            beforeSend: function () {
                layer.msg('加载数据中...', {
                    time: 500,
                    icon: 16,
                    shade: 0.06
                });
            },
            //解决跨域session问题
            xhrFields: {
                withCredentials: true
            },
        }).done(function (data) {

        }).fail(function (data) {

        }).always(function (data) {
            if (data.code === 1001) {
                setTimeout(function () {
                    layer.msg('登录验证失效，即将跳转到登录页面');
                    parent.toLogin();
                }, 1000);
            }
        });
    }

    const ajaxObj = {
        // submitAjax(post方式提交) layui ajax 函数命名规则 layui+method
        layuiSubmitAjax: function (parameters) {
            // let {form, success, cache, alone} = parameters;
            let form = $(parameters.form);
            let success = parameters.success || true;
            let cache = parameters.cache || true;
            let alone = parameters.alone || true;
            let url = form.attr('action');
            let data = form.serialize();
            ajax({
                url: url,
                data: data,
                success: success,
                cache: cache,
                alone: alone,
                async: false,
                type: 'post',
                dataType: 'json'
            });
        },
        // ajax提交(post方式提交)
        layuiPost: function (parameters,urlBoolean) {
            let url = parameters.url || true;
            let data = parameters.data || true;
            let success = parameters.success || true;
            let urlAddress = urlBoolean ? url + "?userToken=" + cookie.get('userToken') : urlPrefix + url + "?userToken=" + cookie.get('userToken');
            ajax({
                url: urlAddress,
                data: data,
                success: success,
                cache: false,
                alone: 1,
                async: true,
                type: 'POST',
                dataType: 'json',
                error: ''
            });
        },
        // ajax提交(get方式提交,urlBoolean：代表url中的boolean类型值)
        layuiGet: function (parameters,urlBoolean) {

            let url = parameters.url;
            let data = parameters.data || true;
            let success = parameters.success || true;
            let urlAddress = urlBoolean ? url + "?userToken=" + cookie.get('userToken') : urlPrefix + url + "?userToken=" + cookie.get('userToken');
            ajax({
                "url": urlAddress,
                "data": data,
                "success": success,
                "cache": false,
                "alone": 1,
                "async": true,
                "type": 'GET',
                "dataType": 'json',
                "error": ""
            });
        },
        // jsonp跨域请求(get方式提交)
        layuiJsonp: function (parameters,urlBoolean) {
            let url = parameters.url;
            let success = parameters.success;
            let cache = parameters.cache;
            let alone = parameters.alone;
            let urlAddress = urlBoolean ? url + "?userToken=" + cookie.get('userToken') : urlPrefix + url + "?userToken=" + cookie.get('userToken');
            ajax({
                url: urlAddress,
                data: {},
                success: success,
                cache: cache,
                alone: alone,
                async: false,
                type: 'get',
                dataType: 'json'
            });
        },
        layuiTest: function (str) {
            alert(str ? str :"调用成功");
        }
    };
    exports('ajaxMod', ajaxObj);
});