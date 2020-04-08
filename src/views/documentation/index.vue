<template>
    <div class="documentation-container">
        documentation
    </div>
</template>

<script>
    export default {
        name: "index",
        data(){
            return {

            }
        },
        activated(){
            console.log("进入documentation界面");
        },
        deactivated(){
            console.log("离开documentation界面");
        }
    }
</script>

<style scoped>

</style>