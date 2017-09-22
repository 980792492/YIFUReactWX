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
 
const Sex = React.createClass({
   mixins: [AuthMixin], 
 
handlerSumbit(name, e) {  
  var sex=name;  
    Api.post('User/Edit', {
      token: this.token, 
      sex:sex
    }, function(data) {
      this.context.router.push('/user/account');

    }.bind(this));
  },  
	  render() {
    return (
      <div>
        <Top title="修改性别" />
        <List border static className="am-margin-0">
          <ListItem  className="am-link-muted"  onClick={this.handlerSumbit.bind(this,1)}>
            <Icon icon="d" className="am-fr am-text-success"  hide={this.user.Sex !== "1"}  /> 
           男
            </ListItem>  
           <ListItem  className="am-link-muted"  onClick={this.handlerSumbit.bind(this,2)}>
            <Icon icon="d" className="am-fr am-text-success"  hide={this.user.Sex !== "2"}/> 
           女
          </ListItem>  
            <ListItem  className="am-link-muted"  onClick={this.handlerSumbit.bind(this,3)}>
            <Icon icon="d" className="am-fr am-text-success"  hide={this.user.Sex !== "3"}/> 
           保密
          </ListItem>  
          </List>
      </div>
    );
  },

}); 

export default Sex;