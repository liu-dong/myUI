layui.define(["jquery", "element", "nprogress", "layer"], function (exports) {

    const t = layui.jquery,
        $ = layui.jquery,
        e = layui.element,
        layer = layui.layer,
        a = $(document),//$(document)是一个选择器，选中的是整个html所有元素的集合。（html对象）
        l = $(window),//$(window)是一个选择器，选中的是整个浏览器所有元素的集合。（浏览器对象）
        $document = $(document),//$(document)是一个选择器，选中的是整个html所有元素的集合。（html对象）
        $window = $(window);//$(window)是一个选择器，选中的是整个浏览器所有元素的集合。（浏览器对象）
    let n = function () {
        this.config = {
            elem: void 0,//void是javascript中的一个函数，接受一个参数，返回值永远是undefined
            mainUrl: "main.html"
        };
        this.v = "1.0.2"
    };

    //n.fn：设置这个方法为所有实例共有的，n.prototype.set：给自定义方法扩展一个方法set()
    n.fn = n.prototype.set = function (params) {
        let _this = this;
        t.extend(true, _this.config, params);
        return _this;
    };
    n.fn.render = function () {
        let _this = this,
            _config = _this.config;
        //layui.hint():向控制台打印一些异常信息，目前只返回了 error 方法：layui.hint().error('出错啦')
        if (_config.elem) {
            c._config = _config;
            c.createTabDom();
        } else {
            layui.hint().error("Tab error:请配置选择卡容器.");
        }
        return _this;
    };
    n.fn.tabAdd = function (params) {
        c.tabAdd(params)
    };


    let c = {
        _config: {},
        _filter: "kitTab",
        _title: void 0,
        _content: void 0,
        _parentElem: void 0,

        tabDomExists: function () {
            let _this = this;
            if ($document.find("div.kit-tab").length > 0) {
                _this._title = $(".kit-tab ul.layui-tab-title");
                _this._content = $(".kit-tab div.layui-tab-content");
                return true;
            } else {
                return false;
            }
        },
        createTabDom: function () {
            let _this = this;
            let config = _this._config;
            _this._parentElem = config.elem;
            if (!_this.tabDomExists()) {
                const action = "<ul class='anspray-tool-body'>" +
                    "<li class='' data-action='toleft'>" +
                    "<div class='kit-side-fold' title='左侧菜单' style='color:#333;'>" +
                    "<i class='fa fa-arrow-left' aria-hidden='true'>" +
                    "</i></div></li>" +
                    "<li class='fullscreen layui-tip' data-action='fullscreen' layui-tips='全屏'>" +
                    "<a href='javascript:;' title='全屏' style='color:#333;'>" +
                    "<i class='fa fa-arrows-alt' aria-hidden='true'>" +
                    "</i></a></li>" +
                    "<li class='lockcms layui-tip' data-action='lockcms' layui-tips='锁屏'>" +
                    "<a href='javascript:;' title='' style='color:#333;'>" +
                    "<i class='fa fa-lock' aria-hidden='true'>" +
                    "</i></a></li>" +
                    "<li class='hide' data-action='clearcache'>" +
                    "<a id='clear' title='清空缓存' style='color:#333;'>" +
                    "<i class='fa fa-trash' aria-hidden='true'>" +
                    "</i></a></li>" +
                    "<li class='kit-item layui-tip' data-action='refresh' layui-tips='刷新'>" +
                    "<a title='' style='color:#333;'>" +
                    "<i class='fa fa-refresh' aria-hidden='true'>" +
                    "</i></a></li>" +
                    "<li class='layui-tip' data-action='qrcode' layui-tips='二维码'>" +
                    "<a id='kit-side-fold' title='' style='color:#333;'>" +
                    "<i class='fa fa-qrcode' aria-hidden='true'>" +
                    "</i></a></li>" +
                    "<li class='hide' data-action='print'>" +
                    "<a id='kit-side-fold' title='' style='color:#333;'>" +
                    "<i class='fa fa-print' aria-hidden='true'>" +
                    "</i></a></li>" +
                    "<li class='hide' data-action='print'>" +
                    "<a id='kit-side-fold' title='table导出csv' style='color:#333;'>" +
                    "<i class='fa fa-table' aria-hidden='true'>" +
                    "</i></a></li></ul>";
                let a = ['<div class="layui-tab layui-tab-card kit-tab" lay-filter="' + i._filter + '">',
                    '<ul class="layui-tab-title">',
                    '<li class="layui-this" lay-id="-1"><i class="layui-icon">&#xe68e;</i></li>',
                    '</ul>',
                    action + "<div class='kit-tab-tool'><i class='fa fa-chevron-down'></i></div>",
                    '<div class="kit-tab-tool-body layui-anim layui-anim-upbit">',
                    "<ul>",
                    '<li class="kit-item" data-target="refresh">刷新当前选项卡</li>',
                    '<li class="kit-line"></li>',
                    '<li class="kit-item" data-target="closeCurrent">关闭当前选项卡</li>',
                    '<li class="kit-item" data-target="closeOther">关闭其他选项卡</li>',
                    '<li class="kit-line"></li>',
                    '<li class="kit-item" data-target="closeAll">关闭所有选项卡</li>',
                    "</ul>",
                    "</div>",
                    '<div class="layui-tab-content">',
                    '<div class="layui-tab-item layui-show" lay-item-id="-1"><iframe src="' + config.mainUrl + '"></iframe></div>',
                    "</div>",
                    "</div>"];
                $(config.elem).html(a.join(""));
                _this._title = $(".kit-tab ul.layui-tab-title");
                _this._content = $(".kit-tab div.layui-tab-content");

                let tool = $(".kit-tab-tool"),
                    toolBody = $(".kit-tab-tool-body");

                tool.on("click", function () {
                    toolBody.toggle()
                });
                toolBody.find("li.kit-item").each(function () {
                    let target = $(this).data("target");
                    $(this).off("click").on("click", function () {
                        let layId = _this._title.children("li[class=layui-this]").attr("lay-id");
                        switch (target) {
                            case "refresh":
                                let iframe = i._content.children("div[lay-item-id=" + layId + "]").children("iframe");
                                iframe.attr("src", iframe.attr("src"));
                                break;
                            case "closeCurrent":
                                -1 !== layId && _this.tabDelete(layId);
                                break;
                            case "closeOther":
                                _this._title.children("li[lay-id]").each(function () {
                                    let _layId = $(this).attr("lay-id");
                                    if (_layId !== layId && -1 !== _layId) {
                                        _this.tabDelete(_layId);
                                    }
                                });
                                break;
                            case "closeAll":
                                _this._title.children("li[lay-id]").each(function () {
                                    let _layId = t(this).attr("lay-id");
                                    -1 !== _layId && i.tabDelete(_layId);
                                })
                        }
                        tool.click()
                    })
                });
                _this.winResize();

                // tips提示
                $('.layui-tip').on('mouseenter', function () {
                    layer.tips($(this).attr("layui-tips"), $(this), {
                        time: 150000,
                        tips: 3
                    });
                });
                $('.layui-tip').on('mouseleave', function () {
                    layer.closeAll('tips');
                });

                // 扩展功能
                $(".anspray-tool-body").find("li").each(function () {
                    let action = $(this).data("action");
                    $(this).off("click").on("click", function () {
                        let id = _this._title.children("li[class=layui-this]").attr("lay-id");
                        switch (action) {
                            // 左侧菜单
                            case "toleft":
                                console.log("菜单收缩");
                                break;
                            // 全屏
                            case "fullscreen":
                                // 全屏
                                if (!t(this).hasClass("fullscreened")) {
                                    element = document.documentElement;
                                    var requestMethod = element.requestFullScreen || //W3C
                                        element.webkitRequestFullScreen || //Chrome等
                                        element.mozRequestFullScreen || //FireFox
                                        element.msRequestFullScreen; //IE11
                                    if (requestMethod) {
                                        requestMethod.call(element);
                                    } else if (typeof window.ActiveXObject !== "undefined") { //for Internet Explorer
                                        var wscript = new ActiveXObject("WScript.Shell");
                                        if (wscript !== null) {
                                            wscript.SendKeys("{F11}");
                                        }
                                    }
                                    t(this).addClass("fullscreened");
                                    // 退出全屏
                                } else {
                                    var exitMethod = document.exitFullscreen || //W3C
                                        document.mozCancelFullScreen || //Chrome等
                                        document.webkitExitFullscreen || //FireFox
                                        document.webkitExitFullscreen; //IE11
                                    if (exitMethod) {
                                        exitMethod.call(document);
                                    } else if (typeof window.ActiveXObject !== "undefined") { //for Internet Explorer
                                        var wscript = new ActiveXObject("WScript.Shell");
                                        if (wscript !== null) {
                                            wscript.SendKeys("{F11}");
                                        }
                                    }
                                    t(this).removeClass("fullscreened");
                                }
                                break;
                            // 锁屏
                            case "lockcms":

                                // 锁屏
                            function lockPage() {
                                layer.open({
                                    title: false,
                                    type: 1,
                                    content: t("#lock-box"),
                                    closeBtn: 0,
                                    shade: 0.8
                                })
                            }

                                t(".lockcms").on("click", function () {
                                    window.sessionStorage.setItem("lockcms", true);
                                    lockPage();
                                })
                                if (window.sessionStorage.getItem("lockcms") == "true") {
                                    lockPage();
                                }
                                t("#unlock").on("click", function () {
                                    if (t(this).siblings(".admin-header-lock-input").val() == '') {
                                        // layer.msg("请输入解锁密码！");
                                        layer.msg("请输入登录账号解锁！");
                                    } else {
                                        if (t(this).siblings(".admin-header-lock-input").val() == "123456") {
                                            window.sessionStorage.setItem("lockcms", false);
                                            t(this).siblings(".admin-header-lock-input").val('');
                                            layer.closeAll("page");
                                        } else {
                                            layer.msg("账号错误，请重新输入!");
                                        }
                                    }
                                });
                                break;
                            // 清缓存
                            case "clearcache":
                                // 缓存
                                t('#clear').on('click', function () {
                                    var the = t(this).find('i');
                                    the.attr("class", "fa fa-spinner");
                                    t.ajax({
                                        url: "http://tplay.pengyichen.cn/tplay/public/admin/common/clear.shtml"
                                        , success: function (res) {
                                            if (res.code == 1) {
                                                setTimeout(function () {
                                                    parent.message.show({
                                                        skin: 'cyan',
                                                        msg: res.msg
                                                    });
                                                    t('#clear i').attr("class", "fa fa-institution");
                                                }, 1000)
                                            }
                                        }
                                    })
                                });
                                break;
                            // 刷新
                            case "refresh":
                                var p = i._content.children("div[lay-item-id=" + id + "]").children("iframe");
                                p.attr("src", p.attr("src"));
                                break;
                            // 二维码
                            case "qrcode":
                                layer.open({
                                    type: 1
                                    ,
                                    id: 'qrcode'
                                    ,
                                    offset: ['95px', 'calc(100% - 212px)']
                                    ,
                                    content: '<div style=""><img width="200" id="qrimage" src="//qr.api.cli.im/qr?data=f%2527d%2527s%2527f&amp;level=H&amp;transparent=false&amp;bgcolor=%23ffffff&amp;forecolor=%23000000&amp;blockpixel=12&amp;marginblock=1&amp;logourl=&amp;size=280&amp;kid=cliim&amp;key=fb2f780c52f16355e4e8222c035bdc4e"></div>'
                                    ,
                                    title: '二维码'
                                    ,
                                    btnAlign: 'c' //按钮居中
                                    ,
                                    shade: 0 //不显示遮罩
                                    ,
                                    yes: function () {
                                        layer.closeAll();
                                    }
                                });
                                break;
                            case "print":
                                bdhtml = window.document.body.innerHTML;
                                sprnstr = "<!--startprint-->";
                                eprnstr = "<!--endprint-->";
                                prnhtml = bdhtml.substr(bdhtml.indexOf(sprnstr) + 17);
                                prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr));
                                window.document.body.innerHTML = prnhtml;
                                window.print();
                                break;
                        }
                    })
                })
            }
        },

        winResize: function () {
            var i = this;
            l.on("resize", function () {
                var e = t(i._parentElem).height();
                t(".kit-tab .layui-tab-content iframe").height(e - 45)
            }).resize()
        },
        tabExists: function (i) {
            return this._title.find("li[lay-id=" + i + "]").length > 0
        },
        tabDelete: function (i) {
            e.tabDelete(this._filter, i)
        },
        tabChange: function (i) {
            e.tabChange(this._filter, i)
        },
        getTab: function (i) {
            return this._title.find("li[lay-id=" + i + "]")
        },
        tabAdd: function (i) {
            var t = this,
                a = t._config,
                l = (i = i || {
                    id: (new Date).getTime(),
                    title: "新标签页",
                    icon: "fa-file",
                    url: "404.html"
                }).title,
                n = i.icon,
                c = i.url,
                s = i.id;
            if (t.tabExists(s)) t.tabChange(s);
            else {
                NProgress.start();
                var r = ['<li class="layui-this" lay-id="' + s + '" >'];
                -1 !== n.indexOf("fa-") ? r.push('<i class="fa ' + n + '" aria-hidden="true"></i>') : r.push('<i class="layui-icon">' + n + "</i>"), r.push("&nbsp;" + l), r.push('<i class="layui-icon layui-unselect layui-tab-close">&#x1006;</i>'), r.push("</li>");
                var o = '<div class="layui-tab-item layui-show" lay-item-id="' + s + '"><iframe src="' + c + '"></iframe></div>';
                t._title.append(r.join("")), t._content.append(o), t.getTab(s).find("i.layui-tab-close").off("click").on("click", function () {
                    a.closeBefore ? a.closeBefore(i) && t.tabDelete(s) : t.tabDelete(s)
                }), t.tabChange(s), t.winResize(), t._content.find("div[lay-item-id=" + s + "]").find("iframe").on("load", function () {
                    NProgress.done()
                }), a.onSwitch && e.on("tab(" + t._filter + ")", function (i) {
                    a.onSwitch({
                        index: i.index,
                        elem: i.elem,
                        layId: t._title.children("li").eq(i.index).attr("lay-id")
                    })
                })
            }
        }
    };

    exports("tab", n)
});







