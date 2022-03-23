import {request} from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime.js';

Page({
  data: {
    goodsObj:{},
    isCollect:false,
  },
  GoodsInfo:{},

  onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length-1];
    let options = currentPage.options;
    const {goods_id} = options;
    this.getGoodsDetail(goods_id);

  },
  async getGoodsDetail(goods_id){
    const res = await request({url:"/goods/detail",data:{goods_id}});
    this.GoodsInfo = res.data.message;
    let collect = wx.getStorageSync('collect') || [];
    let isCollect = collect.some(item => item.goods_id === this.GoodsInfo.goods_id);
    this.setData({
      goodsObj:{
        goods_name:res.data.message.goods_name,
        goods_price:res.data.message.goods_price,
        //iphone部分手机不识别.webp格式，确保后台存在一对一的jpg格式的图片
        goods_introduce:res.data.message.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:res.data.message.pics,
      },
      isCollect:isCollect,
    })
  },
  handlePreviewImage(e){
    const urls = this.GoodsInfo.pics.map(item => item.pics_mid);
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      urls: urls,
      current: current,
    })
  },
  handleCartAdd(e){
    let cart = wx.getStorageSync("cart") || [];
    //判断商品对象是否在购物车数组中
    let index = cart.findIndex(item => item.goods_id === this.GoodsInfo.goods_id);
    if(index === -1){
      //不存在push进去
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo)
    }else{
      //存在直接数量++
      cart[index].num++;
    }
    wx.setStorageSync('cart', cart)
    wx.showToast({
      title: '购物车加入成功!',
      icon:'success',
      mask:true, //防抖
    })
  },
  handleCollect(){
    let isCollect = false;
    let collect = wx.getStorageSync('collect') || [];
    let index = collect.findIndex(item => item.goods_id === this.GoodsInfo.goods_id);
    if(index!==-1){
      collect.splice(index,1);
      isCollect=false;
      wx.showToast({
        title:'取消成功',
        icon:'success',
        mask:true,
      })
    }else{
      collect.push(this.GoodsInfo);
      isCollect=true;
      wx.showToast({
        title:'收藏成功',
        icon:'success',
        mask:true,
      })
    }
    wx.setStorageSync('collect', collect);
    this.setData({isCollect})
  },
})