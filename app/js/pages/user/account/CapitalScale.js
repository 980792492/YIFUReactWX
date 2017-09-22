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


const CapitalScale = React.createClass({ 
	mixins: [AuthMixin],

    handlerSumbit(name, e){
    	var capital_scale=name;
    	  Api.post('User/Edit', {
    		token: this.token,
    		capital_scale:capital_scale
    	},function(date){
    		this.context.router.push('/user/account');
    	}.bind(this));
    },
	render() {
		return (
			<div>
			   <Top title="修改类型" />
			   <List border static className="am-margin-0">
			       <ListItem  className="am-link-muted"  onClick={this.handlerSumbit.bind(this,1)}>
                    <Icon icon="d" className="am-fr am-text-success"  hide={this.user.CapitalScale !== "1"}/> 
                     散户1-10万
                   </ListItem>  
		           <ListItem  className="am-link-muted"  onClick={this.handlerSumbit.bind(this,2)}>
		            <Icon icon="d" className="am-fr am-text-success"  hide={this.user.CapitalScale !== "2"}/> 
		            中户10-50万
		           </ListItem>  
		            <ListItem  className="am-link-muted"  onClick={this.handlerSumbit.bind(this,3)}>
		            <Icon icon="d" className="am-fr am-text-success"  hide={this.user.CapitalScale !== "3"}/> 
		            大户50-200万
		          </ListItem>  
		          <ListItem  className="am-link-muted"  onClick={this.handlerSumbit.bind(this,4)}>
		            <Icon icon="d" className="am-fr am-text-success"  hide={this.user.CapitalScale !== "4"}/> 
		            超大户200万以上
		          </ListItem>  
			   </List>
			</div>
		);
	},

});

export default CapitalScale;