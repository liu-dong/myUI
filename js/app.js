layui.define(['element', 'nprogress', 'form', 'table', 'loader', 'tab', 'navbar', 'onelevel', 'ajaxMod', 'routerMod'], function (exports) {
    const $ = layui.jquery,
        _body = $('.kit-body'),
        element = layui.element,
        layer = layui.layer,
        form = layui.form,
        table = layui.table,
        tab = layui.tab,
        loader = layui.loader,
        navbar = layui.navbar,
        ajaxMod = layui.ajaxMod,
        routerMod = layui.routerMod,
        _componentPath = 'components/';

    // 转换
    const parameter = $.param(layui.device());

    const app = {
        hello: function (str) {
            layer.alert('Hello ' + (str || 'test'));
        },
        config: {
            type: 'iframe',
            isRefresh: false // 设置是否刷新
        },
        //设置是否刷新和页面类型（内嵌页面和新页面）
        set: function (options) {
            let _this = this;
            $.extend(true, _this.config, options);/* $.extend(object1, object2); object2 合并到 object1 中 */
            return _this;
        },
        //初始化
        init: function () {
            debugger
            let that = this,
                _config = that.config;
            if (_config.type === 'page') {
                $('a[kit-loader]').on('click', function () {
                    let url = $(this).data('url'),
                        name = $(this).data('name'),
                        id = $(this).data('id');
                    loader.load({
                        url: url,
                        name: name,
                        id: id === undefined ? new Date().getTime() : id,
                        onSuccess: success
                    });
                    function success(data) {
                        switch (data.name) {
                            case 'table':
                                loader.getScript(_componentPath + 'table/table.js', function () {
                                    let tableIns = table.render(moduleTable.config);
                                    moduleTable.extend({
                                        currTable: tableIns,
                                        table: table,
                                        layer: layer,
                                        form: form,
                                        jquery: $
                                    });
                                });
                                break;
                            case 'form':
                                form.render();
                                break;
                            default:
                                break;
                        }
                    }
                });
            }
            //页面类型为内嵌页面
            if (_config.type === 'iframe') {
                debugger
                tab.set({
                    elem: '#container',
                    onSwitch: function (data) {
                        debugger
                        if (that.config.isRefresh) {
                            let src = $(".layui-tab-content").find(".layui-show iframe").attr("src");
                            $(".layui-tab-content").find(".layui-show iframe").attr("src", src);
                        }
                    },
                    closeBefore: function (data) {
                        //关闭选项卡之前触发
                        return true; //返回true则关闭
                    }
                }).render();

                // 获取权限列表
                ajaxMod.layuiGet(
                    {
                        url: "/system/systemMenu/findSystemMenuList", data: "", success: function (res) {
                            debugger
                            if (res.success) {
                                debugger
                                if (res.data.length !== 0) {
                                    navbar.set({
                                        data: res.data
                                    }).render(function (data) {
                                        tab.tabAdd(data);
                                    });
                                }
                            } else {
                                layer.msg("获取用户权限列表失败,推荐联系管理员", {icon: 2});
                            }
                        }
                    }, 0
                )
            }
            return that;
        }
    };

    // 菜单切换
    $('#tonpl').on('click', function () {
        ajaxMod.layuiGet({
            url: "/data/menuList2.json", data: "", success: function (res) {
                if (res.success) {
                    if (res.data.length !== 0) {
                        navbar.set({
                            data: res.data
                        }).render(function (data) {
                            tab.tabAdd(data);
                        });
                    }
                } else {
                    layer.msg("获取用户权限列表失败,推荐联系管理员", {icon: 2});
                }
            }, urlBoolean: 1
        })
    });

    //设置皮肤
    const setSkin = function (value) {
            layui.data('kit_skin', {
                key: 'skin',
                value: value
            });
        },
        getSkinName = function () {
            return layui.data('kit_skin').skin;
        },
        switchSkin = function (value) {
            let _target = $('link[kit-skin]')[0];
            _target.href = _target.href.substring(0, _target.href.lastIndexOf('/') + 1) + value + _target.href.substring(_target.href.lastIndexOf('.'));
            setSkin(value);
        },
        //初始化皮肤
        initSkin = function () {
            let skin = getSkinName();
            switchSkin(skin === undefined ? 'default' : skin);
        }();

    // 皮肤
    $('#color').click(function () {
        layer.open({
            type: 1,
            title: '更换皮肤',
            area: ['290px', 'calc(100% - 52px)'],
            offset: 'rb',
            shadeClose: true,
            id: 'colors',
            anim: 2,
            shade: 0.2,
            closeBtn: 0,
            isOutAnim: false,
            resize: false,
            move: false,
            skin: 'color-class',
            btn: ['黑白格', '橘子橙', '原谅绿', '少女粉', '天空蓝', '枫叶红'],
            yes: function (index, layero) {
                switchSkin('default');
            },
            btn2: function (index, layero) {
                switchSkin('orange');
                return false;
            },
            btn3: function (index, layero) {
                switchSkin('green');
                return false;
            },
            btn4: function (index, layero) {
                switchSkin('pink');
                return false;
            },
            btn5: function (index, layero) {
                switchSkin('blue.1');
                return false;
            },
            btn6: function (index, layero) {
                switchSkin('red');
                return false;
            }
        });
    });

    // 添加标签
    $('#tag').click(function () {
        let tag = localStorage.getItem("tag");
        layer.prompt({
            formType: 2,
            anim: 1,
            offset: ['52px', 'calc(100% - 500px)'],
            value: tag,
            title: '便签',
            skin: 'demo-class',
            area: ['280px', '160px'],
            id: 'remember', //设定一个id，防止重复弹出
            btn: ['保存', '取消'],
            shade: 0,
            moveType: 1, //拖拽模式，0或者1
            btn2: function (index, layero) {
                localStorage.removeItem("tag");
                $('#remember textarea').val('');
                return false;
            }
        }, function (value, index, elem) {
            let jsonObj = {
                time: new Date(),
                value: value
            };
            console.log(jsonObj);
            localStorage.setItem("tag", value);
        })
    });

    // 更新情况
    $('#copyright').click(function () {
        // 调用ajaxFun
        ajaxFun("GET", "/About.txt", function (xmlhttp) {
            document.getElementById("copyrights").innerHTML = xmlhttp.responseText;
        });

        layer.open({
            type: 1,
            title: '版本信息',
            area: ['290px', 'calc(100% - 52px)'],
            offset: 'rb',
            shadeClose: true,
            id: 'copyrights',
            anim: 2,
            shade: 0.2,
            closeBtn: 0,
            isOutAnim: false,
            resize: false,
            move: false,
            skin: 'color-class',
            content: '',
        });
    });

    // 消息
    $('#news').click(function () {
        layer.open({
            type: 1,
            title: "系统公告",
            closeBtn: false,
            area: '310px',
            shade: 0.8,
            id: 'systemNotice',
            btn: ['知道了 !'],
            moveType: 1,
            content: '<div style="padding:15px 20px; text-align:justify; line-height: 22px; text-indent:2em;border-bottom:1px solid #e2e2e2;"><p>一个基于layui和vue的后台管理系统模版</p></div>',
            success: function (layero) {
                let btn = layero.find('.layui-layer-btn');
                btn.css('text-align', 'center');
                btn.on("click", function () {
                    window.sessionStorage.setItem("showNotice", "true");
                });
                if ($(window).width() > 432) {
                    btn.on("click", function () {

                    })
                }
            }
        });
    });

    exports('app', app);
});