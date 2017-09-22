import {
  Api,
  Cache,
} from '../utils'

const Users = {
  token: null,
  data: null,
  isLogin() {
    return !!Cache.get("token");
  },

  login(token) {
    Cache.set("token", token, 3600*24);
    this.token = token;
  },

  logout() {
    Cache.clear("token");
    Cache.clear("user");
    this.token = null;
    this.data = null;
  },

  getUserInfo(callback) {
    let token = this.getToken();
    if (!token) {
      return false;
    }
    Api.get('User/Info', {token: token}, data => {
      Cache.set("user", JSON.stringify(data), 3600*23);
      this.data = data;
      callback(data);
    });
  },

  getToken() {
    return Cache.get("token");
  },
  
  getData() {
    if (!this.data) {
      let data = Cache.get("user");
      if (data) {
        this.data = JSON.parse(data);
      }
    }
    return this.data;
  },

  getInvite() {
    return Cache.get("invite") > 0 ? Cache.get("invite") : 0;
  },

  setInvite(id) {
    if (id > 0) {
      Cache.set("invite", id, 3600);
    } else {
      Cache.clear("invite");
    }
  },

  setOpenid(openid) {
    return openid ? Cache.set("openid", openid, -1) : Cache.clear("openid");
  },

  getOpenid() {
    return Cache.get("openid") || undefined;
  },

  sexArr: {
    0: '',
    1: '男',
    2: '女',
    3: '保密',
  },

  capitalScaleArr: {
    0: '', 
    1: '散户1-10万', 
    2: '中户10-50万', 
    3: '大户50-200万', 
    4: '超大户200万以上',
  },
};

export default Users;
