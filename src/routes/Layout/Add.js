import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Tree,
  message,
  Popconfirm,
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import CodeArea from '../../components/CodeArea';
import styles from './add.less';

const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};

const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 10, offset: 3 },
  },
};

const formItemLayoutFull = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 21 },
    md: { span: 21 },
  },
};

@connect(({ layout, scaffold, loading }) => ({
  layout,
  scaffold,
  submitting: loading.effects['layout/add'],
}))
@Form.create()
export default class Add extends PureComponent {
  componentWillReceiveProps(nextProps) {
    if ('match' in nextProps) {
      const id = nextProps.match.params.id;
      if(this.props.match.params.id != id){
        this.props.dispatch({
          type: 'layout/info',
          payload: {
            id: id,
          },
        });
      }
    }
  }
  componentDidMount(){
    let id = this.props.match.params.id;
    this.props.dispatch({
      type: 'layout/info',
      payload: {
        id: id,
      },
    });
    this.props.dispatch({
      type: 'scaffold/list',
      payload: {},
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let id = this.props.layout.info.id;
        let payload = values;
        if(id){
          payload = {
            ...payload,
            id,
          };
        }
        this.props.dispatch({
          type: 'layout/add',
          payload: payload,
          callback: () => {
            message.success('保存成功');

            this.props.dispatch(routerRedux.push('/layout/list'));
          }
        });
      }
    });
  }
  cancel = ()=>{
    this.props.dispatch(routerRedux.push('/layout/list'));
  }
  render() {
    const { layout: {info}, submitting } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const scaffoldData = this.props.scaffold.data;

    return (
      <PageHeaderLayout title="APP编辑" content="用来编辑或创建APP">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem {...formItemLayout} label="脚手架：">
              {getFieldDecorator('scaffold_id', {
                initialValue: info.scaffold_id,
                rules: [{
                  required: true, message: '脚手架',
                }],
              })(
                <Select>
                  {
                    scaffoldData.list.map(item => {
                      return (
                        <Option key={item.id} value={item.id}>{item.label}</Option>
                      )
                    })
                  }
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="名称：">
              {getFieldDecorator('label', {
                initialValue: info.label,
                rules: [{
                  required: true, message: '名称',
                }],
              })(
                <Input placeholder="请输入名称" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="简介：">
              {getFieldDecorator('desc', {
                initialValue: info.desc,
              })(
                <Input placeholder="请输入简介" />
              )}
            </FormItem>
            <FormItem {...formItemLayoutFull} label="模版：">
              {getFieldDecorator('template', {
                initialValue: info.template,
                rules: [{
                  required: true, message: '模版',
                }],
              })(
                <CodeArea placeholder="请输入模版" />
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                保存
              </Button>
              <Popconfirm title="修改不会保存，确认取消吗？" onConfirm={this.cancel}>
                <Button type="danger"  style={{marginLeft: 16}}>
                  取消
                </Button>
              </Popconfirm>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
