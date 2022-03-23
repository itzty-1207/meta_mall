import {request} from '../../request/index.js';

Page({
  data: {
    orders:[],
    tabs:[
      {id:0,value:'全部订单',isActive:true},
      {id:0,value:'待付款',isActive:false},
      {id:0,value:'待收货',isActive:false},
      {id:0,value:'退款/退货',isActive:false},
    ],
  },
  onShow(){
    const token = wx.getStorageSync('token');
    if(!token) return wx.navigateTo({url: '/pages/auth/auth'});

    //获取当前小程序页的页面栈数组，最大长度为10,数组组索引最大的页面即当前页面
    let pages = getCurrentPages();
    let currentPage = pages[pages.length-1]
    const {type} = currentPage.options;
    this.changeTitleByIndex(type-1);
    this.getOrders(type);
  },
  async getOrders(type){
    const res = await request({url:'/my/orders/all',data:{type}});
    this.setData({
      orders:res.data.message.orders.map((item)=>({
        ...item,
        create_time_cn:(new Date(item.create_time*1000).toLocaleString()),
      }))
    });
  },
  changeTitleByIndex(index){
    let {tabs} = this.data;
    tabs.forEach((item,idx) => {
      idx === index ? item.isActive = true : item.isActive = false;
      this.setData({tabs})
    })
  },
  handleTabsItemChange(e){
    const {index} = e.detail;
    this.changeTitleByIndex(index);
    this.getOrders(index+1);
  },
})