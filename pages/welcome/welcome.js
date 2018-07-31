Page({
  onTap: function() {
    //跳转&保留当前页面
     wx.navigateTo({
       url: '../posts/posts',
     });

    //跳转&销毁当前页面
    //  wx.redirectTo({
    //    url: '../posts/posts',
    //  }) 

  },

  onUnload:function(){
    console.log("onUnload")
  },

  onHide :function(){
    console.log("onHide")
  }

})