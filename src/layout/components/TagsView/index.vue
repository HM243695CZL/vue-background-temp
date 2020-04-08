<template>
    <div class="tags-view-container">
        <scroll-pane ref="scrollPane" class="tags-view-wrapper">
            <router-link
                v-for="tag in visitedViews"
                ref="tag"
                :key="tag.path"
                :class="isActive(tag) ? 'active' : ''"
                :to="{path: tag.path, query: tag.query, fullPath: tag.fullPath}"
                tag="span"
                class="tags-view-item"
                @click.middle.native="closeSelectedTag(tag)"
                @contextmenu.prevent.native="openMenu(tag, $event)"
            >
                {{generateTitle(tag.title)}}
                <span v-if="!tag.meta.affix" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)"></span>
            </router-link>
        </scroll-pane>
        <ul v-show="visible" :style="{left: left + 'px', top: top + 'px'}" class="contextmenu">
            <li @click="refreshSelectedTag(selectedTag)">
                {{ $t("tagsView.refresh")}}
            </li>
            <li v-if="!(selectedTag.meta && selectedTag.meta.affix)" @click="closeSelectedTag(selectedTag)">
                {{ $t("tagsView.close")}}
            </li>
            <li @click="closeOthersTags">
                {{ $t("tagsView.closeOthers")}}
            </li>
            <li @click="closeAllTags(selectedTag)">
                {{ $t("tagsView.closeAll")}}
            </li>
        </ul>
    </div>
</template>

<script>
    import ScrollPane from "./ScrollPane"
    import {generateTitle} from "@/utils/i18n";
    import path from "path"
    export default {
        name: "TagsView",
        data(){
            return {
                visible: false,
                left: 0,
                top: 0,
                selectedTag: {},
                affixTags: []
            }
        },
        computed: {
            visitedViews(){
                return this.$store.state.tagsView.visitedViews;
            },
            routes(){
                return this.$store.state.permission.routes;
            }
        },
        watch: {
            $route(){
                this.addTags();
            },
            visible(value){
                if(value){
                    document.body.addEventListener("click", this.closeMenu);
                }else{
                    document.body.removeEventListener("click", this.closeMenu);
                }
            }
        },
        mounted(){
            this.initTags();
            this.addTags();
        },
        components: {
            ScrollPane
        },
        methods: {
            generateTitle,
            isActive(route){
                return route.path === this.$route.path;
            },
            closeSelectedTag(view){
                this.$store.dispatch("tagsView/delView", view).then( ({visitedViews }) => {
                    if(this.isActive(view)){
                        this.toLastView(visitedViews);
                    }
                })
            },
            toLastView(visitedViews){
                const latestView = visitedViews.slice(-1)[0];
                if(latestView){
                    this.$router.push(latestView);
                }else{
                    //也能设置其他的路由
                    this.$router.push("/");
                }
            },
            openMenu(tag, e){
                const menuMinWidth = 105;
                /**
                 * getBoundingClientRect用于获取某个元素相对于视窗的位置集合
                 */
                const offsetLeft = this.$el.getBoundingClientRect().left; //容器的marginLeft
                const offsetWidth = this.$el.offsetWidth; //容器的宽度
                const maxLeft = offsetWidth - menuMinWidth; //左边界
                const left = e.clientX - offsetLeft + 15; //15是marginRight
                if(left > maxLeft){
                    this.left = maxLeft;
                }else{
                    this.left = left;
                }
                this.top = e.clientY;
                this.visible = true;
                this.selectedTag = tag;
            },
            filterAffixTags(routes, basePath = "/"){
                let tags = [];
                routes.forEach( route => {
                    if(route.meta && route.meta.affix){
                        /**
                         * path.resolve()
                         * 从后向前，若字符以 / 开头，不会拼接到前面的路径(因为拼接到此已经是一个绝对路径)；
                         * 若以 ../ 开头，拼接前面的路径，且不含最后一节路径；
                         * 若以 ./ 开头 或者没有符号 则拼接前面路径
                         */
                        const tagPath = path.resolve(basePath, route.path);
                        tags.push({
                            fullPath: tagPath,
                            path: tagPath,
                            name: route.name,
                            meta: {
                                ...route.meta
                            }
                        })
                    }
                    if(route.children){
                        const tempTags = this.filterAffixTags(route.children, route.path);
                        if(tempTags.length >= 1){
                            tags = [...tags, ...tempTags];
                        }
                    }
                });
                return tags;
            },
            initTags(){
                const affixTags = this.affixTags = this.filterAffixTags(this.routes);
                for (const tag of affixTags){
                    //必须有tag name
                    if(tag.name){
                        this.$store.dispatch("tagsView/addVisitedView", tag);
                    }
                }
            },
            addTags(){
                const { name } = this.$route;
                if(name){
                    this.$store.dispatch("tagsView/addView", this.$route);
                }
                return false;
            },
            closeMenu(){
                this.visible = false;
            },
            moveToCurrentTag(){
                const tags = this.$refs.tag;
               this.$nextTick( () => {
                   for (const tag of tags){
                       if(tag.to.path === this.$route.path){
                           this.$refs.scrollPane.moveToTarget(tag);
                           //如果查询不同，则更新
                           if(tag.to.fullPath !== this.$route.fullPath){
                               this.$store.dispatch("tagsView/updateVisitedView", this.$route);
                           }
                           break;
                       }
                   }
               })
            },
            refreshSelectedTag(view){
                this.$store.dispatch("tagsView/delCachedView", view).then( () => {
                    const { fullPath } = view;
                    /**
                     * nextTick()，是将回调函数延迟在下一次dom更新数据后调用
                     * 当数据更新了，在dom中渲染后，自动执行该函数
                     */
                    this.$nextTick( () => {
                        this.$router.replace({
                            path: "/redirect" + fullPath
                        })
                    })
                })
            },
            closeOthersTags(){
                this.$router.push(this.selectedTag);
                this.$store.dispatch("tagsView/delOthersViews", this.selectedTag).then( (res) => {
                   this.moveToCurrentTag();
                })
            },
            closeAllTags(view){
                this.$store.dispatch("tagsView/delAllViews").then( ( {visitedViews}) => {
                    if(this.affixTags.some(tag => tag.path === view.path)){
                        return;
                    }
                    this.toLastView(visitedViews);
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .tags-view-container{
        height: 34px;
        width: 100%;
        background: #fff;
        border-bottom: 1px solid #d8dce5;
        box-shadow: 0 1px 3px 0 rgba(0,0,0,.12), 0 0 3px 0 rgba(0,0,0,.04);
        .tags-view-wrapper{
            .tags-view-item{
                display: inline-block;
                position: relative;
                cursor: pointer;
                height: 26px;
                line-height: 26px;
                border: 1px solid #d8dce5;
                color: #495060;
                background: #fff;
                padding: 0 8px;
                font-size: 12px;
                margin-left: 5px;
                margin-top: 4px;
                &:first-of-type{
                    margin-left: 15px;
                }
                &:last-of-type{
                    margin-right: 15px;
                }
                &.active{
                    background: #42b983;
                    color: #fff;
                    border-color: #42b983;
                    &::before{
                        content: "";
                        background: #fff;
                        display: inline-block;
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        position: relative;
                        margin-right: 2px;
                    }
                }
            }
        }
        .contextmenu {
            margin: 0;
            background: #fff;
            z-index: 100;
            position: absolute;
            list-style-type: none;
            padding: 5px 0;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 400;
            color: #333;
            box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
            li {
                margin: 0;
                padding: 7px 16px;
                cursor: pointer;
                &:hover {
                    background: #eee;
                }
            }
        }
    }
</style>
<style lang="scss">
    .tags-view-wrapper {
        .tags-view-item {
            .el-icon-close {
                width: 16px;
                height: 16px;
                vertical-align: 2px;
                border-radius: 50%;
                text-align: center;
                transition: all .3s cubic-bezier(.645, .045, .355, 1);
                transform-origin: 100% 50%;
                &:before {
                    transform: scale(.6);
                    display: inline-block;
                    vertical-align: -3px;
                }
                &:hover {
                    background-color: #b4bccc;
                    color: #fff;
                }
            }
        }
    }
</style>