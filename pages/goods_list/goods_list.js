import {request} from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime.js'

Page({
  data: {
    tabs:[
      {id:0,value:'综合',isActive:true},
      {id:1,value:'销量',isActive:false},
      {id:2,value:'价格',isActive:false},
    ],
    goodsList:[],
  },
  //查询接口参数
  queryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10,
  },
  totalPages:1,
  onLoad: function (options) {
    this.queryParams.cid = options.cid || '';
    this.queryParams.query = options.query || '';
    this.getGoodsList();
  },
  //获取商品列表数据
  async getGoodsList(){
    const res = await request({url:"/goods/search",data: this.queryParams});
    const total = res.data.message.total;
    this.totalPages = Math.ceil(total/this.queryParams.pagesize);
    this.setData({
      //新请求的数据不能做替换，而是拼接否则上一页的数据就没了
      // goodsList: res.data.message.goods
      goodsList: [...this.data.goodsList,...res.data.message.goods]
    })
    //得到数据后关闭下拉刷新窗口,避免拿到数据后还在刷新
    wx.stopPullDownRefresh();
  },
  //标题点击事件，从子组件传递过来
  handleTabsItemChange(e){
    const {index} = e.detail;
    let {tabs} = this.data;
    tabs.forEach((item,idx) => {
      idx === index ? item.isActive = true : item.isActive = false;
      this.setData({tabs})
    })
  },
  //放置所有页面最下面，触底时触发，即上拉加载数据
  onReachBottom(){
    if(this.queryParams.pagenum>=this.totalPages){
      wx.showToast({title: '我也是有底线的~'})
    }else{
      this.queryParams.pagenum++;
      this.getGoodsList();
    }
  },
  //下拉刷新事件
  onPullDownRefresh(){
    this.setData({goodsList:[]});
    this.queryParams.pagenum=1;
    this.getGoodsList();
  }
})