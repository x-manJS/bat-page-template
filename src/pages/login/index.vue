
<template lang="pug">
    div
        div 微信授权
        div(id="login")
</template>

<script>
import request from "@/plugin/axios";
import util from "@/lib/util";

export default {
    methods: {
        doWxConf: function() {
            var options = { debug: true, jsApiList: [] };
            var vm = this;
            this.getWeixinWebInfo()
                .then(info => {
                    options = Object.assign(options, {
                        appId: info.appId,
                        nonceStr: info.nonceStr,
                        signature: info.signature,
                        ticket: info.ticket,
                        timestamp: info.timestamp
                    });

                    // wx.config(options);
                    // todo: 判断是否授权
                    var noWxAuth = location.href.indexOf("code") === -1;
                    if (noWxAuth) {
                        this.wxAuthorizition(info);
                    } else {
                        this.getToken();
                    }
                })
                .catch(() => {});
        },
        wxAuthorizition: function(wxInfo) {
            location.href = wxInfo.authorizeUrl;
        },
        getWeixinWebInfo: function() {
            var url = location.href;
            return request({
                url: "/weixin/web",
                data: { url: url },
                method: "post"
            });
        },
        addLinse: function() {
            wx.ready(this.wxReady.bind(this));
            wx.error(this.wxConfError.bind(this));
        },
        wxReady: function() {},
        wxConfError: function() {
            console.log("wxConfError");
        },
        getToken: function() {
            var code = util.getQueryString("code");
            var state = util.getQueryString("state");
            var vm = this;
            request({
                url: "token/weixin",
                data: { code, state },
                method: "post"
            })
                .then(tokenInfo => {
                    util.cookies.set("token", tokenInfo.token);
                    // todo: 修改掉查询参数
                    vm.$router.replace(vm.$route.query.redirect || "/");
                })
                .catch(() => {
                    // todo: code过期等情况处理
                });
        }
    },
    created: function() {
        this.addLinse();
        this.doWxConf();
    }
};
</script>

<style>
</style>
