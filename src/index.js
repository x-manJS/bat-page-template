import "@babel/polyfill";
import Vue from "vue";
import router from "@/router";

import "@/plugin/rem";
import "@/common/common.less"
let v = new Vue({
  el: "#app",
  router
});
