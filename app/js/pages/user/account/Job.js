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


const Job = React.createClass({ 
  mixins: [AuthMixin], 

  handlerSumbit(name, e){
    e.preventDefault();
    var job=name;
      Api.post('User/Edit', {
      token: this.token,
      job:job
    }, () => {
      this.context.router.push('/user/account');
    });
  },

  render() {
    return (
      <div>
          <Top title="修改职业" />
          <List border static className="am-margin-0">
            <ListItem  className="am-link-muted"  onClick={this.handlerSumbit.bind(this,'上班族')}>
              <Icon icon="d" className="am-fr am-text-success"  hide={this.user.Job !== "上班族"}/> 
                上班族
              </ListItem>  
            <ListItem  className="am-link-muted"  onClick={this.handlerSumbit.bind(this,'退休人员')}>
              <Icon icon="d" className="am-fr am-text-success"  hide={this.user.Job !== "退休人员"}/> 
                退休人员
            </ListItem>  
            <ListItem  className="am-link-muted"  onClick={this.handlerSumbit.bind(this,'学生')}>
              <Icon icon="d" className="am-fr am-text-success"  hide={this.user.Job !== "学生"}/> 
                学生
            </ListItem>  
            <ListItem  className="am-link-muted"  onClick={this.handlerSumbit.bind(this,'自由职业')}>
              <Icon icon="d" className="am-fr am-text-success"  hide={this.user.Job !== "自由职业"}/> 
              自由职业
            </ListItem>  
            <ListItem  className="am-link-muted"  onClick={this.handlerSumbit.bind(this,'专业炒股')}>
              <Icon icon="d" className="am-fr am-text-success"  hide={this.user.Job !== "专业炒股"}/> 
              专业炒股
            </ListItem>  
         </List>
      </div>
    );
  },

});
export default Job;