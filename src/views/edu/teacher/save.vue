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
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar"/>
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload"
                   @click="imagecropperShow=true">更换头像
        </el-button>
        <!--
        v-show：是否显示上传组件
        :key：类似于id，如果一个页面多个图片上传控件，可以做区分
        :url：后台上传的url地址
        @close：关闭上传组件
        @crop-upload-success：上传成功后的回调 -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API+'/eduoss/fileoss/upload'"
          field="multipartFile"
          @close="close"
          @crop-upload-success="cropSuccess"/>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary"
                   @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacher from "@/api/edu/teacher";
import ImageCropper from '@/components/ImageCropper';
import PanThumb from '@/components/PanThumb';
  export default {
    components: {ImageCropper, PanThumb},
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
        imagecropperShow: false,
        saveBtnDisabled: false,
        imagecropperKey: 0,
        BASE_API: process.env.BASE_API //获取dev.env.js里面地址
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
      },
      //关闭弹框方法
      close() {
        this.imagecropperShow = false
        // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
        this.imagecropperKey = this.imagecropperKey + 1
      },
      //上传头像成功的方法
      cropSuccess(data) {
         this.imagecropperShow = false
         this.teacher.avatar = data.url
        // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
        this.imagecropperKey = this.imagecropperKey + 1
      }
    }
  }
</script>
