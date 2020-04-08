<template>
    <div class="login-container">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
                 label-position="left">
            <div class="title-container">
                <h3 class="title">
                    {{ $t("login.title") }}
                </h3>
                <lang-select class="set-language"></lang-select>
            </div>
            <el-form-item prop="username">
                <span class="svg-container">
                    <svg-icon icon-class="user"></svg-icon>
                </span>
                <el-input
                        ref="username"
                        v-model="loginForm.username"
                        placeholder="请输入用户名"
                        name="username"
                        type="text"
                        tabindex="1"
                        auto-complete="on"
                ></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <span class="svg-container">
                  <svg-icon icon-class="password"></svg-icon>
                </span>
                <el-input
                        :key="passwordType"
                        ref="password"
                        v-model="loginForm.password"
                        :type="passwordType"
                        placeholder="请输入密码"
                        name="password"
                        auto-complete="on"
                        @keyup.enter.native="handleLogin"
                ></el-input>
            </el-form-item>
            <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
                       @click.native.prevent="handleLogin"> {{ $t("login.logIn")}}
            </el-button>
            <div class="tips">
                <span style="margin-right:20px;">username: admin</span>
                <span> password: any</span>
            </div>
        </el-form>
    </div>
</template>

<script>
    import {validUsername} from "@/utils/validate";
    import LangSelect from "@/components/LangSelect"
    export default {
        name: "Login",
        data() {
            const validateUsername = (rule, value, cb) => {
                if (!validUsername(value)) {
                    cb(new Error("请输入正确的用户名"));
                } else {
                    cb();
                }
            };
            const validatePassword = (rule, value, cb) => {
                if (value.length < 6) {
                    cb(new Error("密码不能少于6位"))
                } else {
                    cb();
                }
            };
            return {
                loginForm: {
                    username: "admin",
                    password: "111111"
                },
                loginRules: {
                    username: [{
                        required: true,
                        trigger: "blur",
                        validator: validateUsername
                    }],
                    password: [{
                        required: true,
                        trigger: "blur",
                        validator: validatePassword
                    }]
                },
                passwordType: "password",
                loading: false,
                redirect: undefined
            }
        },
        components: {
            LangSelect
        },
        watch: {
            /**
             * watch 是一个对象，对象就有键，有值。
             * 值可以是函数：就是当你监控的家伙变化时，需要执行的函数，这个函数有两个形参，第一个是变化后的值，第二个是变化前的值。
             * 值也可以是函数名：不过这个函数名要用单引号来包裹。
             * 值是包括选项的对象：选项包括有三个。
             * handler：其值是一个回调函数。即监听到变化时应该执行的函数。
             * deep： 其值是true或false；确认是否深入监听。deep的意思就是深入观察，监听器会一层层的往下遍历，给对象的所有属性都加上这个监听器
             * immediate：其值是true或false；true代表如果在 watch 里声明了之后，就会立即先去执行里面的handler方法，false不会在绑定的时候就执行
             */
            $route: {
                handler: function (route) {
                    this.redirect = route.query && route.query.redirect;
                },
                immediate: true
            }
        },
        methods: {
            handleLogin() {
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        this.loading = true;
                        this.$store.dispatch("user/login", this.loginForm).then( () => {
                            this.$router.push({
                                path: this.redirect || "/"
                            });
                            this.loading = false;
                        }).catch( () => {
                            this.loading = false;
                        })
                    } else {
                        console.log("error");
                        return false;
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    /* 修复input 背景不协调 和光标变色 */
    /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

    $bg: #283443;
    $light_gray: #fff;
    $cursor: #fff;

    @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
        .login-container .el-input input {
            color: $cursor;
        }
    }

    /* reset element-ui css */
    .login-container {
        .el-input {
            display: inline-block;
            height: 47px;
            width: 85%;

            input {
                background: transparent;
                border: 0px;
                -webkit-appearance: none;
                border-radius: 0px;
                padding: 12px 5px 12px 15px;
                color: $light_gray;
                height: 47px;
                caret-color: $cursor;

                &:-webkit-autofill {
                    box-shadow: 0 0 0px 1000px $bg inset !important;
                    -webkit-text-fill-color: $cursor !important;
                }
            }
        }

        .el-form-item {
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            color: #454545;
        }
    }
</style>

<style lang="scss" scoped>
    $bg:#2d3a4b;
    $dark_gray:#889aa4;
    $light_gray:#eee;

    .login-container {
        min-height: 100%;
        width: 100%;
        background-color: $bg;
        overflow: hidden;

        .login-form {
            position: relative;
            width: 520px;
            max-width: 100%;
            padding: 160px 35px 0;
            margin: 0 auto;
            overflow: hidden;
        }

        .tips {
            font-size: 14px;
            color: #fff;
            margin-bottom: 10px;

            span {
                &:first-of-type {
                    margin-right: 16px;
                }
            }
        }

        .svg-container {
            padding: 6px 5px 6px 15px;
            color: $dark_gray;
            vertical-align: middle;
            width: 30px;
            display: inline-block;
        }

        .title-container {
            position: relative;

            .title {
                font-size: 26px;
                color: $light_gray;
                margin: 0px auto 40px auto;
                text-align: center;
                font-weight: bold;
            }

            .set-language {
                color: #fff;
                position: absolute;
                top: 3px;
                font-size: 18px;
                right: 0px;
                cursor: pointer;
            }
        }

        .show-pwd {
            position: absolute;
            right: 10px;
            top: 7px;
            font-size: 16px;
            color: $dark_gray;
            cursor: pointer;
            user-select: none;
        }

        .thirdparty-button {
            position: absolute;
            right: 0;
            bottom: 6px;
        }

        @media only screen and (max-width: 470px) {
            .thirdparty-button {
                display: none;
            }
        }
    }
</style>