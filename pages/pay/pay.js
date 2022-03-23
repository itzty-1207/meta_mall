/**
 1.微信支付条件
  a.企业账号
  b.企业账号的小程序后台给开发者添加上白名单，一个appid可绑定多个开发者，这些开发者共享此id的开发权限
 2.支付条件
  a.判断缓存中有无token,没有跳转授权页面获取token
 */
import {requestPayment,showToast} from '../../utils/asyncWx.js';
import {request} from '../../request/index.js';

Page({
  data: {
    address:{},
    cart:[],
    totalPrice:0,
    totalNum:0,
  },
  onShow(){
    const address = wx.getStorageSync('address');
    //获取缓存中购物车数据
    let cart = wx.getStorageSync('cart') || [];
    cart = cart.filter(item => item.checked);

    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach((item) => {
      totalPrice+=item.num*item.goods_price;
      totalNum+=item.num;
    })
    this.setData({
      cart,
      address,
      totalPrice,
      totalNum,
    });
  },
  async handleOrderPay(){
    try{
      const token = wx.getStorageSync('token');
      if(!token) return wx.navigateTo({url: '/pages/auth/auth'});
      // const orderHeader = {Authorization:token};
  
      const {cart,address,totalPrice} = this.data;
      const order_price = totalPrice;
      const consignee_addr = address.provinceName+address.cityName+address.countyName+address.detailInfo;
      let goods=[]
      cart.forEach(item => goods.push({
        goods_id:item.goods_id,
        goods_num:item.num,
        goods_price:item.goods_price,
      }))
      const orderParams = {order_price,consignee_addr,goods} 
      const res = await request({url:"/my/orders/create",method:"POST",data:orderParams});
  
      //测试号目前token无效，导致结算创建订单失败
      // const {order_number} = res?.data?.message;  
      let order_number = 'HMDD20190809000000001058';
      
      let pay = await request({url:"/my/orders/req_unifiedorder",method:"POST",data:{order_number}});
      pay = {
        nonceStr: 'U6tYjNdYvm3ReKgI',
        package: 'prepay_id=wx09182118356902a15c8b8d071931343000',
        paySign: 'C514E29387794F84004C983AFFF4707F',
        signType:'MDS',
        timeStamp: '1565346079',
      }
      await requestPayment(pay);
      const payResult = await request({url:'/my/orders/chkOrder',data:{order_number}});
      await showToast({title:'支付成功！'});

      let newCart = wx.getStorageSync('cart');
      newCart=newCart.filter(item => !item.checked);
      wx.setStorageSync('cart', newCart)

      wx.navigateTo({url: '/pages/order/order'});
    }catch(err){
      await showToast({title:'支付失败！'})
      console.log(err);
    }
  }
})