import {getSetting, openSetting, chooseAddress,showModal,showToast} from '../../utils/asyncWx.js';
Page({
  data: {
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0,
  },
  onShow(){
    const address = wx.getStorageSync('address');
    //获取缓存中购物车数据
    const cart = wx.getStorageSync('cart') || [];

    this.setData({address});
    this.setCart(cart);
  },
  onLoad: function (options) {

  },
  async handleChooseAddress(){
    const resAdress = await getSetting();
    const scopeAddress = resAdress.authSetting["scope.address"]
    !scopeAddress && await openSetting();
    const address = await chooseAddress();
    wx.setStorageSync('address', address)
  },
  handleItemChange(e){
    const goods_id = e.currentTarget.dataset.id;
    let {cart} = this.data;
    let index = cart.findIndex(item => item.goods_id === goods_id);
    cart[index].checked = !cart[index].checked;
    
    this.setCart(cart);
  },
  //设置购物车状态同事重新计算底部工具栏数据
  setCart(cart){
    let allChecked = true;
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach((item) => {
      if(item.checked){
        totalPrice+=item.num*item.goods_price;
        totalNum+=item.num;
      }else{
        allChecked=false;
      }
    })
    allChecked = cart.length!=0 ? allChecked : false;
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum,
    });
    wx.setStorageSync('cart', cart);
  },
  handleItemAllCheck(){
    let {cart,allChecked} = this.data;
    allChecked=!allChecked;
    cart.forEach(item=>item.checked=allChecked);
    this.setCart(cart);
  },
  async handleItemNumEdit(e){
    const {operation,id} = e.currentTarget.dataset;
    let {cart} = this.data;
    const index = cart.findIndex(item => item.goods_id === id);

    if(cart[index].num === 1 && operation === -1){
      const res = await showModal({content:'是否删除此商品？'})
      if(res.confirm){
        cart.splice(index,1);
        this.setCart(cart);
      }
    }else{
      cart[index].num+=operation;
      this.setCart(cart);
    }
  },
  async handlePay(){
    const {address,totalNum} = this.data;
    if(!address.userName) return await showToast({title:"您还没有选择收获地址哦！"});
    if(totalNum === 0) return await showToast({title:"您还没有选购商品哦！"});
    wx.navigateTo({
      url: '/pages/pay/pay',
    })
  }
})