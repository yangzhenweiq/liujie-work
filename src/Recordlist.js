import React from 'react';
import axios from 'axios'
import {Link} from 'react-router-dom'
import 'moment/locale/zh-cn';

import 'antd/dist/antd.css';

// import { DatePicker } from 'antd';

import { Table, Button} from 'antd';


const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '批次', dataIndex: 'batch', key: 'batch' },
  { title: '客户名称', dataIndex: 'customer', key: 'customer' },
  { title: '孵化机', dataIndex: 'incubator', key: 'incubator' },
  { title: '够温时间', dataIndex: 'begin_time', key: 'begin_time'},
  { title: '备注', dataIndex: 'beizhu', key: 'beizhu'},
  {
    title: '操作',
    dataIndex: '',
    key: 'x',
    render: (r,item) => <div>
                <Link 
                    to={{
                    pathname:"/detail",
                    query:{ status:'updata',id:item.id}
                    }}
                >编辑</Link>
            </div>,
  },
];


class List extends React.Component {

    constructor(props){
        super(props);
        this.state={
            data:[],
        }
      }       

componentDidMount(){
    const _this=this;
    axios({
        method: 'GET',
        url: "/hatchrecords/",
      })
      .then(function (response) {
        _this.setState({
            data:response.data,
        });
      })
      .catch(err=>{
        console.log(err);
      })
}

render(){
    return ( 
        <div>
            <Button>
            <Link 
            to={{
                pathname:"/detail",
                query:{ status:'add'},
            }}
            >添加</Link>
            </Button>
            <div></div>
            <div>
                <Table
                    columns={columns}
                    dataSource={this.state.data}
                    pagination={{ pageSize: 30 }}
                />
            </div>      
        </div>
    )
}
}

export default List

