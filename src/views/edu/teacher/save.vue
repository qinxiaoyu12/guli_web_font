<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right"
                         min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
          数据类型一定要和取出的json中的一致，否则没法回填
          因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>
      <!-- 讲师头像：TODO -->
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary"
                   @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacher from "@/api/edu/teacher";
  export default {
    data() {
      return {
        teacher: {
          name: '',
          sort: 0,
          level: 1,
          career: '',
          intro: '',
          avatar: ''
        },
        saveBtnDisabled: false
      }
    },
    watch: { //路由监听器，路由发生变化就会执行下列方法
      $route(to, from) {
        this.init();
      }
    },
    created() { //页面渲染之前执行
      this.init();
    },
    methods: {
      saveOrUpdate() {
        if (!this.teacher.id) {
          this.saveBtnDisabled = true
          this.saveData()
        } else {
          this.updateTeacher()
        }
      },
      //保存修改页面初始化
      init() {
        //判断路径是否有id值
        if (this.$route.params && this.$route.params.id) {
          //从路径获取id值
          const id = this.$route.params.id
          //调用更具id查询的方法
          this.getInfo(id)
        } else {
          this.teacher = {}
        }
      },
      //保存
      saveData() {
        teacher.addTeacher(this.teacher)
              .then(response => { //添加成功
                //添加成功
                this.$message({
                  message: '添加成功',
                  type: 'success'
                });
                //回到列表页面 路由跳转
                this.$router.push({path:'/teacher/table'})
              })
      },
      getInfo(id) {
        teacher.getTeacherInfo(id)
              .then(response => { //获取成功
                  this.teacher = response.data.teacher
              })
      },
      //修改讲师
      updateTeacher() {
        teacher.updateTeacher(this.teacher)
              .then(response => { //修改成功
                //修改成功
                this.$message({
                  message: '修改成功',
                  type: 'success'
                });
              });
              //回到列表页面 路由跳转
              this.$router.push({path:'/teacher/table'})
      }
    }
  }
</script>
