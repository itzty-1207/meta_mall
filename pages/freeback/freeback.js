Page({
  data: {
    tabs:[
      {id:0,value:'体验问题',isActive:true},
      {id:1,value:'商品、商家投诉',isActive:false},
    ],
    chooseImages:[],
    textVal:'',
  },
  UploadImage:[],
  handleTabsItemChange(e){
    const {index} = e.detail;
    let {tabs} = this.data;
    tabs.forEach((item,idx) => {
      idx === index ? item.isActive = true : item.isActive = false;
      this.setData({tabs})
    })
  },
  handleChooseImg(){
    wx.chooseImage({
      count: 9,
      sizeType:['original','compressed'],
      sourceType:['album','camera'],
      success:(res)=>{
        
        this.setData({chooseImages:[...this.data.chooseImages,...res.tempFilePaths]})
      },
      fail:(err)=>{
        console.log(err);
      }
    })
  },
  handleRemoveImg(e){
    const {index} = e.currentTarget.dataset;
    let {chooseImages}=this.data;
    chooseImages.splice(index,1);
    this.setData({chooseImages})
  },
  handleTextInput(e){
    this.setData({textVal:e.detail.value})
  },
  handleFormSubmit(){
    const {textVal,chooseImages} = this.data;
    if(!textVal.trim()) return wx.showToast({title:'亲输入不合法哦！',icon:'none',mask:true});

    wx.showLoading({
      title: '正在上传中哦~',
      mask:true,
    })

    if(chooseImages.length!==0){
      //上传文件api不支持多个文件同时上传，遍历数组挨个上传
      chooseImages.forEach((item,index) => {
        wx.uploadFile({
          filePath: item,
          name: 'file',
          url: 'https://niupic.com/api/upload/',
          success:(result)=>{
            let url = JSON.parse(result.data).url;
            this.UploadImages.push(url);

            if(index === chooseImages.length-1){
              console.log('图片上传给后端');
              this.setData({textVal:"",chooseImages:[]});
              wx.navigateBack({
                delta: 1,
              })
            }
          }
        })
      })
    }else{
      wx.hideLoading();
      console.log('只上传了文本哦！');
      wx.navigateBack({delta: 1});
    }
    
  }
})