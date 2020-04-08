<template>
    <div :class="{'has-logo': showLogo}">
        <logo v-if="showLogo" :collapse="isCollapse"></logo>
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-menu
                    :default-active="$route.path"
                    :collapse="isCollapse"
                    :background-color="variables.menuBg"
                    :text-color="variables.menuText"
                    :unique-opened="false"
                    :active-text-color="variables.menuActiveText"
                    :collapse-transition="false"
                    mode="vertical"
            >
                <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path"></sidebar-item>
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script>
    import Logo from "./Logo"
    import variables from "@/styles/variables.scss"
    import SidebarItem from "./SidebarItem"
    import { mapGetters} from "vuex"
    export default {
        name: "index",
        computed: {
            ...mapGetters([
                "permission_routes",
                "sidebar"
            ]),
            routes(){
                return this.$router.options.routes;
            },
            showLogo(){
                return this.$store.state.settings.sidebarLogo;
            },
            isCollapse(){
                return !this.sidebar.opened;
            },
            variables(){
                return variables;
            }
        },
        components: {
            Logo,SidebarItem
        }
    }
</script>

<style scoped>

</style>