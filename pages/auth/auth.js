import {request} from '../../request/index.js';
import {login} from '../../utils/asyncWx.js';

Page({
  async handleGetUserInfo(e){
    try{
      const {encryptedData,rawData,signature,iv} = e.detail;
      const {code} = await login();
  
      const loginParams = {encryptedData,rawData,signature,iv,code};
      const res = await request({url:'/users/wxlogin', data:loginParams,method:"POST"});
      console.log(!!res?.data.message);
      let {token} = !!res?.data.message 
      wx.setStorageSync("token", 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo');
      // wx.setStorageSync('token', token);
      wx.navigateBack({delta: 1});
    }catch(err){
      console.log(err);
    }
  }
})