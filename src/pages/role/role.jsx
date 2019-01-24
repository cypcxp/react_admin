import React, {Component,PureComponent} from 'react'
import PorpTypes from 'prop-types'
import {
    Card,
    Button,
    Table,
    Form,
    Input,
    Modal,
    message,
    Tree
} from 'antd'

import menuList from '../../config/menuConfig'
import {formatTime} from '../../utils/utils'
import {reqRoles, reqAddRole, reqUpdateRole} from '../../api'

const FormItem = Form.Item
const { TreeNode } = Tree

export default class Role extends Component {
    state = {
        isShowAdd:false,
        isShowRoleAuth:false,
        roles:[],
        role:{},
        menus:[]
    }
    getRoles = async ()=>{
        const result = await reqRoles();
        if(result.status===0){
            const roles = result.data;
            this.setState({
                roles
            })
        }
    }
    showAddRole = () =>{
        this.setState({
            isShowAdd:true
        })
    }
    showRoleAuth = () =>{
        this.setState({
            isShowRoleAuth:true
        })
    }
    initColumns = () =>{
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: formatTime
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formatTime
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
            }
        ]
    }
    updateRole = async()=>{
        this.setState({
            isShowRoleAuth:false
        })
        const {role, menus}= this.state;
        role.menus=menus;
        const result = await reqUpdateRole(role);
        if(result.status===0){
            message.success('授权成功')
            this.getRoles()
        }
    }
    addRole = async()=>{
        const roleName = this.form.getFieldValue('roleName');
        this.form.resetFields();
        this.setState({
            isShowAdd:false
        })

        const result = await reqAddRole(roleName)
        if(result.status===0){
            message.success('添加角色成功')
            const role = result.data;
            const roles = [...this.state.roles]
            roles.push(role);
            this.setState({
                roles:roles
            })
        }
    }
    onRow = (role) => {
        return {
            onClick: (event) =>{
                this.setState({
                    role,
                    menus:role.menus
                })
            }
        }
    }
    setRoleMenus = (menus) =>{
        this.setState({
            menus
        })
    }
    componentWillMount(){
        this.initColumns()
    }
    componentDidMount(){
        this.getRoles()
    }
  render() {
      const {roles,role, menus, isShowAdd, isShowRoleAuth} = this.state
      const rowSelection = {
          type:'radio',
          selectedRowKeys:[role._id],
          onChange:(selectedRowKeys,selectedRows) =>{
              this.setState({
                  role:selectedRows[0]
              })
          }
      }
    return (
      <div>
        <Card>
            <Button type='primary' onClick={this.showAddRole}>创建角色</Button>&nbsp;
            <Button type='primary' onClick={this.showRoleAuth} disabled={!role._id}>设置角色权限</Button>&nbsp;
        </Card>
        <Table
            columns={this.columns}
            rowKey='_id'
            dataSource={roles}
            bordered
            rowSelection={rowSelection}
            onRow = {this.onRow}
            pagination={{defaultPageSize: 100, showQuickJumper: true}}
        />
          <Modal
            title="创建角色"
            visible={isShowAdd}
            onCancel={()=>{
                this.setState({isShowAdd:false})
            }}
            onOk={this.addRole}
          >
              <AddRoleForm setForm={(form) => this.form = form}/>
          </Modal>
          <Modal
              title="设置角色权限"
              visible={isShowRoleAuth}
              onCancel={() => this.setState({isShowRoleAuth: false, menus: role.menus})}
              onOk={this.updateRole}
          >
              <RoleAuthForm
                  roleName={role.name}
                  menus={menus}
                  setRoleMenus = {this.setRoleMenus}/>
          </Modal>
      </div>
    )
  }
}
class AddRoleForm extends PureComponent{
    componentWillMount(){
        this.props.setForm(this.props.form)
    }
    render() {
        const {getFieldDecorator} = this.props.form
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 16}
        }

        return (
            <Form>
                <FormItem label="角色名称" {...formItemLayout}>
                    {
                        getFieldDecorator('roleName', {
                            initialValue: ''
                        })(
                            <Input type="text" placeholder="请输入角色名称"/>
                        )
                    }
                </FormItem>
            </Form>
        )
    }
}
AddRoleForm = Form.create()(AddRoleForm)
class RoleAuthForm extends PureComponent{
    static propTypes = {
        roleName:PorpTypes.string,
        menus:PorpTypes.array,
        setRoleMenus:PorpTypes.func
    }
    onCheck = (checkedKeys,info)=>{
        this.props.setRoleMenus(checkedKeys)
    }
    renderTreeNodes = (menuList) =>{
        return menuList.reduce((pre,menu)=>{
            const node = (
                <TreeNode title={menu.title} key={menu.key}>
                    {
                        menu.children?this.renderTreeNodes(menu.children):null
                    }
                </TreeNode>
            )
            pre.push(node)
            return pre
        },[])
    }
    render(){
        const {roleName,menus} = this.props
        const formItemLayout ={
            labelCol: {span: 5},
            wrapperCol: {span: 16}
        }
        return(
            <Form>
                <FormItem label="角色名称：" {...formItemLayout}>
                    <Input value={roleName} disabled/>
                </FormItem>
                <Tree
                    checkable
                    defaultExpandAll
                    onCheck={this.onCheck}
                    checkedKeys={menus}
                >
                    <TreeNode title="平台权限" key="all">
                        {this.renderTreeNodes(menuList)}
                    </TreeNode>
                </Tree>
            </Form>


        )
    }
}
