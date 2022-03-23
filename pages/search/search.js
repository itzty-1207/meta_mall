/**
 * 防抖：输入框中防止重复输入，重复的发送请求
 * 节流：一般用在页面上拉与下拉
 */
import {request} from '../../request/index.js';

Page({
  data: {
    goods:[],
    isFocus:false,
    inputValue:'',
  },
  timeId:-1,
  handleInput(e){
    const {value} = e.detail;
    if(!value.trim()) return this.setData({goods:[],isFocus:false});
      
    this.setData({isFocus:true});
    clearTimeout(this.timeId);
    this.timeId=setTimeout(()=>{
      this.qsearch(value);
    },1000) 
  },
  async qsearch(query){
    const res = await request({url:"/goods/qsearch",data:{query}});
    this.setData({goods:res.data.message})
  },
  handleCancal(){
    this.setData({
      inputValue:'',
      isFocus:false,
      goods:[],
    })
  }
})