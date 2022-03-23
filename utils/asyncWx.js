/**
 * promise形式的getSetting
 */
const getSetting = () => {
  return new Promise((resolve,reject) => {
    wx.getSetting({
      success:(res)=>{
        resolve(res)
      },
      fail:(err) => {
        reject(err)
      }
    })
  })
}

const openSetting = () => {
  return new Promise((resolve,reject) => {
    wx.openSetting({
      success:(res)=>{
        resolve(res)
      },
      fail:(err) => {
        reject(err)
      }
    })
  })
}

const chooseAddress = () => {
  return new Promise((resolve,reject) => {
    wx.chooseAddress({
      success:(res)=>{
        resolve(res)
      },
      fail:(err) => {
        reject(err)
      }
    })
  })
}

const showModal = ({content}) => {
  return new Promise((resolve,reject)=>{
    wx.showModal({
      title: '温馨提示',
      content:content,
      success:(res)=>{
        resolve(res);
      },
      fail:(err)=>{
        reject(err);
      }
    })
  })
}

const showToast = ({title}) => {
  return new Promise((resolve,reject)=>{
    wx.showModal({
      title: title,
      icon:'none',
      success:(res)=>{
        resolve(res);
      },
      fail:(err)=>{
        reject(err);
      }
    })
  })
}

const login = () => {
  return new Promise((resolve,reject)=>{
    wx.login({
      timeout: 10000,
      success:(res)=>{
        resolve(res);
      },
      fail:(err)=>{
        reject(err);
      }
    })
  })
}

const requestPayment = (pay) => {
  return new Promise((resolve,reject)=>{
    wx.requestPayment({
      ...pay,
      success:(result)=>{
        resolve(result);
      },
      fail:(err)=>{
        reject(err);
      }
    })
  })
}

export {
  getSetting,
  openSetting,
  chooseAddress,
  showModal,
  showToast,
  login,
  requestPayment,
}