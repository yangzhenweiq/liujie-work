import React from 'react';
import axios from 'axios'
import './index.css';
import 'moment/locale/zh-cn';
import locale from 'antd/lib/date-picker/locale/zh_CN';

import 'antd/dist/antd.css';

import moment from 'moment'

import { Form, Input, Button, Select, DatePicker, Row, Col, message,} from 'antd';
import { PlusCircleOutlined ,MinusCircleOutlined} from '@ant-design/icons';

const { Option } = Select;

const { TextArea } = Input;

const rules = [{ required: true }];

class Hatchform extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      value:1,
    };
  }
  // formRef = React.createRef();()
  formRef = React.createRef();;
  componentDidMount(){
    if(this.props.location.query){
      if(this.props.location.query.status==="updata"){
        this.getDetailData();
    }
    }else{
      this.props.history.push('/list')
    }
    
  }
  getDetailData=() =>{
    axios({
      method: 'GET',
      url: `/hatchrecords/${this.props.location.query.id}/detail`,
    })
    .then(res=>{
      console.log(res.data);
      res.data.data.end_time=moment(res.data.data.end_time, 'YYYY-MM-DD')
      res.data.data.create_time=moment(res.data.data.create_time, 'YYYY-MM-DD')
      res.data.data.begin_time=moment(res.data.data.begin_time, 'YYYY-MM-DD')
      this.formRef.current.setFieldsValue({
        ...res.data.data
      });
    })
    .catch(err=>{
      console.log(err);
      
    })
  }
  // onValuesChange=(value,values)=>{
  //   console.log(this.formRef.current.getFieldsValue().batch);
  //   console.log(this.formRef.current.getFieldsValue().fuhuashilu[0].maodanshu);
    
  //   this.formRef.current.setFieldsValue({
  //     batch:this.formRef.current.getFieldsValue().batch
  //   })
  // }
      
  onFinish = values => {
      if(this.props.location.query.status==="updata"){

        axios({
          method: 'PUT',
          url: `/hatchrecords/${this.props.location.query.id}/update`,
          data: {
            ...values
          },
        })
        .then(res=>{
          console.log(res);
          message.success("修改成功")
          this.props.history.push('/recordlist')
        })
        .catch(err=>{
          console.log(err);
          
        })
      }
      else{
        axios({
          method: 'POST',
          url: "/hatchrecords/create/",
          data: {
            ...values
          },
        })
        .then(res=>{
          console.log(res);
          message.success("新增成功")
          this.props.history.push('/recordlist')     
        })
        .catch(err=>{
          console.log(err);         
        })
      }  
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
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 8 },
    };
    
    return (
      <div>
      <Form 
      {...layout} 
      ref={this.formRef} 
      name="control-ref" 
      onFinish={this.onFinish} 
      onValuesChange={this.onValuesChange}
      >
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
        <Form.Item name="hatch_pattern" initialValue={this.state.value} label="孵化模式" rules={[{ required: true }]}>
          <Select
            placeholder="请选择孵化模式"
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
                      fieldKey={[field.fieldKey, "huojingdanshu"]}
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
                    //   initialValue={this.formRef.current.getFieldsValue().fuhuashilu[index].huojingdanshu*1+this.formRef.current.getFieldsValue().fuhuashilu[index].wujingdanshu*1}
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

export default Hatchform

