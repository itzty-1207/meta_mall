import {request} from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime.js'

Page({
  data: {
    leftMenuList:[],
    rightGoodsList:[],
    currentIndex:0,
    scrollTop:0,
  },
  //接口返回数据
  Cates:[],
  onLoad: function (options) {
    //优化数据，使用缓存
    //判断本地存储有无旧数据，无旧数据直接发请求，有旧数据且没过期使用本地存储中旧数据。
    //浏览器本地存储：localStorage.setItem("key","value")与localStorage.getItem("key")，无论存储什么类型都先调用toString()将数据变成字符串
    //小程序本地存储：wx.setStorageSync('key', data)与wxwx.getStorageSync('key')，存的时候不做类型转换

    //获取本地存储中的数据
    const Cates = wx.getStorageSync('cates');
    if(!Cates){
      this.getCates();
    } else {
      if(Date.now()-Cates.time>1000*10){
        this.getCates();
      } else {
        this.Cates=Cates.data;
        let leftMenuList = this.Cates.map(item => item.cat_name);
        let rightGoodsList = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightGoodsList,
        })
      }
    }
  },
  //获取分类数据
  async getCates(){
    // request({url:'/categories'})
    //   .then((res) => {
    //     this.Cates = res.data.message;

    //     //存储接口数据到本地存储
    //     wx.setStorageSync('cates', {time:Date.now(),data:this.Cates})
    //     let leftMenuList = this.Cates.map(item => item.cat_name);
    //     let rightGoodsList = this.Cates[0].children;
    //     this.setData({
    //       leftMenuList,
    //       rightGoodsList,
    //     })
    //   })
    const res = await request({url:'/categories'})
    this.Cates = res.data.message;
    wx.setStorageSync('cates', {time:Date.now(),data:this.Cates})
    let leftMenuList = this.Cates.map(item => item.cat_name);
    let rightGoodsList = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightGoodsList,
    })
  },
  handleItemTap(e){
    const {index} = e.currentTarget.dataset;
    let rightGoodsList = this.Cates[index].children;
    this.setData({
      currentIndex:index,
      rightGoodsList,
      //重设右侧内容scroll-view标签距离顶部的距离
      scrollTop:0,
    })
  },
})