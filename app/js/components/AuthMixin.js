import React from 'react';
import {
	Users,
} from '../models';

const AuthMixin = {
	user: {},
	token: '',

	contextTypes: {
    router: React.PropTypes.object
  },
  
  componentWillMount() {
    if (!Users.isLogin()) {
      this.context.router.replace('/user/login');
    }
    this.user = Users.getData();
    this.token = Users.getToken();
  },
}

export default AuthMixin;