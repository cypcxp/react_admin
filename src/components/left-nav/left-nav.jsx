import React, {Component} from 'react'
import {NavLink,withRouter} from 'react-router-dom'
import {Menu,Icon} from 'antd'
import menuList from '../../config/menuConfig'
import logo from '../../assets/images/logo.png'
import './left-nav.less'
const SubMenu = Menu.SubMenu;
class leftNav extends Component {
    getNodes=(list)=>{
        return list.reduce((pre,item)=>{
            if(item.children){
                const subMenu=(
                    <SubMenu key={item.key} title={<span><Icon type={item.icon}/><span>{item.title}</span></span>}>
                        {
                            this.getNodes(item.children)
                        }

                    </SubMenu>

                )
                pre.push(subMenu)
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
        this.menuNodes=this.getNodes(menuList)
    }
    render() {
        const path=this.props.location.pathname
        return (
            <div className="left-nav">
                <NavLink to='/home' className='logo'>
                    <img src={logo} alt="logo"/>
                    <h1>硅谷后台</h1>
                </NavLink>
                <Menu
                    theme='dark'
                    defaultOpenKeys={[path]}
                    mode="inline"
                >
                    {this.menuNodes}
                </Menu>
            </div>
        )
    }
}
export default withRouter(leftNav)