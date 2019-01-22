import React, {Component} from 'react'
import {Icon, Form, Input, Select, Button, message} from 'antd'

import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
import {reqCategorys, reqAddUpdateCategory} from '../../api'
const Item = Form.Item
const Option = Select.Option
export class SaveUpdate extends Component {
    state ={
        categorys:[],
        subCategorys:[]
    }
    getCategorys =async(parentId)=>{
        const result = await reqCategorys(parentId);
        const categorys = result.data;
        if(parentId==='0'){
            this.setState({
                categorys
            })
        }else{
            this.setState({
                subCategorys:categorys
            },()=>{
                if(categorys.length>0){
                    this.props.form.setFieldsValue({
                        category2: categorys[0]._id
                    })
                }
            })
        }
    }
    renderOptions =()=>{
        const {categorys,subCategorys}=this.state;
        const options= categorys.map(c=>(
            <Option key={c._id} value={c._id}>{c.name}</Option>
        ))
        const subOptions = subCategorys.map(c => (
            <Option key={c._id} value={c._id}>{c.name}</Option>
        ))
        return {options,subOptions}
    }
    showSubCategory = (parentId) =>{
        const product = this.props.location.state ||{};
        product.categorId='';
        this.getCategorys(parentId)
    }
    submit = async()=>{
        const {name, desc, price, category1, category2}=this.props.form.getFieldsValue();
        let pCategoryId,categoryId;
        if(!category2 || category2==='未选择') {
            pCategoryId = '0'
            categoryId = category1
        } else {
            pCategoryId = category1
            categoryId = category2
        }
        const detail = this.refs.editor.getContent();
        const imgs = this.refs.imgs.getImgs();
        const product = {name, desc, price, pCategoryId, categoryId, detail, imgs};
        const p =this.props.location.state;
        if(p){
            product._id= p._id;
        }
        const result = await reqAddUpdateCategory(product);
        if(result.status===0){
            message.success('保存成功');
            this.props.history.replace('product/index')
        }else{
            message.error('保存失败')
        }
    }
    componentDidMount(){
        this.getCategorys('0');
        const product = this.props.location.state;
        if(product && product.pCategoryId!=='0') {
            this.getCategorys(product.pCategoryId)
        }
    }
    render() {
        const {options,subOptions}=this.renderOptions();
        const product = this.props.location.state ||{};
        const {getFieldDecorator}=this.props.form;
        const formItemLayout ={
            labelCol:{span:2},
            wrapperCOl:{span:12}
        };
        let initValue1='未选择';
        let initValue2='未选择';
        if(product.pCategoryId==='0') {
            initValue1 = product.categoryId
        } else if (product.pCategoryId) {
            initValue1 = product.pCategoryId
            initValue2 = product.categoryId || '未选择'
        }
        return (
            <div>
               <h2>
                   <a href="javascript:" onClick={()=>this.props.history.goBack()}>
                       <Icon type='arrow-left'/>
                   </a>
                   &nbsp;&nbsp;
                   {product._id?'编辑商品':'添加商品'}
                   <Form>
                       <Item label='商品名称' labelCol={{span: 2}} wrapperCol={{span: 12}}>
                           {
                               getFieldDecorator('name',{
                                   initialValue:product.name
                               })(
                                   <Input placeholder='请输入商品名称'/>
                               )
                           }
                       </Item>
                       <Item label='商品描述' labelCol={{span: 2}} wrapperCol={{span: 12}}>
                           {
                               getFieldDecorator('desc',{
                                   initialValue:product.desc
                               })(
                                   <Input placeholder='请输入商品描述'/>
                               )
                           }
                       </Item>
                       <Item label='商品价格' {...formItemLayout}>
                           {
                               getFieldDecorator('price', {
                                   initialValue: product.price
                               })(
                                   <Input placeholder='请输入商品价格' addonAfter='元'/>
                               )
                           }
                       </Item>
                       <Item label='商品分类' {...formItemLayout}>
                           {
                               options.length>0?
                               getFieldDecorator('category1',{
                                   initialValue:initValue1
                               })(
                                   <Select style={{width: 200}} onChange={value => this.showSubCategory(value)}>
                                       {options}

                                   </Select>
                               ):null
                           }
                           &nbsp;&nbsp;&nbsp;
                           {
                               subOptions.length>0 ?
                                   getFieldDecorator('category2', {
                                       initialValue: initValue2
                                   })(
                                       <Select style={{width: 200}}>
                                           {subOptions}
                                       </Select>
                                   ) : null
                           }
                       </Item>
                       <Item label='商品图片' {...formItemLayout}>
                           <PicturesWall ref='imgs' imgs={product.imgs}/>
                       </Item>
                       <Item label='商品详情' labelCol={{span: 2}} wrapperCol={{span: 20}}>
                           <RichTextEditor ref='editor' detail={product.detail}/>
                       </Item>
                       <Button type='primary' onClick={this.submit}>提交</Button>
                   </Form>
               </h2>
            </div>
        )
    }
}
export default Form.create()(SaveUpdate)