<template>
    <section class="app-main">
        <transition name="fade-transform" mode="out-in">
            <keep-alive>
                <router-view :key="key"></router-view>
            </keep-alive>
        </transition>
    </section>
</template>

<script>
    export default {
        name: "AppMain",
        computed: {
            key(){
                return this.$route.path;
            },
            cachedViews(){
                return this.$store.state.tagsView.cachedViews;
            }
        }
    }
</script>

<style scoped>
    .app-main {
        min-height: calc(100vh - 50px);
        width: 100%;
        position: relative;
        overflow: hidden;
    }
    .fixed-header+.app-main {
        padding-top: 50px;
    }
    .hasTagsView {
        .app-main {
            /* 84 = navbar + tags-view = 50 + 34 */
            min-height: calc(100vh - 84px);
        }

        .fixed-header+.app-main {
            padding-top: 84px;
        }
    }
</style>