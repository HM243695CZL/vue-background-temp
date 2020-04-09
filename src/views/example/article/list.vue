<template>
    <div class="list-container">
        <el-table
                :data="tableData"
                style="width: 100%">
            <el-table-column
                    prop="date"
                    label="日期"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="姓名"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="address"
                    label="地址">
                <template slot-scope="scope">
                    <router-link :to="'/example/article/edit/' + scope.row.id">
                        <div class="link">
                            <span>{{scope.row.address}}</span>---->>点我进入详情
                        </div>
                    </router-link>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: "list",
        data(){
            return {
                tableData: [{
                    id: "1",
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    id: "2",
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    id: "3",
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    id: "4",
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }]
            }
        }
    }
</script>

<style scoped lang="scss">
    .list-container{
        .link{
            color: #337ab7;
            cursor: pointer;
        }
    }
</style>