import React, {Component} from 'react'
import {
    Form,
    Icon,
    Input,
    Button
} from 'antd'
import logo from '../../assets/images/logo.png'
import './index.less'
import PropTypes from 'prop-types'
import {reqLogin} from '../../api'
import storageUtils from '../../utils/storageUtils'
import MemoryUtils from '../../utils/MemoryUtils'


export default class Login extends Component {

    state = {
        errorMsg : ''
    }

    login = async(username,password)=>{
        const result = await reqLogin(username,password);
        if(result.status===0){
            const user = result.data;
            storageUtils.saveUser(user);
            MemoryUtils.user=user;
            this.props.history.repalce('/')
        }else{
            this.setState({
                errorMsg:result.msg
            })
        }
    }
    render() {
        const {errorMsg}=this.state
        return (
            <div className="login">
                <div className="login-header">
                    <img src={logo} alt="logo"/>
                    React项目: 后台管理系统
                </div>
                <div className="login-content">
                    <div className="login-box">
                        <div className="error-msg-wrap">
                            <div className={errorMsg ? "show" : ""}>
                                {errorMsg}
                            </div>
                        </div>
                        <div className="title">
                            用户登录
                        </div>
                        <LoginForm login={this.login}/>
                    </div>
                </div>
            </div>
        )
    }
}
class LoginForm extends React.Component {
    static  propTypes ={
        login: PropTypes.func.isRequired
    }
    clickSubmit = () => {

        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const {username,password} = values;
                this.props.login(username,password);
            }else {
                // this.props.form.resetFields()
            }
        });
    }
    checkPassword = (rule, value, callback) => {

        if (!value) {
            callback('必须输入密码');
        } else if(value.length<4 || value.length>8) {
            callback('密码必须是4到8位')
        } else {
            callback()
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form className="login-form">
                <Form.Item>
                    {
                        getFieldDecorator('userName', {
                        initialValue: 'admin',
                        rules: [
                            { type:"string",required: true, message: '必须输入用户名' },
                            { min: 4, message:'长度不能小于4'},
                        ],
                    })(
                        <Input prefix={<Icon type="user"/>} placeholder="Username" />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{ validator:this.checkPassword }],
                    })(
                        <Input prefix={<Icon type="lock"/>} type="password" placeholder="Password" />
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={this.clickSubmit} className="login-form-button">
                        登录
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

LoginForm = Form.create()(LoginForm);