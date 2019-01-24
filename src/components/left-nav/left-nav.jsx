import React, {Component} from 'react'
import {NavLink,withRouter} from 'react-router-dom'
import {Menu,Icon} from 'antd'
import menuList from '../../config/menuConfig'
import MemoryUtils from '../../utils/MemoryUtils'
import logo from '../../assets/images/logo.png'
import './left-nav.less'
const SubMenu = Menu.SubMenu;
class leftNav extends Component {
    hasAuth = item =>{
        const key = item.key;
        const set = this.menuSet
        if(item.isPublic || MemoryUtils.user.username==='admin' || menuSet.has(key)) {
            return true
        } else if(item.children){
            return !!item.children.find(child => menuSet.has(child.key))
        }
    }
    getNodes=(list)=>{
        return list.reduce((pre,item)=>{
            if(this.hasAuth(item)){
            if(item.children) {
                const subMenu = (
                    <SubMenu key={item.key} title={<span><Icon type={item.icon}/><span>{item.title}</span></span>}>
                        {
                            this.getNodes(item.children)
                        }

                    </SubMenu>

                )
                pre.push(subMenu)
                const path = this.props.location.pathname;
                const cItem = item.children.find((child => path.indexOf(child.key)===0))
                if(cItem) {
                    this.openKey = item.key
                    this.selectKey = cItem.key
                }
            }
            }else{
                const menuItem=(
                   <Menu.Item key={item.key}>
                       <NavLink to={item.key}>
                           <Icon type={item.icon}/>{item.title}
                       </NavLink>

                   </Menu.Item>
                )
                pre.push(menuItem)
            }
            return pre
        },[])
    }
    componentWillMount(){
        this.menuSet = new Set(MemoryUtils.user.role.menus)
        this.menuNodes=this.getNodes(menuList)
    }
    render() {
        const path=this.selectKey ||this.props.location.pathname
        return (
            <div className="left-nav">
                <NavLink to='/home' className='logo'>
                    <img src={logo} alt="logo"/>
                    <h1>硅谷后台</h1>
                </NavLink>
                <Menu
                    theme='dark'
                    defaultSelectedKeys={[path]}
                    defaultOpenKeys={[this.openKey]}>
                    mode="inline"
                >
                    {this.menuNodes}
                </Menu>
            </div>
        )
    }
}
export default withRouter(leftNav)