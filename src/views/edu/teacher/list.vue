<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="teacherQuery.name" placeholder="讲师名"/>
      </el-form-item>
      <el-form-item>
        <el-select v-model="teacherQuery.level" clearable placeholder="讲师头衔">
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="添加时间">
        <el-date-picker
          v-model="teacherQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="teacherQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="getList()">查
        询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row>
      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="80" />
      <el-table-column label="头衔" width="80">
        <template slot-scope="scope">
          {{ scope.row.level===1?'高级讲师':'首席讲师' }}
        </template>
      </el-table-column>
      <el-table-column prop="intro" label="资历" />
      <el-table-column prop="gmtCreate" label="添加时间" width="160"/>
      <el-table-column prop="sort" label="排序" width="60" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/edu/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete"
                     @click="removeDataById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--表单分页功能-->
      <el-pagination
        :current-page="page"
        :page-size="limit"
        :total="total"
        style="padding: 30px 0; text-align: center;"
        layout="total, prev, pager, next, jumper"
        @current-change="getList">
      </el-pagination>
  </div>
</template>

<script>
//引入调用teacher.js文件
import teacher from "@/api/edu/teacher";
  export default {
    data() {
      return {
        list: null,
        page: 1,
        limit: 10,
        total: 0, //总记录数
        teacherQuery: {}
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList(page=1) {
        this.page = page
        teacher.getTeacherListPage(this.page, this.limit, this.teacherQuery)
              .then(response => {
                //请求成功
                //response接口返回的数据
                console.log(response)
                this.list = response.data.row;
                this.total = response.data.total;
              })
              .catch(error => {
                //请求失败
                console.log(error)
              })
      },
      resetData() {
        //清空条件
        this.teacherQuery = {};
        //查询所有列表
        this.getList();
      },
      //删除讲师
      removeDataById(id) {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return teacher.removeById(id)
        }).then(() => {
          this.getList();
          //删除成功
          this.$message({
            message: '删除成功',
            type: 'success'
          });
        }).catch((response) => {
            if (response === 'cancel') {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            } else {
              this.$message({
                type: 'error',
                message: '删除失败'
              })
            }
          })
      }
    }
  }
</script>
