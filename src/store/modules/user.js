import {login, logout, getInfo} from "@/api/user"
import {getToken, setToken, removeToken} from "@/utils/auth";
import router, { resetRouter} from "@/router";

const state = {
    token: getToken(),
    name: "",
    avatar: "",
    introduction: "",
    roles: []
};

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token;
    },
    SET_INTRODUCTION: (state, introduction) => {
        state.introduction = introduction;
    },
    SET_NAME: (state, name) => {
        state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles;
    }
};

const actions = {
    /**
     * mutation中是存放处理数据的方法的集合,使用的时候需要commit
     * commit是同步函数，而且只能是同步执行
     * 在actions中提交mutation，并且可以包含任何的异步操作
     * actions可以理解为通过将mutations里面处里数据的方法变成可异步的处理数据的方法
     * 简单的说就是异步操作数据（但是还是通过mutation来操作，因为只有它能操作）
     */
    //登录
    login({commit}, userInfo){
        const {username, password} = userInfo;
        return new Promise(((resolve, reject) => {
            login({
                username: username.trim(),
                password: password
            }).then( response => {
                const {data} = response;
                commit("SET_TOKEN", data.token);
                setToken(data.token);
                resolve();
            }).catch( error => {
                reject(error);
            })
        }))
    },
    //获取用户信息
    getInfo({commit, state}){
        return new Promise(((resolve, reject) => {
            getInfo(state.token).then( response => {
                const {data} = response;
                if(!data){
                    reject("验证失败，请重新登录");
                }
                const {name, avatar, roles, introduction } = data;
                //角色必须是非空数组
                if(!roles || roles.length  <= 0){
                    reject("getInfo: 角色必须是非空数组！")
                }
                commit("SET_NAME", name);
                commit("SET_AVATAR", avatar);
                commit("SET_ROLES", roles);
                commit("SET_INTRODUCTION", introduction);
                resolve(data);
            }).catch(error => {
                reject(error);
            })
        }))
    },
    //用户注销
    logout({commit, state}){
        return new Promise(((resolve, reject) => {
            logout(state.token).then( () => {
                commit("SET_TOKEN", "");
                commit("SET_ROLES", []);
                removeToken(); //必须先删除令牌
                resetRouter();
                resolve();
            }).catch( error => {
                reject(error);
            })
        }))
    },
    //删除令牌
    resetToken({commit}){
        return new Promise((resolve) => {
            commit("SET_TOKEN", "");
            commit("SET_ROLES", []);
            removeToken(); //必须先删除令牌
            resolve();
        })
    },
    //动态修改权限
    changeRoles( {commit, dispatch}, role){
        return new Promise(async resolve => {
            const token = role + "-token";
            commit("SET_TOKEN", token);
            setToken(token);
            const {roles} = await dispatch("getInfo");
            resetRouter();

            //基于角色生成可访问路由图
            const accessRoutes = await dispatch("permission/generateRoutes", roles, {root: true});
            //动态添加可访问路由
            router.addRoutes(accessRoutes);
            resolve();
        })
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
}