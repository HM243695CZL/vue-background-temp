<template>
    <div :class="{ show: show}" class="header-search">
        <svg-icon class-name="search-icon" icon-class="search" @click.stop="click"></svg-icon>
        <el-select
                ref="headerSearchSelect"
                v-model="search"
                :remote-method="querySearch"
                filterable
                default-first-option
                remote
                placeholder="Search"
                class="header-search-select"
                @change="change"
                value=""
        >
            <el-option v-for="item in options" :key="item.path" :value="item" :label="item.title.join('>')" />
        </el-select>
    </div>
</template>

<script>
    //fuse是一个轻量级的模糊搜索模块，可以使搜索结果更符合预期
    import Fuse from "fuse.js"
    import path from "path"
    import i18n from "@/lang"
    export default {
        name: "HeaderSearch",
        data(){
            return {
                search: "",
                show: false,
                options: [],
                searchPool: [],
                fuse: undefined
            }
        },
        computed: {
            routes(){
                return this.$store.getters.permission_routes;
            },
            lang() {
                return this.$store.getters.language
            }
        },
        watch: {
            lang() {
                this.searchPool = this.generateRoutes(this.routes)
            },
            show(value){
                if(value){
                    document.body.addEventListener("click", this.close);
                }else{
                    document.body.removeEventListener("click", this.close);
                }
            },
            routes(){
                this.searchPool = this.generateRoutes(this.routes);
            },
            searchPool(list){
                this.initFuse(list);
            }
        },
        mounted(){
            this.searchPool = this.generateRoutes(this.routes);
        },
        methods: {
            click(){
                this.show = !this.show;
                if(this.show){
                    this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.focus();
                }
            },
            close(){
                this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.blur();
                this.options = [];
                this.show = false;
            },
            querySearch(query){
                if(query !== ""){
                    this.options = this.fuse.search(query);
                }else{
                    this.options = [];
                }
            },
            change(val){
                this.$router.push(val.path);
                this.search = "";
                this.options = [];
                this.$nextTick(() => {
                    this.show = false
                })
            },
            /**
             * 筛选出可以在侧边栏中显示的路由
             * 并生成国际化的标题
             */
            generateRoutes(routes, basePath = "/", prefixTitle = []){
                let res = [];
                for (const router of routes){
                    //跳过隐藏路由
                    if(routes.hidden){ continue;}
                    const data = {
                        path: path.resolve(basePath, router.path),
                        title: [...prefixTitle]
                    };
                    if(router.meta && router.meta.title){
                        //生成国际化标题
                        const i18ntitle = i18n.t(`route.${router.meta.title}`);
                        data.title = [...data.title, i18ntitle];
                        if(router.redirect !== "noredirect"){
                            //只推有标题的路由
                            //特殊情况：需要排除没有重定向的父路由
                            res.push(data);
                        }
                    }
                    //递归子路由
                    if(router.children){
                        const tempRoutes = this.generateRoutes(router.children, data.path, data.title);
                        if(tempRoutes.length > 1 ){
                            res = [ ...res, ...tempRoutes];
                        }
                    }
                }
                return res;
            },
            initFuse(list){
                console.log(list);
                this.fuse = new Fuse(list, {
                    shouldSort: true,
                    threshold: 0.4,
                    location: 0,
                    distance: 100,
                    maxPatternLength: 32,
                    minMatchCharLength: 1,
                    keys: [{
                        name: 'title',
                        weight: 0.7
                    }, {
                        name: 'path',
                        weight: 0.3
                    }]
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .header-search{
        font-size: 0 !important;
        .search-icon {
            cursor: pointer;
            font-size: 18px;
            vertical-align: middle;
        }
        .header-search-select {
            font-size: 18px;
            transition: width 0.2s;
            width: 0;
            overflow: hidden;
            background: transparent;
            border-radius: 0;
            display: inline-block;
            vertical-align: middle;

            /deep/ .el-input__inner {
                border-radius: 0;
                border: 0;
                padding-left: 0;
                padding-right: 0;
                box-shadow: none !important;
                border-bottom: 1px solid #d9d9d9;
                vertical-align: middle;
            }
        }
        &.show {
            .header-search-select {
                width: 210px;
                margin-left: 10px;
            }
        }
    }
</style>