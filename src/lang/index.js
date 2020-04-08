import Vue from "vue"
import VueI18n from "vue-i18n"
import Cookies from "js-cookie"
import elementEnLocale from "element-ui/lib/locale/lang/en"
import elementZhLocale from "element-ui/lib/locale/lang/zh-CN"
import elementEsLocale from "element-ui/lib/locale/lang/es"
import enLocale from "./en"
import zhLocale from "./zh"
import esLocale from "./es"

Vue.use(VueI18n);

const messages = {
    en: {
        ...enLocale,
        ...elementEnLocale
    },
    zh: {
        ...zhLocale,
        ...elementZhLocale
    },
    es: {
        ...esLocale,
        ...elementEsLocale
    }
};
const i18n = new VueI18n({
    //设置 本地
    locale: Cookies.get("language") || "en",
    //设置 本地信息
    messages
});
export default i18n;