import React, {Component} from 'react'
import {
    Card,
    Table,
    Button,
    Icon
}from 'antd'
import {reqCategorys} from'../../api'

export default class Category extends Component {
    state={
        categorys:[]
    }
    getCategorys = async()=>{
        const result = await  reqCategorys('0');
        if(result.status===0){
            const categorys = result.data;
            this.setState({
                categorys
            })
        }
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
                        <a href="javascript:">修改分类</a>
                        &nbsp;&nbsp;&nbsp;
                        <a href="javascript:">查看子分类</a>
                    </span>
                )
            }
        }]
    }
  render() {
        const columns = this.columns;
        const {categorys} = this.state;
    return (
      <div>
        <Card>
            <span style={{fontSize:20}}>一级分类列表</span>
            <Button type='primary' style={{float:'right'}}>
                <Icon type='plus'/>
                添加分类
            </Button>
        </Card>
          <Table
              bordered
              rowKey='_id'
              columns={columns}
              dataSource={categorys}
              loading={categorys.length===0}
              pagination={{defaultPageSize: 10, showSizeChanger: true, showQuickJumper: true}}
          />
      </div>
    )
  }
}