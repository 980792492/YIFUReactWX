import React from 'react';
import {
  List,
  ListItem,
  Container,
} from 'amazeui-react';
import {
  Top,
  AuthMixin,
  Icon,
} from '../../../components';
import {
  Api,
} from '../../../utils';

const Area = React.createClass({
  mixins: [AuthMixin],

  getInitialState: function() {
    return {
      id: 0,
      province: '',
      data: [],
      currentCity: '',
      currentProvince: '',
    };
  },

  componentDidMount() {
    //todo 地区缓存json
    Api.get('User/Area', {id: this.state.id}, function(data) {
      console.log(data);
      this.setState({
        data: data,
        currentCity: this.user.City,
        currentProvince: this.user.Province,
      });
    }.bind(this));
  },

  handlerClick(id, name, e) {
    e.preventDefault();
    Api.get('User/Area', {id: id}, function(data) {
      this.setState({
        id: id,
        province: name,
        data: data
      });
    }.bind(this));
  },

  handlerSumbit(id, name, e) {
    e.preventDefault();
    let province = this.state.province;
    let city = name;
    if (province == this.state.currentProvince && city == this.state.currentCity)
      return false;

    this.setState({
      currentCity: city
    });
    Api.post('User/Edit', {
      token: this.token,
      province: province,
      city: city,
    }, function(data) {
      this.context.router.push('/user/account');
    }.bind(this));
  },
  
  renderProvince() {
    return this.state.data.map((item, key) => {
      return (
        <ListItem key={key} className="am-link-muted" onClick={this.handlerClick.bind(this, item.id, item.name)}>
          <Icon icon="right" className="am-fr" />
          <Icon icon="d" className="am-fr am-text-success" hide={this.state.currentProvince !== item.name} />
          {item.name}
        </ListItem>
      );
    });
  },

  renderCity() {
    return this.state.data.map((item, key) => {
      return (
        <ListItem key={key} className="am-link-muted" onClick={this.handlerSumbit.bind(this, item.id, item.name)}>
          <Icon icon="d" className="am-fr am-text-success" hide={this.state.currentCity !== item.name} />
          {item.name}
        </ListItem>
      );
    });
  },

  render() {
    return (
      <div>
        <Top title="修改地区" />
        <List border static className="am-margin-0">
          {this.state.id > 0 ? this.renderCity() : this.renderProvince()}
        </List>
      </div>
    );
  },
});

export default Area;
