layui.define(["layer", "laytpl", "element"], function (exports) {
    const $ = layui.jquery,
        layer = layui.layer,
        $document = $(document),
        laytpl = layui.laytpl,
        element = layui.element;
    const navbar = {
        v: "1.0.2",
        config: {
            data: void 0,
            remote: {url: "", type: "GET", jsonp: false},
            cached: !1,
            elem: void 0,
            filter: "kitNavbar"
        },
        set: function (options) {
            let _this = this;
            _this.config.data = void 0;
            $.extend(true, _this.config, options);
            return  _this
        },
        hasElem: function () {
            let _config = this.config;
            return void 0 !== _config.elem || 0 !== $document.find("ul[kit-navbar]").length || !$(_config.elem) || false
        },
        getElem: function () {
            let _config = this.config;
            return void 0 !== _config.elem && $(_config.elem).length > 0 ? $(_config.elem) : $document.find("ul[kit-navbar]");
        },
        bind: function (options) {
            let _this = this;
            return _this.hasElem() ? (
                _this.getElem().find("a[kit-target]").each(function () {
                    let n;
                    $(this).hover(function () {
                        n = layer.tips($(this).children("span").text(), this)
                    }, function () {
                        n && layer.close(n)
                    });
                    $(this).off("click").on("click", function () {
                        let e, a = $(this).data("options");
                        if (void 0 !== a) {
                            try {
                                e = new Function("return " + a)()
                            } catch (i) {
                                layui.hint().error("Navbar 组件a[data-options]配置项存在语法错误：" + a)
                            }
                        }else {
                            e = {
                                icon: $(this).data("icon"),
                                id: $(this).data("id"),
                                title: $(this).data("title"),
                                url: $(this).data("url")
                            };
                        }
                        "function" == typeof options && options(e)
                    })
                }), $(".kit-side-fold").off("click").on("click", function () {
                    let i = $(this).find("div.kit-side");
                    i.hasClass("kit-sided") ? (
                            i.removeClass("kit-sided"),
                            i.find("li.layui-nav-item").removeClass("kit-side-folded"),
                            i.find("dd").removeClass("kit-side-folded"),
                            $(this).find("div.layui-body").removeClass("kit-body-folded"),
                            $(this).find("div.layui-footer").removeClass("kit-footer-folded")
                        ) : (
                            i.addClass("kit-sided"),
                            i.find("li.layui-nav-item").addClass("kit-side-folded"),
                            i.find("dd").addClass("kit-side-folded"),
                            $(this).find("div.layui-body").addClass("kit-body-folded"),
                            $(this).find("div.layui-footer").addClass("kit-footer-folded")
                        )
                }), _this
            ) : _this
        },
        render: function (options) {
            let _this = this,
                d = _this.config,
                o = d.remote,
                r = ['{{# layui.each(d,function(index, item){ }}', '{{# if(item.spread){ }}',
                    '<li class="layui-nav-item layui-nav-itemed">', '{{# }else{ }}',
                    '<li class="layui-nav-item">', '{{# } }}',
                    '{{# var hasChildren = item.children!==undefined && item.children.length>0; }}',
                    "{{# if(hasChildren){ }}", '<a href="javascript:;">',
                    '{{# if (item.icon.indexOf("fa-") !== -1) { }}',
                    '<i class="fa {{item.icon}}" aria-hidden="true"></i>',
                    "{{# } else { }}", '<i class="layui-icon">{{item.icon}}</i>',
                    "{{# } }}", "<span> {{item.title}}</span>", "</a>",
                    "{{# var children = item.children; }}", '<dl class="layui-nav-child">',
                    "{{# layui.each(children,function(childIndex, child){ }}", "<dd>",
                    "<a href=\"javascript:;\" kit-target data-options=\"{url:'{{child.url}}',icon:'{{child.icon}}',title:'{{child.title}}',id:'{{child.id}}'}\">",
                    '{{# if (child.icon.indexOf("fa-") !== -1) { }}', '<i class="fa {{child.icon}}" aria-hidden="true"></i>',
                    "{{# } else { }}", '<i class="layui-icon">{{child.icon}}</i>', "{{# } }}",
                    "<span> {{child.title}}</span>", "</a>", "</dd>", "{{# }); }}","</dl>", "{{# }else{ }}",
                    "<a href=\"javascript:;\" kit-target data-options=\"{url:'{{item.url}}',icon:'{{item.icon}}',title:'{{item.title}}',id:'{{item.id}}'}\">",
                    '{{# if (item.icon.indexOf("fa-") !== -1) { }}',
                    '<i class="fa {{item.icon}}" aria-hidden="true"></i>', "{{# } else { }}",
                    '<i class="layui-icon">{{item.icon}}</i>', "{{# } }}",
                    "<span> {{item.title}}</span>", "</a>", "{{# } }}", "</li>", "{{# }); }}"],
                s = [],
                c = layer.load(2);
            if (!_this.hasElem()) return _this;
            let f = _this.getElem();
            if (void 0 !== d.data && d.data.length > 0) {
                s = d.data;
            } else {
                let u = {
                    url: o.url, type: o.type, error: function (options, e, a) {
                        layui.hint().error("Navbar error:AJAX请求出错." + a)
                    }, success: function (i) {
                        s = i
                    }
                };
                $.extend(true, u, o.jsonp ? {
                    dataType: "jsonp",
                    jsonp: "callback",
                    jsonpCallback: "jsonpCallback"
                } : {dataType: "json"}), $.support.cors = true, $.ajax(u)
            }
            let h = setInterval(function () {
                s.length > 0 && (clearInterval(h), laytpl(r.join("")).render(s, function (e) {
                    f.html(e), element.init(), _this.bind(function (e) {
                        "function" == typeof options && options(e)
                    }), c && layer.close(c)
                }))
            }, 50);
            return _this
        }
    };

    exports('navbar', navbar);
});