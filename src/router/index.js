import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);
/**
 * 在路由跳转的时候同一个路由多次添加是不被允许的，不然会报错:
 * “NavigationDuplicated", name: "NavigationDuplicated", message: "Navigating to current location ("/index") is not allowed”
 * 解决方案如下：
 */
const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to){
    return VueRouterPush.call(this, to).catch(err => err)
};
import Layout from "@/layout"

/**
 *constantRoutes：没有权限要求的界面，所有角色都可以访问
 */
export const constantRoutes = [
    {
        path: "/redirect",
        component: Layout,
        hidden: true,
        children: [
            {
                path: "/redirect/:path*",
                component: () => import("@/views/redirect/index")
            }
        ]
    },
    {
        path: "/login",
        hidden: true,
        component: () => import("@/views/login/index")
    },
    {
        path: "",
        component: Layout,
        redirect: "dashboard",
        children: [
            {
                path: "dashboard",
                name: "Dashboard",
                component:() => import("@/views/dashboard/index"),
                meta: {
                    title: "Dashboard",
                    icon: "dashboard",
                    affix: true
                }
            }
        ]
    },
    {
        path: "/documentation",
        component: Layout,
        children: [
            {
                path: "index",
                component: () => import("@/views/documentation/index"),
                name: "Documentation",
                meta: {
                    title: "Documentation",
                    icon: "documentation",
                    affix: true
                }
            }
        ]
    },
    {
        path: "/form",
        component: Layout,
        redirect: "/form/index",
        children: [
            {
                path: "index",
                name: "Form",
                component: () => import("@/views/form/index"),
                meta: {
                    title: "Form",
                    icon: "form"
                }
            }
        ]
    }
];
/**
 * asyncRoutes：需要根据用户角色动态加载的路由
 */
export const asyncRoutes = [
    {
        path: "/example",
        component: Layout,
        redirect: "/example/table",
        meta: {
            title: "Example",
            icon: "example"
        },
        children: [
            {
                path: "table",
                name: "Table",
                component: () => import("@/views/example/table/index"),
                meta: {
                    title: "Table",
                    icon: "table"
                }
            },
            {
                path: "tree",
                name: "Tree",
                component: () => import("@/views/example/tree/index"),
                meta: {
                    title: "Tree",
                    icon: "tree"
                }
            },
            {
                path: "article",
                name: "ArticleList",
                component: () => import("@/views/example/article/list"),
                meta: {
                    title: "ArticleList",
                    icon: "tree"
                }
            },
            {
                path: "article/edit/:id",
                name: "Article_Edit",
                component: () => import("@/views/example/article/edit"),
                meta: {
                    title: "Article_Edit",
                    icon: "tree"
                },
                hidden: true
            }
        ]
    }
];

const createRouter = () => new VueRouter({
    mode: 'history',
    scrollBehavior: () => ({y: 0}),
    base: process.env.BASE_URL,
    routes: constantRoutes
});
const router = createRouter();

export function resetRouter() {
    const newRouter = createRouter();
    router.matcher = newRouter.matcher; //重置路由
}
export default router
