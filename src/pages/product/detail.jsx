import React, {Component} from 'react'
import {List, Icon} from 'antd'
import {reqCategory} from '../../api'

export default class Detail extends Component {
    state = {
        cName1: '',
        cName2: ''
    }
    getCategoryName = async () => {
        const {categoryId, pCategoryId} = this.props.location.state;
        if (pCategoryId === '0') {
            const result = await reqCategory(categoryId);
            const cName1 = result.data.name;
            this.setState({cName1})
        } else {
            const result1 = await reqCategory(pCategoryId)
            const cName1 = result1.data.name
            const result2 = await reqCategory(categoryId)
            const cName2 = result2.data.name
            this.setState({cName1, cName2})
        }
    }

    componentDidMount() {
        this.getCategoryName()
    }

    render() {
        const {name, desc, price, categoryId, pCategoryId, imgs, detail} = this.props.location.state;
        const {cName1, cName2} = this.state
        return (
            <div className="product-detail">
                <h1>
                    <Icon type="arrow-left" onClick={() => this.props.history.goBack()}/>&nbsp;&nbsp;
                    商品详情
                </h1>
                <List>
                    <List.Item>
                        <span className='left'>商品名称:</span>
                        <span>{name}</span>
                    </List.Item>
                    <List.Item>
                        <span className='left'>商品描述:</span>
                        <span>{desc}</span>
                    </List.Item>
                    <List.Item>
                        <span className='left'>商品价格:</span>
                        <span>{price + '元'}</span>
                    </List.Item>
                    <List.Item>
                        <span className='left'>所属分类:</span>
                        <span>{cName1 + '-->' + cName2}</span>
                    </List.Item>
                    <List.Item>
                        <span className='left'>商品图片:</span>
                        <span>
                         {
                            imgs.map(img => (
                                <img src={'http://localhost:5000/upload/' + img} alt="img" key={img}
                            style={{width: 150, height: 150, marginRight: 10}}/>
                             ))
                        }
                        </span>
                    </List.Item>

                    <List.Item>
                        <span className='left'>商品详情:</span>
                        <div dangerouslySetInnerHTML={{__html: detail}}></div>
                    </List.Item>
                </List>

            </div>
        )
    }
}