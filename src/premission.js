import router from "./router"
import store from "./store"
import {Message} from "element-ui"
import NProgress from "nprogress" //进度条
import "nprogress/nprogress.css" //进度条样式
import {getToken} from "@/utils/auth" //从cookie中获取token
import getPageTitle from "@/utils/get-page-title"

NProgress.configure({showSpinner: false}); //头部加载进度条配置

const whiteList = ["/login"]; //不重定向的白名单
//路由跳转之前
router.beforeEach(async (to, from, next) => {
    //开始显示进度条
    NProgress.start();
    //设置页面title
    document.title = getPageTitle(to.meta.title);
    //验证用户是否已登录
    const hasToken = getToken();
    if(hasToken){
        if(to.path === "/login"){
            //如果已登录，重定向到首页
            next({
                path: "/"
            });
            NProgress.done(); //隐藏进度条
        }else{
            //确定用户是否已通过getInfo获得其权限角色
            // const hasGetUserInfo = store.state.name;
            const hasRoles = store.getters.roles && store.getters.roles.length > 0;
            if(hasRoles){
                next();
            }else{
                try {
                    /**
                     * dispatch 异步操作 this.$store.dispatch('actions的方法'，arg)
                     * commit 同步操作 this.$store.commit('mutations的方法'，arg)
                     */
                    //获取用户信息
                    //注意：角色必须是对象数组，如["admin"] 或 ["developer", "editor"]
                    const {roles} = await store.dispatch("user/getInfo");
                    //基于角色生成可访问路由图
                    const accessRoutes = await store.dispatch("permission/generateRoutes", roles);
                    //动态添加可访问路由
                    router.addRoutes(accessRoutes);
                    //确保addRoutes完整的hack方法
                    //设置replace: true，这样导航就不会留下历史记录
                    next({
                        ...to,
                        replace: true
                    });
                } catch (err) {
                    //删除令牌并重新登录
                    await store.dispatch("user/resetToken");
                    Message.error(err || "Has Error");
                    next(`/login?redirect=${to.path}`);
                    NProgress.done();
                }
            }
        }
    }else{
        if(whiteList.indexOf(to.path) !== -1){
            //路径在白名单中，直接进入
            next();
        }else{
            //没有访问权限的其他页将重定向到登录页
            next(`/login?redirect=${to.path}`);
            NProgress.done();
        }
    }
});

router.afterEach( () => {
    NProgress.done();
});