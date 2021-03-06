import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios'

import RouterConfig from './Router_index.js';

import './index.css';
// import App from './App';
import * as serviceWorker from './serviceWorker';

import 'moment/locale/zh-cn';
import locale from 'antd/lib/date-picker/locale/zh_CN';

import 'antd/dist/antd.css';

import moment from 'moment'

import { Form, Input, Button, Select, DatePicker, Row, Col,} from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { FormInstance } from 'antd/lib/form';

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};

const titleLayout = {
  labelCol: {
    xs: { span: 3 },
    sm: { span: 3 }
  },
  wrapperCol: {
    xs: { span: 19 },
    sm: { span: 19 }
  }
};

const { TextArea } = Input;

const rules = [{ required: true }];

class Demo extends React.Component {
  
  // formRef = React.createRef();()
  constructor(props) {
    super(props);
    this.state = {
      value:1,
    };
  }
  formRef = React.createRef();;
  componentDidMount(){
    
  }
  getDetailData=() =>{
    axios({
      method: 'GET',
      url: "/hatchrecords/1/detail",
    })
    .then(res=>{
      console.log(res.data);
      res.data.end_time=moment(res.data.end_time, 'YYYY-MM-DD')
      res.data.create_time=moment(res.data.create_time, 'YYYY-MM-DD')
      res.data.begin_time=moment(res.data.begin_time, 'YYYY-MM-DD')
      this.formRef.current.setFieldsValue({
        ...res.data
      });
    })
    .catch(err=>{
      console.log(err);
      
    })
  }
  onFinish = values => {
    axios({
      method: 'POST',
      url: "/hatchrecords/create/",
      data: {
        ...values
      },
    })
    .then(res=>{
      console.log(res);
      
    })
    .catch(err=>{
      console.log(err);
      
    })
    
    
  };

  onReset = () => {
    this.formRef.current.resetFields();
  };


  renderButton = () => {
      return (
        <Row>
          <Col offset={7}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button htmlType="button" onClick={this.onReset}>
              Reset
            </Button>
          </Col>
        </Row>
      );
    }    

    onfuhuamoshiChange=(value)=>{
      console.log(value);
      
    }
  dateChange=(value)=>{
    let gouwen = moment(value).valueOf()
    let chumiaoshijianchuo = gouwen + 21 * 3600 * 24 * 1000;
    
    let chumiao= moment(chumiaoshijianchuo).format('YYYY-MM-DD')
    // console.log(chumiao);
    this.formRef.current.setFieldsValue({
      end_time:moment(chumiao, 'YYYY-MM-DD'),
    });
  }

  render() {
    const {
      value
    }=this.state;
    return (
      <div>
      <Form {...layout} ref={this.formRef} name="control-ref" onFinish={this.onFinish} >
        <Form.Item label="来蛋时间" name="create_time" initialValue={moment()}>
        <DatePicker
          format="YYYY-MM-DD"
          locale={locale}  
        />
        </Form.Item>
        <Form.Item name="batch" label="批次" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="customer" label="来蛋客户" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="incubator" label="孵化机" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="hatch_pattern" initialValue={value} label="孵化模式" rules={[{ required: true }]}>
          <Select
            placeholder="请选择孵化模式"
            onChange={this.onfuhuamoshiChange}
            allowClear
          > 
            <Option value={1}>冬温大蛋</Option>
            <Option value={2}>冬温小蛋</Option>
            <Option value={3}>夏温大蛋</Option>
            <Option value={4}>夏温小蛋</Option>
          </Select>
        </Form.Item>
        <Form.Item name="out_machine" label="出壳机">
          <Input />
        </Form.Item>
        <Form.Item label="够温时间" name="begin_time">
          <DatePicker
            format="YYYY-MM-DD"
            locale={locale} 
            onChange={this.dateChange} 
          />
        </Form.Item>  
        <Form.Item label="出苗时间" name="end_time">
          <DatePicker
            format="YYYY-MM-DD"
            locale={locale}   
          />
        </Form.Item>
        <Form.Item name="beizhu" label="备注">
          <TextArea />
        </Form.Item>
        <Form.List name="fuhuashilu" >
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map((field, index) => (
                <div key={index} style={{padding:"10px",border:'1px solid black',margin:'10px 300px'}}>
                    <Form.Item
                      label="品种"
                      name={[field.name,"pinzhong"]}
                      fieldKey={[field.fieldKey, "pinzhong"]}
                      rules={rules}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="件数"
                      name={[field.name, "jianshu"]}
                      fieldKey={[field.fieldKey, "jianshu"]}
                      rules={rules}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="装机蛋数"
                      name={[field.name, "zhuangjidanshu"]}
                      fieldKey={[field.fieldKey, "zhuangjidanshu"]}
                      rules={rules}
                    >
                      <Input />
                    </Form.Item>
                  
                    <Form.Item
                      label="次破蛋数"
                      name={[field.name, "cipodanshu"]}
                      fieldKey={[field.fieldKey, "cipodanshu"]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="无精蛋数"
                      name={[field.name, "wujingdanshu"]}
                      fieldKey={[field.fieldKey, "wujingdanshu"]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="活精蛋数"
                      name={[field.name, "huojingdanshu"]}
                      fieldKey={[field.fieldKey, "wujingdanshu"]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="受精率"
                      name={[field.name, "shoujinglv"]}
                      fieldKey={[field.fieldKey, "shoujinglv"]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="毛蛋数"
                      name={[field.name, "maodanshu"]}
                      fieldKey={[field.fieldKey, "maodanshu"]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="公苗"
                      name={[field.name, "gongmiao"]}
                      fieldKey={[field.fieldKey, "gongmiao"]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="母苗"
                      name={[field.name, "mumiao"]}
                      fieldKey={[field.fieldKey, "mumiao"]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="混合苗"
                      name={[field.name, "hunhemiao"]}
                      fieldKey={[field.fieldKey, "hunhemiao"]}>
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="合计"
                      name={[field.name, "heji"]}
                      fieldKey={[field.fieldKey, "heji"]}
                      >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="受精蛋出苗率"
                      name={[field.name, "shuojingdanchumiaolv"]}
                      fieldKey={[field.fieldKey, "shuojingdanchumiaolv"]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="种蛋出苗率"
                      name={[field.name, "zhongdanchumiaolv"]}
                      fieldKey={[field.fieldKey, "zhongdanchumiaolv"]}
                    >
                      <Input />
                    </Form.Item>

                    <Row >
                      <Col >
                        <Button 
                          onClick={() => {
                            remove(field.name);
                          }}
                        >
                          <MinusCircleOutlined />
                             删除
                        </Button>
                      </Col>
                    </Row>
                </div>    
                ))}
                <Form.Item>
                  <Row >
                    <Col >
                      <Button offset={7} span={3}
                        onClick={() => {
                          add();
                        }}
                      >
                        <PlusCircleOutlined />
                          品种数量分类
                      </Button>
                    </Col>
                </Row>
                </Form.Item>
              </div>
            );
          }}
        </Form.List>
        <div>
          { this.renderButton()}
        </div>
      </Form>
      </div>

    );
  }
}

// ReactDOM.render(<Demo />, document.getElementById('root'),);

const domContainer = document.querySelector('#root');
ReactDOM.render(<RouterConfig />, domContainer);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();



