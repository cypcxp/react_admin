import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
    Card,
    Button,
    Table,
    Form,
    Input,
    Modal,
    Select
} from 'antd'
import {
    reqUsers,
    reqAddOrUpdateUser,
    reqDeleteUser
} from '../../api'
import {formatTime} from '../../utils/utils'
const FormItem = Form.Item
const Option = Select.Option
export default class User extends Component {
    state = {
        isShow: false,
        users: [],
        roles: []
    }
    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '邮箱',
                dataIndex: 'email'
            },
            {
                title: '电话',
                dataIndex: 'phone'
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formatTime
            },
            {
                title: '所属属性',
                dataIndex: 'role_id',
                render: value => this.roleNames[value]
            },
            {
                title: '操作',
                render: (user) => (
                    <span>
                      <a href="javascript:;" onClick={() => this.showUpdate(user)}>修改</a>
                      <a href="javascript:;" onClick={() => this.clickDelete(user)}>删除</a>
                  </span>
                )
            }
        ]
    }
    initRoleNames = roles => {
        this.roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name;
            return pre;
        }, {})
    }
    clickDelete = user => {
        Modal.confirm({
            content: `确定删除${user.username}么`,
            onOk: async () => {
                const result = await reqDeleteUser(user._id);
                if (result.status === 0) {
                    this.getUsers()
                }
            }
        })
    }
    showUpdate = user => {
        this.user = user;
        this.setState({
            isShow: true
        })
    }
    getUsers = async () => {
        const result = await reqUsers();
        if (result.status === 0) {
            const {users, roles} = result.data;
            this.initRoleNames(roles);
            this.setState({
                users,
                roles
            })
        }
    }
    showAddUser = () => {
        this.user = null;
        this.setState({
            isShow: true
        })
    }
    AddorUpdateUser = async() =>{
        const user = this.form.getFieldsValue();
        this.form.resetFields();
        if(this.user){
            user._id=this.user._id
        }
        this.setState({
            isShow:false
        })
        const result = await reqAddOrUpdateUser(user)
        if(result.status===0){
            this.getUsers()
        }
    }
    componentWillMount(){
        this.initColumns()
    }
    componentDidMount(){
        this.getUsers()
    }
    render() {
        const {users,roles,isShow}=this.state;
        const user = this.user || {}
        return (
            <div>
                <Card>
                    <Button type="primary" onClick={this.showAddUser}>创建用户</Button>
                </Card>
                <Table
                    columns={this.columns}
                    rowKey="_id"
                    dataSource={users}
                    bordered
                    pagination={{defaultPageSize: 10, showQuickJumper: true}}
                />
                <Modal
                    title={user._id?'修改用户':'添加用户'}
                    visible={isShow}
                    onCancel={()=>this.setState({isShow:false})}
                    onOk={this.AddorUpdateUser}
                >
                   <UserForm setForm={(form)=>this.form=form} user={user} roles={roles}/>
                </Modal>
            </div>
        )
    }
}
class UserForm extends Component{
    static propTypes ={
        setForm: PropTypes.func.isRequired,
        user: PropTypes.object,
        roles:PropTypes.array
    }
    componentWillMount(){
        this.props.setForm(this.props.form)
    }
    render(){
        const {getFieldDecorator}=this.props.form
        const formItemLayout={
            labelCol:{span:5},
            wrapperCol:{span:16}
        }
        const {user,roles} = this.props
        return (
            <Form>
                <FormItem label='用户名' {...formItemLayout}>
                    {
                        getFieldDecorator('username',{
                            initialValue:user.username
                        })(
                            <Input type='text' placeholder="请输入用户名"/>
                        )
                    }
                </FormItem>
                {
                    !user._id?
                        (
                            <FormItem label='密码' {...formItemLayout}>
                                {
                                    getFieldDecorator('password',{
                                        initialValue:''
                                    })(
                                        <Input type='password' placeholder="请输入用密码"/>
                                    )
                                }
                            </FormItem>
                        ):null
                }
                <FormItem label='邮箱' {...formItemLayout}>
                    {
                        getFieldDecorator('email',{
                            initialValue:user.username
                        })(
                            <Input type='email' placeholder="请输入用邮箱"/>
                        )
                    }
                </FormItem>
                <FormItem label='手机号' {...formItemLayout}>
                    {
                        getFieldDecorator('phone',{
                            initialValue:user.phone
                        })(
                            <Input type='phone' placeholder="请输入手机号"/>
                        )
                    }
                </FormItem>
                <FormItem label='角色' {...formItemLayout}>
                    {
                        getFieldDecorator('role_id',{
                            initialValue:user.role_id
                        })(
                            <Select style={{width:200}}>
                                {
                                    roles.map(role=><Option key={role._id} value={role._id}>{role.name}</Option>)
                                }
                            </Select>
                        )
                    }
                </FormItem>
            </Form>
        )
    }
}
UserForm = Form.create()(UserForm)