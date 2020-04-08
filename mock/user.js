const tokens = {
    admin: {
        token: "admin-token"
    },
    editor: {
        token: "editor-token"
    }
};

const users = {
    "admin-token": {
        roles: ["admin"],
        introduction: "我是超级管理员",
        avatar: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
        name: "Super Admin"
    },
    "editor-token": {
        roles: ["editor"],
        introduction: "我是编辑者",
        avatar: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
        name: "Normal Editor"
    }
};

export default [
    {
        url: "/test",
        type: "get",
        response: config => {
            return "hm243695czl";
        }
    },
    //用户登录
    {
        url: "/vue-admin-template/user/login",
        type: "post",
        response: config => {
            const {username} = config.body;
            const token = tokens[username];
            if(!token){
                return {
                    code: 60204,
                    message: "账号和密码不正确"
                }
            }
            return {
                code: 20000,
                data: token
            }
        }
    },
    //获取用户信息
    {
        url: "/vue-admin-template/user/info\.*",
        type: "get",
        response: config => {
            const {token} = config.query;
            const info = users[token];
            if(!info){
                return {
                    code: 50008,
                    message: "登录失败，无法获取用户详细信息"
                }
            }
            return {
                code: 20000,
                data: info
            }
        }
    },
    //用户注销
    {
        url: "/vue-admin-template/user/logout",
        type: "post",
        response: _ => {
            return {
                code: 20000,
                data: "success"
            }
        }
    }
]