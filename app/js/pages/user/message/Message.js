import React from 'react';
import $ from 'jquery';
import {
  Nav,
  NavItem,
  Panel,
  PanelGroup,
  Container,
} from 'amazeui-react';
import {
  AuthMixin,
  BgColorMixin,
  Top,
  Icon,
} from '../../../components';
import {
  Api,
} from '../../../utils';

const Message = React.createClass({
  contextTypes: {
    router: React.PropTypes.object,
  },

  mixins: [AuthMixin, BgColorMixin],

  componentDidMount: function() {
    //获取系统消息
    Api.get('User/Message', {
    	token: this.token,
    	type: this.props.params.type,
    }, data => {
    	this.setState({
    		data: data,
	    });
    });
  },

  componentWillReceiveProps: function(nextProps) {
  	//获取系统消息
    Api.get('User/Message', {
    	token: this.token,
    	type: nextProps.params.type,
    }, data => {
    	this.setState({
    		data: data,
	    });
    });
  },

  getInitialState() {
    return {
      data: []
    };
  },

  handlerClick(id, e) {
  	this.context.router.push('user/message/detail/' + id);
  },

  handlerTabs(tab, e) {
    this.context.router.replace(tab);
  },

  renderList() {
  	return this.state.data.map((item, key) => {
	  	return (
	  		<Panel key={key} onClick={this.handlerClick.bind(this, item.Id)}>
		  		<dl className="am-margin-0">
						<dt className=" am-text-md">
							<Icon icon="ky" className="am-text-danger am-margin-right-xs" hide={item.IsSee == 1 || this.props.params.type == 3} />
							{item.Title}
						</dt>
						<dd className="am-text-sm am-text-truncate">{item.Body}</dd>
						<dd className="am-text-xs am-padding-top-xs am-padding-bottom-xs">{item.CreateDate}</dd>
					</dl>
				</Panel>
	  	);
  	});
  },

  render() {
    return (
      <div>
        <Top title="消息中心" link="#/user" />
        <Nav tabs justify className="am-margin-0 yf-tabs am-text-sm">
          <NavItem active={this.props.params.type == 1} linkComponent="a" onClick={this.handlerTabs.bind(this, "user/message/list/1")}>系统消息</NavItem>
          <NavItem active={this.props.params.type == 2} linkComponent="a" onClick={this.handlerTabs.bind(this, "user/message/list/2")}>收件箱</NavItem>
          <NavItem active={this.props.params.type == 3} linkComponent="a" onClick={this.handlerTabs.bind(this, "user/message/list/3")}>发件箱</NavItem>
          <NavItem linkComponent="a" onClick={this.handlerTabs.bind(this, "user/message/send")}>发站内信</NavItem>
			  </Nav>
			  <Container>
				  <PanelGroup className="am-margin-top-sm">
				  	{this.renderList()}
				  </PanelGroup>
			  </Container>
      </div>
    );
  },
});

export default Message;
