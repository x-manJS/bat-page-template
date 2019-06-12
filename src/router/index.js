import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import routes from "./routes.js";
import util from "@/lib/util";

var router = new VueRouter({ routes });

router.beforeEach((to, from, next) => {
  if (to.matched.some(r => r.meta.auth)) {
    const token = util.cookies.get("token");
    if (token && token !== "undefined") {
      next();
    } else {
      // 没有登录的时候跳转到登录界面
      // 携带上登陆成功之后需要跳转的页面完整路径
      next({
        name: "login",
        query: {
          redirect: to.fullPath
        }
      });
    }
  } else {
    next();
  }
});

router.afterEach(to => {
  // 更改标题
  util.title(to.meta.title);
});

export default router;
