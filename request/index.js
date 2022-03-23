//同时发送多个异步代码
let ajaxTimes = 0;

const request = (params) => {

  //判断接口是否需要token
  let header={...params.header};
  if(params.url.includes('/my/')){
    header["Authorization"] = wx.getStorageSync('token');
  }

  ajaxTimes++;
  //显示loading效果
  wx.showLoading({
    title: '加载中啦亲~~',
    mask: true,
  })
  const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";
  return new Promise((resolve,reject) => {
    wx.request({
      ...params,
      header:header,
      url:baseUrl + params.url,
      success:(res) => {
        resolve(res)
      },
      fail:(err) => {
        reject(err)
      },
      complete:()=>{
        ajaxTimes--;
        !ajaxTimes && wx.hideLoading();
      }
    })
  })
}

export {request}