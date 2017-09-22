import React from 'react';
import moment from 'moment';
import {
  Container,
  Article,
  Input,
  FormGroup,
  Button,
  Panel,
  Divider,
} from 'amazeui-react';
import { Users } from '../../models';
import {
  AuthMixin,
  Icon,
  BgColorMixin,
  Top,
  PayLink,
  Pagination,
} from '../../components';
import {
  Modal,
  Api,
} from '../../utils';

const PayLiveDetail = React.createClass({
  mixins: [AuthMixin, BgColorMixin],

  contextTypes: {
    router: React.PropTypes.object,
  },

  getDefaultProps() {
    return {
      pageSize : 20,
    };
  },

  getInitialState() {
    return {
      title: null,
      data: null,
      type: this.props.location.state && this.props.location.state.t ? this.props.location.state.t : 1,
      page: 1,
      isEnd: true,
    };
  },

  componentDidMount() {
    this.loadData();
  },

  loadData() {
    let params = {
      id: this.props.params.id,
      token: this.token,
      page: 1,
      num: this.props.pageSize,
    };

    Api.get('EncryptedView/Detail', params, resp => {
      if (resp.length === 0) {
        Modal.alert("数据错误，请与客服联系", () => {
          this.context.router.goBack();
        })
        return;
      }
      if (this.state.type == 1) {
        // 单条
        this.setState({
          title: resp[0].TeacherName + moment(resp[0].CreateDate).format('MM/DD hh:mm:ss') + "加密观点",
          data: resp[0].Content,
        });
      } else {
        // 包月
        this.setState({
          title: resp[0].TeacherName + "包月观点包",
          data: resp,
          isEnd: resp.length < this.props.pageSize, 
        });
      }

    });
  },

  handlerNext() {
    let params = {
      page: this.state.page + 1,
      num: this.props.pageSize,
      id : this.props.params.id,
      token: this.token,
    };

    let api = "EncryptedView/Detail";
    Api.get(api, params, resp => {
      if (resp.length > 0) {
        this.setState({
          page: params.page,
          data: this.state.data.concat(resp),
          isEnd: resp.length < this.props.pageSize,
        });
      } else {
        this.setState({
          isEnd: true, 
        });
      }
    });
  }, 

  renderSingle() {
    return(
      <div className="am-padding-bottom">
        <h4 className="am-text-center am-padding-top">{this.state.title}</h4>
        <Divider />
        <p dangerouslySetInnerHTML={{__html: this.state.data}}></p>
      </div>
    );
  },
  
  renderDetail() {
    return(
      <div className="am-padding-bottom">
        <h4 className="am-text-center am-padding-top">{this.state.title}</h4>
        {this.renderContent()}
      </div>
    );
  },

  renderContent() {
    return this.state.data.map((item, key) => {
      if (!item.Content) return;

      return (
        <div key={key} className="am-padding-bottom-xs yf-clear-both">
          <div className="am-text-xs yf-text-gray am-margin-bottom-xs">{item.TeacherName + moment(item.CreateDate).format('MM/DD HH:mm:ss')}加密观点</div>
          <Panel className="am-margin-bottom-xs">
            <div className="am-text-sm" dangerouslySetInnerHTML={{__html: item.Content}} />
          </Panel>
        </div>
      );
    });
  },
  
  render() {
    if (this.state.type == 1) {
      this.removeBgColor();
    }
    if (this.state.data) {
      return (
        <div>
          <Top title={this.state.title} />
          <Container>
            {this.state.type == 1 ? this.renderSingle() : this.renderDetail()}
          </Container>
          <Pagination onClick={this.handlerNext} status={!this.state.isEnd}>点击加载更多</Pagination>
        </div>
      );
    } else {
      return <div />;
    }
  },
});

export default PayLiveDetail;
