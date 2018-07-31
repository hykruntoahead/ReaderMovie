var postsData = require('../../data/posts-data.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
      //小程序总是会读取data对象来做数据绑定，
      //这个动作在onLoad事件之后发生的
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
      // this.data.postList = postsData.postList
      this.setData({
        posts_key: postsData.postList
      });
    },

    onPostTap: function(event) {
      var postId = event.currentTarget.dataset.postid;
      // console.log("on_post_id"+postId)

      wx.navigateTo({
        url: 'post-detail/post-detail?id=' + postId,
      })
    },


    onSwiperTap: function(event) {
      // currentTarget 和 target
      // target 指的是当前点击组件
      // currentTarget 指的是事件捕获的组件
      var postId = event.target.dataset.postid;
      console.log("on_post_id" + postId)

      wx.navigateTo({
        url: 'post-detail/post-detail?id=' + postId,
      })
    }


  }

)