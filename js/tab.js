layui.define(function (exports) {

    const $ = layui.jquery,
        element = layui.element,
        layer = layui.layer,
        $document = $(document),//$(document)是一个选择器，选中的是整个html所有元素的集合。（html对象）
        $window = $(window);//$(window)是一个选择器，选中的是整个浏览器所有元素的集合。（浏览器对象）

    let tab = function () {
        this.config = {
            elem: void 0,//事件对象
            mainUrl: "main.html"//tab标签页地址
        };
        this.v = "1.0.2"
    };

    //设置tab页参数值
    (tab.fn = tab.prototype).set = function (params) {
        let _this = this;
        $.extend(true, _this.config, params);
        return _this;
    };
    tab.fn.render = function () {
        let _this = this,
            _config = _this.config;
        //layui.hint():向控制台打印一些异常信息，目前只返回了 error 方法：layui.hint().error('出错啦')
        if (_config.elem) {
            obj._config = _config;
            obj.createTabDom();
        } else {
            layui.hint().error("Tab error:请配置选择卡容器.");
        }
        return _this;
    };

    tab.fn.tabAdd = function (params) {
        obj.tabAdd(params)
    };


    let obj = {
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
        //创建标签栏
        createTabDom: function () {
            let _this = this;
            let config = _this._config;
            _this._parentElem = config.elem;
            if (!_this.tabDomExists()) {
                const toolBar = "<ul class='anspray-tool-body'>" +
                    "<li class='' data-action='toLeft'>" +
                    "<div class='kit-side-fold' title='左侧菜单' style='color:#333;'>" +
                    "<i class='fa fa-arrow-left' aria-hidden='true'>" +
                    "</i></div></li>" +
                    "<li class='fullscreen layui-tip' data-action='fullScreen' layui-tips='全屏'>" +
                    "<a href='javascript:;' title='全屏' style='color:#333;'>" +
                    "<i class='fa fa-arrows-alt' aria-hidden='true'>" +
                    "</i></a></li>" +
                    "<li class='lockcms layui-tip' data-action='lockcms' layui-tips='锁屏'>" +
                    "<a href='javascript:;' title='' style='color:#333;'>" +
                    "<i class='fa fa-lock' aria-hidden='true'>" +
                    "</i></a></li>" +
                    "<li class='kit-item layui-tip' data-action='refresh' layui-tips='刷新'>" +
                    "<a title='' style='color:#333;'>" +
                    "<i class='fa fa-refresh' aria-hidden='true'>" +
                    "</i></a></li>" +
                    "<li class='layui-tip' data-action='qrcode' layui-tips='二维码'>" +
                    "<a id='kit-side-fold' title='' style='color:#333;'>" +
                    "<i class='fa fa-qrcode' aria-hidden='true'>" +
                    "</i></a></li>" +
                    /*隐藏项*/
                    "<li class='hide' data-action='clearcache'>" +
                    "<a id='clear' title='清空缓存' style='color:#333;'>" +
                    "<i class='fa fa-trash' aria-hidden='true'>" +
                    "</i></a></li>" +
                    "<li class='layui-tip' data-action='print' layui-tips='打印'>" +
                    "<a id='kit-side-fold' title='' style='color:#333;'>" +
                    "<i class='fa fa-print' aria-hidden='true'>" +
                    "</i></a></li>" +
                    "<li class='hide' data-action='print'>" +
                    "<a id='kit-side-fold' title='table导出csv' style='color:#333;'>" +
                    "<i class='fa fa-table' aria-hidden='true'>" +
                    "</i></a></li></ul>";
                //标签栏
                let tabBar = ['<div class="layui-tab layui-tab-card kit-tab" lay-filter="' + _this._filter + '">',
                    /*主页图标按钮*/
                    '<ul class="layui-tab-title">',
                    '<li class="layui-this" lay-id="-1"><i class="layui-icon">&#xe68e;</i></li>',
                    '</ul>',
                    /*工具栏选项*/
                    toolBar + "<div class='kit-tab-tool'><i class='fa fa-chevron-down'></i></div>",
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
                    /*主体区域*/
                    '<div class="layui-tab-content">',
                    '<div class="layui-tab-item layui-show" lay-item-id="-1"><iframe src="' + config.mainUrl + '"></iframe></div>',
                    "</div>",
                    "</div>"];
                $(config.elem).html(tabBar.join(""));
                _this._title = $(".kit-tab ul.layui-tab-title");//标签栏
                _this._content = $(".kit-tab div.layui-tab-content");//主体内容

                let tool = $(".kit-tab-tool"),
                    toolBody = $(".kit-tab-tool-body");

                tool.on("click", function () {
                    toolBody.toggle()
                });
                toolBody.find("li.kit-item").each(function () {
                    let targetButton = $(this).data("target");
                    $(this).off("click").on("click", function () {
                        let thisLayId = _this._title.children("li[class=layui-this]").attr("lay-id");//获取当前选项卡的id
                        //执行按钮功能
                        switch (targetButton) {
                            case "refresh"://刷新
                                let iframe = _this._content.children("div[lay-item-id=" + thisLayId + "]").children("iframe");
                                iframe.attr("src", iframe.attr("src"));
                                break;
                            case "closeCurrent"://关闭当前选项卡
                                -1 !== thisLayId && _this.tabDelete(thisLayId);
                                break;
                            case "closeOther"://关闭其他选项卡
                                _this._title.children("li[lay-id]").each(function () {
                                    let otherLayId = $(this).attr("lay-id");//非当前选项卡layId
                                    if (otherLayId !== thisLayId && -1 !== otherLayId) {
                                        _this.tabDelete(otherLayId);
                                    }
                                });
                                break;
                            case "closeAll"://关闭所有
                                _this._title.children("li[lay-id]").each(function () {
                                    let layId = $(this).attr("lay-id");
                                    -1 !== layId && _this.tabDelete(layId);
                                })
                        }
                        tool.click()
                    })
                });

                _this.winResize();

                // tips提示
                $('.layui-tip').on('mouseenter', function () {//mouseenter：当鼠标指针进入（穿过）元素时，出现提示：
                    layer.tips($(this).attr("layui-tips"), $(this), {
                        time: 30000,
                        tips: 3
                    });
                });
                $('.layui-tip').on('mouseleave', function () {
                    layer.closeAll('tips');
                });

                // 扩展功能
                $(".anspray-tool-body").find("li").each(function () {

                    let actionButton = $(this).data("action");
                    $(this).off("click").on("click", function () {
                        let thisLayId = _this._title.children("li[class=layui-this]").attr("lay-id");
                        switch (actionButton) {
                            // 左侧菜单
                            case "toLeft":console.log("菜单收缩");break;
                            // 全屏
                            case "fullScreen":
                                // 全屏
                                if (!$(this).hasClass("fullScreened")) {
                                    //打开全屏方法
                                    let requestMethod = document.documentElement.requestFullScreen || //W3C
                                        document.documentElement.webkitRequestFullScreen || //Chrome等
                                        document.documentElement.mozRequestFullScreen || //FireFox
                                        document.documentElement.msRequestFullScreen; //IE11
                                    if (requestMethod) {
                                        requestMethod.call(document.documentElement);
                                    } else if (typeof window.ActiveXObject !== "undefined") { //for Internet Explorer
                                        let wscript = new ActiveXObject("WScript.Shell");
                                        if (wscript !== null) {
                                            wscript.SendKeys("{F11}");
                                        }
                                    }
                                    $(this).addClass("fullScreened");

                                } else {
                                    // 退出全屏方法
                                    let exitMethod = document.exitFullscreen || //W3C
                                        document.webkitExitFullScreen || //Chrome等
                                        document.mozCancleFullScreen || //FireFox
                                        document.msExitFullScreen; //IE11
                                    if (exitMethod) {
                                        exitMethod.call(document);
                                    } else if (typeof window.ActiveXObject !== "undefined") { //for Internet Explorer
                                        let wscript = new ActiveXObject("WScript.Shell");
                                        if (wscript !== null) {
                                            wscript.SendKeys("{F11}");
                                        }
                                    }
                                    $(this).removeClass("fullScreened");
                                }
                                break;
                            // 锁屏
                            case "lockcms":
                                lockPage();
                                // 锁屏
                                $(".lockcms").on("click", function () {
                                    window.sessionStorage.setItem("lockcms", "true");
                                    lockPage();
                                });
                                if (window.sessionStorage.getItem("lockcms") === "true") {
                                    lockPage();
                                }
                                $("#unlock").on("click", function () {
                                    if ($(this).siblings(".admin-header-lock-input").val() === '') {
                                        // layer.msg("请输入解锁密码！");
                                        layer.msg("请输入登录账号解锁！");
                                    } else {
                                        if ($(this).siblings(".admin-header-lock-input").val() === "123456") {
                                            window.sessionStorage.setItem("lockcms", "false");
                                            $(this).siblings(".admin-header-lock-input").val('');
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
                                $('#clear').on('click', function () {
                                    let the = $(this).find('i');
                                    the.attr("class", "fa fa-spinner");
                                    $.ajax({
                                        url: "http://tplay.pengyichen.cn/tplay/public/admin/common/clear.shtml"
                                        , success: function (res) {
                                            if (res.code === 1) {
                                                setTimeout(function () {
                                                    parent.message.show({
                                                        skin: 'cyan',
                                                        msg: res.msg
                                                    });
                                                    $("#clear i").attr("class", "fa fa-institution");
                                                }, 1000)
                                            }
                                        }
                                    })
                                });
                                break;
                            // 刷新
                            case "refresh":
                                let content = _this._content.children("div[lay-item-id=" + thisLayId + "]").children("iframe");
                                content.attr("src", content.attr("src"));
                                break;
                            // 二维码
                            case "qrcode":
                                layer.open({
                                    type: 1,
                                    id: 'qrcode',
                                    offset: ['95px', 'calc(100% - 212px)'],
                                    content: '<div style="">' +
                                        '<img width="200" id="qrimage" ' +
                                        'src="//qr.api.cli.im/qr?data=f%2527d%2527s%2527f&amp;' +
                                        'level=H&amp;transparent=false&amp;bgcolor=%23ffffff&amp;forecolor=%23000000&amp;' +
                                        'blockpixel=12&amp;marginblock=1&amp;logourl=&amp;size=280&amp;kid=cliim&amp;' +
                                        'key=fb2f780c52f16355e4e8222c035bdc4e"></div>',
                                    title: '二维码',
                                    btnAlign: 'c',//按钮居中
                                    shade: 0,//不显示遮罩
                                    yes: function () {
                                        layer.closeAll();
                                    }
                                });
                                break;
                            //打印
                            case "print":
                                let bdhtml = window.document.body.innerHTML;
                                let sprnstr = "<!--startprint-->";
                                let eprnstr = "<!--endprint-->";
                                let prnhtml = bdhtml.substr(bdhtml.indexOf(sprnstr) + 17);
                                prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr));
                                window.document.body.innerHTML = prnhtml;
                                window.print();
                                break;
                        }
                    })
                })
            }
        },
        //窗口大小调整
        winResize: function () {
            let _this = this;
            $window.on("resize", function () {
                let height = $(_this._parentElem).height();
                $(".kit-tab .layui-tab-content iframe").height(height - 45)
            }).resize()
        },
        //判断是否有选项卡
        tabExists: function (layId) {
            return this._title.find("li[lay-id=" + layId + "]").length > 0
        },
        //关闭选项卡 layId选项卡的唯一标识
        tabDelete: function (layId) {
            element.tabDelete(this._filter, layId)
        },
        //layId选项卡的唯一标识
        tabChange: function (layId) {
            element.tabChange(this._filter, layId)
        },
        getTab: function (layId) {
            return this._title.find("li[lay-id=" + layId + "]")
        },
        tabAdd: function (option) {

            let _this = this,
                config = _this._config,
                tabObject = (option || {
                    id: (new Date).getTime(),
                    title: "新标签页",
                    icon: "fa-file",
                    url: "404.html"
                }).title,
                icon = option.icon,
                url = option.url,
                tabId = option.id;
            if (_this.tabExists(tabId)) {
                _this.tabChange(tabId);
            } else {
                NProgress.start();
                let liTag = ['<li class="layui-this" lay-id="' + tabId + '" >'];
                if (-1 !== icon.indexOf("fa-")) {
                    liTag.push('<i class="fa ' + icon + '" aria-hidden="true"></i>')
                } else {
                    liTag.push('<i class="layui-icon">' + icon + "</i>");
                    liTag.push("&nbsp;" + tabObject);
                    liTag.push('<i class="layui-icon layui-unselect layui-tab-close">&#x1006;</i>');
                    liTag.push("</li>");
                }
                let divTag = '<div class="layui-tab-item layui-show" lay-item-id="' + tabId + '"><iframe src="' + url + '"></iframe></div>';
                _this._title.append(liTag.join(""));
                _this._content.append(divTag);
                _this.getTab(tabId).find("i.layui-tab-close").off("click").on("click", function () {
                    config.closeBefore ? config.closeBefore(option) && _this.tabDelete(tabId) : _this.tabDelete(tabId)
                });
                _this.tabChange(tabId);
                _this.winResize();
                _this._content.find("div[lay-item-id=" + tabId + "]").find("iframe").on("load", function () {
                    NProgress.done()
                });
                config.onSwitch && element.on("tab(" + _this._filter + ")", function (i) {
                    config.onSwitch({
                        index: i.index,
                        elem: i.elem,
                        layId: _this._title.children("li").eq(i.index).attr("lay-id")
                    })
                })
            }
        }
    };

    //锁屏
    function lockPage() {
        layer.open({
            title: false,
            type: 1,
            content: $("#lock-box"),
            closeBtn: 0,
            shade: 0.8
        })
    }

    exports("tab", new tab);
});







