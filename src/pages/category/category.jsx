import React, {Component} from 'react'
import PropTypes  from 'prop-types'
import {
    Card,
    Table,
    Button,
    Icon,
    Form,
    Input,
    Select,
    Modal,
    message
}from 'antd'
import {reqCategorys,reqAddCategory,reqUpdateCategory} from'../../api'
const Item = Form.Item
const Option = Select.Option

export default class Category extends Component {
    state={
        parentId:'0',
        parentName:'',
        categorys:[],
        subCategorys:[],
        isShowAdd: false,
        isShowUpdate: false
    }
    getCategorys = async(pId)=>{
        const parentId=pId || this.state.parentId;
        const result = await  reqCategorys(parentId);
        if(result.status===0){
            const categorys = result.data;
            if(parentId==='0'){
                this.setState({
                    categorys
                })
            }else {
                this.setState({
                    subCategorys:categorys
                })
            }

        }
    }
    addCategory= async()=>{
        this.setState({
            isShowAdd: false
        });
        const {parentId, categoryName} = this.form.getFieldsValue();
        this.form.resetFields();
        const result = await reqAddCategory(parentId, categoryName);
        if(result.status===0){
            message.success('添加成功');
            if(parentId===this.state.parentId || parentId==='0'){
                this.getCategorys(parentId);
            }
        }
    }

    showUpdate=(category)=>{
        this.category=category;
        this.setState({
            isShowUpdate: true
        })
    }
    updateCategory = async()=>{
        this.setState({
            isShowUpdate: false
        })
        const categoryId= this.category._id;
        const categoryName = this.form.getFieldValue('categoryName')
        this.form.resetFields();
        const result = await reqUpdateCategory({categoryId,categoryName});
        if(result.status===0){
            message.success('更新成功');
            this.getCategorys();
        }
    }
    showSubCategorys = (category) =>{
        this.setState({
            parentId: category._id,
            parentName: category.name
        },()=>{
            this.getCategorys()
        })
    }
    showCategorys =()=>{
        this.setState({
            parentId:'0',
            parentName:'',
            subCategorys:[]
        })
    }
    componentDidMount(){
        this.getCategorys();
    }
    componentWillMount(){
        this.columns=[{
            title:'分类名称',
            dataIndex:'name',
        },{
            title:'操作',
            width:300,
            render:(category)=>{
                return(
                    <span>
                        <a href="javascript:" onClick={()=>this.showUpdate(category)}>修改分类</a>
                        &nbsp;&nbsp;&nbsp;
                        <a href="javascript:" onClick={()=>this.showSubCategorys(category)}>查看子分类</a>
                    </span>
                )
            }
        }]
    }
  render() {
        const columns = this.columns;
        const {categorys,subCategorys,parentId,parentName,isShowAdd,isShowUpdate} = this.state;
        const category = this.category ||{};
    return (
      <div>
        <Card>
            {
                parentId==='0'?<span style={{fontSize:20}}>一级分类列表</span>
                    :(
                        <span>
                            <a href="javascript:" onClick={this.showCategorys}>一级分类2</a>
                            &nbsp;&nbsp;&nbsp;
                            <Icon type="arrow-right" />
                            &nbsp;&nbsp;&nbsp;
                            <span>{parentName}</span>
                        </span>
                )
            }

            <Button type='primary'
                    style={{float:'right'}}
                    onClick={()=>this.setState({isShowAdd:true})}>
                <Icon type='plus'/>
                添加分类
            </Button>
        </Card>
          <Table
              bordered
              rowKey='_id'
              columns={columns}
              dataSource={parentId==='0'?categorys:subCategorys}
              loading={categorys.length===0}
              pagination={{defaultPageSize: 10, showSizeChanger: true, showQuickJumper: true}}
          />
          <Modal
              title="更新分类"
              visible={isShowUpdate}
              onOk={this.updateCategory}
              onCancel={()=>this.setState({isShowUpdate:false})}>
              <UpdateForm categoryName={category.name} setForm={(form)=>this.form =form}/>
          </Modal>
          <Modal
              title="添加分类"
              visible={isShowAdd}
              onOk={this.addCategory}
              onCancel={()=>this.setState({isShowAdd:false})}>
              <AddForm categorys={categorys} parentId={parentId} setForm={(form)=>this.form =form}/>
          </Modal>
      </div>
    )
  }
}
class UpdateForm extends Component{
    static propTypes = {
        categoryName: PropTypes.string,
        setForm:PropTypes.func.isRequired
    }
    componentWillMount(){
        this.props.setForm(this.props.form);
    }
    render(){
        const {getFieldDecorator}=this.props.form
        const {categoryName}=this.props
        return(
            <Form>
                <Item>
                    {
                        getFieldDecorator('categoryName',{
                            initialValue:categoryName
                        })(
                            <Input placeholder='请输入分类名称'/>
                        )
                    }
                </Item>
            </Form>
        )
    }
}
UpdateForm=Form.create()(UpdateForm);
class AddForm extends Component{
    static propTypes={
        categorys:PropTypes.array.isRequired,
        setForm: PropTypes.func.isRequired,
        parentId:PropTypes.string.isRequired
    }
    componentWillMount(){
        this.props.setForm(this.props.form)
    }
    render(){
        const {getFieldDecorator} = this.props.form;
        const {categorys,parentId}=this.props;
        return(
            <Form>
                <Item lable='所属分类'>
                    {
                        getFieldDecorator('parentId',{
                            initialValue:parentId
                        })(
                            <Select>
                                <Option key='0' value='0'>一级分类</Option>
                                {
                                    categorys.map(c=><Option key={c._id} value={c._id}>{c.name}</Option>)
                                }
                            </Select>
                        )
                    }
                </Item>
                <Item lable='分类名称'>
                    {
                        getFieldDecorator('categoryName',{
                            initialValue:''
                        })(
                            <Input placeholder='请输入分类名称'/>
                        )
                    }
                </Item>
            </Form>
        )
    }
}
AddForm = Form.create()(AddForm);