import React, { Component } from "react";
import { Form, Icon, Input, Button, message } from 'antd';
import { Redirect } from 'react-router-dom';
import './login.less';
import logo from './images/logo.png';
import { reqLogin } from '../../api';
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';

const FormItem = Form.Item;
// 登录的路由组件
class Login extends Component {
  handleSubmit = (event) => {
    //阻止事件的默认行为
    event.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        //请求登录
        const { username, password } = values;
        const response = await reqLogin(username, password);
        if (response.status === 0) {  //登录成功
          message.success('登陆成功');
          //保存user
          const user = response.data;
          memoryUtils.user = user;  // 保存到内存中
          storageUtils.saveUser(user); // 保存到local中
          // 跳转到管理界面(不需要再回退回来，所以用replace)
          this.props.history.replace('/')
        } else {  //登陆失败
          message.error(response.msg)
        }
        // reqLogin(username, password).then(response => {
        //   console.log('成功了', response.data)
        // }).catch(error => {
        //   console.log('失败了', error)
        // })
        // try {
        //   const response = await reqLogin(username, password);
        //   console.log('请求成功', response.data)
        // } catch (error) {
        //   console.log('请求出错', error)
        // }
      } else {
        console.log('校验失败！')
      }
    });
  }

  validatorPwd = (rule, value, callback) => {
    if (!value) {
      callback('请输入密码')
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback('密码必须由英文、数字或者下划线组成')
    } else if (value.length < 4) {
      callback('密码长度不能小于4位')
    } else if (value.lenght > 12) {
      callback('密码长度不能超过12位')
    } else {
      callback()   //验证通过
    }
  }

  render () {
    //判断用户是否已登录，自动跳转到管理界面
    const user = memoryUtils.user;
    if (user && user._id) {
      return <Redirect to='/' />
    }

    const { getFieldDecorator } = this.props.form;

    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo" />
          <h1>React项目小试：后台管理系统</h1>
        </header>
        <section className="login-content">
          <h2>用户登录</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem>
              {getFieldDecorator('username', {
                //声明式验证
                rules: [
                  { required: true, message: '请输入用户名!' },
                  { min: 4, message: '用户名最少四位!' },
                  { max: 12, message: '用户名最多12位!' },
                  { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或者下划线!' }
                ],
              })(
                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ validator: this.validatorPwd }],
              })(
                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Button type="primary" htmlType="submit" className="login-form-button">
                  登录
                </Button>
              )}
            </FormItem>
          </Form>
        </section>
      </div>
    )
  }
}
export default Form.create()(Login);