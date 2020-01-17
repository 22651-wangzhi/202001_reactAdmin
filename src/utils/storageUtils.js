// 进行local数据存储管理的工具模块

export default {
  // 保存
  saveUser (user) {
    localStorage.setItem('user_key', JSON.stringify(user))
  },
  // 读取
  getUser () {
    return JSON.parse(localStorage.getItem('user_key') || '{} ')
  },
  // 删除
  removeUser () {
    localStorage.removeItem('user_key')
  }
}