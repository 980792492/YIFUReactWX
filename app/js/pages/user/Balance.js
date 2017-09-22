import React from 'react';
import {
  Container,
  Button,
} from 'amazeui-react';
import {
  Top,
  AuthMixin,
} from '../../components';
import {Users} from '../../models';

const Balance = React.createClass({
  mixins: [AuthMixin],

  componentDidMount: function() {
    Users.getUserInfo(resp =>  {
      this.setState({
        gcoins: resp.CurrentGcoinsCount,
      });
    });
  },

  getInitialState: function() {
    return {
      gcoins: 0
    };
  },

  render: function() {
    return (
      <div>
        <Top title="账户余额" link="#/user" />
        <Container className="am-text-center am-margin-top-lg">
          <img src="i/gold.jpg" width="100" height="100" />
          <p>我的账户余额</p>
          <p><strong className="am-text-danger am-text-xxxl">{this.state.gcoins}<span className="am-text-default">G币</span></strong></p>
          <Button block amStyle="danger" href="#/user/pay">充值</Button>
        </Container>
      </div>
    );
  }

});

export default Balance;