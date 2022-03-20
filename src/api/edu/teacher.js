import request from '@/utils/request'

export default {
  //1.讲师列表
  getTeacherListPage(current, limit, teacherQuery) {
    return request({
      url: `/eduservice/teacher/pageQueryTeacher/${current}/${limit}`,
      method: 'post',
      data: teacherQuery,
    })
},
  //删除讲师
  removeById(id) {
    return request({
      url: `/eduservice/teacher/${id}`,
      method: 'delete',
    })
  }
}
