//用于切换router.meta.title， 面包屑导航的标签视图
export function generateTitle(title){
    const hasKey = this.$te("route." + title);
    if(hasKey){
        //$t：这个方法是vue-i18n， 在"@/lang/index.js"注入
        return this.$t("route." + title);
    }
    return title;
}