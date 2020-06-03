import React from 'react';
import axios from 'axios'
import {Link} from 'react-router-dom'
import 'moment/locale/zh-cn';
import locale from 'antd/lib/date-picker/locale/zh_CN';

import 'antd/dist/antd.css';

import moment from 'moment'



import { DatePicker } from 'antd';


import { 

} from 'antd';

import { Table } from 'antd';



const columns = [
  { title: '出壳机', dataIndex: 'out_machine', key: 'out_machine' },
  { title: '孵化机', dataIndex: 'incubator', key: 'incubator' },
  { title: '胎龄', dataIndex: 'taining', key: 'taining' },
  { title: '标温', dataIndex: 'biaowen', key: 'taining' },
  { title: '侧风门', dataIndex: 'cefengmen', key: 'cefengmen' },
  { title: '上风门', dataIndex: 'shangfengmen', key: 'shangfengmen' },
  { title: '湿度', dataIndex: 'shidu', key: 'shidu' },
  { title: '调温', dataIndex: 'tiaowen', key: 'tiaowen' },
  { title: '照蛋', dataIndex: 'zhaodan', key: 'zhaodan' },
  { title: '转出', dataIndex: 'luopan', key: 'luopan' },
  { title: '出壳', dataIndex: 'other', key: 'other' },
  { title: '批次', dataIndex: 'pici', key: 'pici' },
];


class List extends React.Component {

    constructor(props){
        super(props);
        this.state={
            data:[],
        }
      }   

dateChange=(value)=>{
    const _this=this;
    const date_time = value.format('YYYY-MM-DD')
    console.log(date_time)
    axios({
        method: 'GET',
        url: "/hatchrecordsfree?date_time=" + date_time,
      })
      .then(function (response) {
        _this.setState({
            data:response.data.data,
        });
      })
      .catch(err=>{
        console.log(err);
      })
}     

componentDidMount(){
    const _this=this;
    axios({
        method: 'GET',
        url: "/hatchrecordsfree/",
      })
      .then(function (response) {
        _this.setState({
            data:response.data.data,
        });
      })
      .catch(err=>{
        console.log(err);
      })
}

render(){
    return ( 
        <div>
            <div>
            <DatePicker
                format="YYYY-MM-DD"
                locale={locale} 
                onChange={this.dateChange} 
                defaultValue={moment()}
            />
            </div>    
            <div>
                <Table
                    columns={columns}
                    dataSource={this.state.data}
                    pagination={{ pageSize: 30 }}
                />
            </div>      
        <div>
            {/* <div>
            <Link 
            to={{
                pathname:"/detail",
                query:{ status:'add'},
            }}
            >添加</Link>
            </div>
            <div>
            <Link 
            to={{
                pathname:"/detail",
                query:{ status:'updata'}
            }}
            >编辑</Link>
            </div> */}

            <div>
                <Link 
                to={{
                    pathname:"/recordlist",
                }}
                >查看记录列表</Link>
            </div>
        </div>
        </div>
    )
}
}

export default List

