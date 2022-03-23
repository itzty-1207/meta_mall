const app = getApp()
import {request} from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'

Page({
  data: {
    swiperList:[],
    catesList:[],
    floorList:[],
  },
  //onLoad发送异步请求
  onLoad() {
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   data:{},  // 请求参数
    //   header:{},  // 请求头对象
    //   method:'GET',  // 请求方法，默认GET请求
    //   dataType:'json',  // 请求返回值类型，默认json
    //   responseType:'text',  // 返回数据类型，默认text
    //   success:(res)=>{
    //     const {message} = res.data
    //     this.setData({swiperList:message})
    //   },
    //   fail:(error)=>{},
    //   complete:()=>{},  // 如同finally,成功或失败都会执行
    // })

    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },
  //获取轮播图数据
  async getSwiperList(){
    const res = await request({url: '/home/swiperdata'});
    this.setData({swiperList:res.data.message});
  },
  //获取分类导航数据
  async getCateList(){
    const res = await request({url: '/home/catitems'});
    this.setData({catesList:res.data.message});
  },
  //获取楼层数据
  async getFloorList(){
    const res = await request({url: '/home/floordata'});
    this.setData({floorList:res.data.message});
  }
})
