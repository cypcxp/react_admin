import React, {Component} from 'react'
import {Row, Col, Modal} from 'antd'
import {withRouter} from 'react-router-dom'

import menuList from '../../config/menuConfig'
import {reqWeather} from '../../api'
import {formatTime} from '../../utils/utils'
import MemoryUtils from '../../utils/MemoryUtils'
import storageUtils from '../../utils/storageUtils'
import './header.less'

class Header extends Component {
    state = {
        sysTime: formatTime(Date.now()),
        dayPictureUrl: '',
        weather: ''
    }
    getWeather = async () => {
        const {dayPictureUrl, weather} = await reqWeather('北京');
        this.setState({
            dayPictureUrl,
            weather
        })
    }
    getSysTime = () => {
        this.intervalId = setInterval(() => {
            this.setState({
                sysTime: formatTime(Date.now())
            })
        },1000)
    }

    logout = () => {
        Modal.confirm({
            content: 'Are you sure',
            onOk:() => {
                console.log(11111)
                storageUtils.removeUser();
                MemoryUtils.user = {};
                this.props.history.replace('/login');
            },
            onCancel(){
                console.log('Cancel')
            },
        })
    }
    getTitle = (path) => {
        let title
        menuList.forEach(menu => {
            if (menu.key === path) {
                title = menu.title;
            } else if (menu.children) {
                menu.children.forEach(item => {
                    if (item.key === path) {
                        title = item.title;
                    }
                })
            }
        })
        return title;
    }

    componentDidMount() {
        this.getSysTime();
        this.getWeather();
    }

    componentWillUnmount() {
        clearInterval(this.intervalId)
    }

    render() {
        const {sysTime, dayPictureUrl, weather} = this.state;
        const user = MemoryUtils.user;
        const path = this.props.location.pathname;
        const title = this.getTitle(path)
        return (
            <div className='header'>
                <Row className='header-top'>
                    <span>欢迎，{user.username}</span>
                    <a href="javascript:" onClick={this.logout}>退出</a>
                </Row>
                <Row className='breadcrumb'>
                    <Col span={4} className='breadcrumb-title'>{title}</Col>
                    <Col span={20} className='weather'>
                        <span className='date'>{sysTime}</span>
                        <span className='weather-img'>
                            <img src={dayPictureUrl} alt="weather"/>
                        </span>
                        <span className='weather-detail'>{weather}</span>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default withRouter(Header)