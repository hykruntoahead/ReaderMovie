var postsData = require('../../../data/posts-data.js')

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayingMusic : false,
    collected : -1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var postId = options.id;
    this.data.currentpostId = postId;

    var postData = postsData.postList[postId];
    this.setData({
      post_data: postData
    });

    //  var postsCollected= {
    //    1:true,
    //    2.false
    //    ...

    //  }

    var postsCollected = wx.getStorageSync('posts_collected');

    if (postsCollected) {
      var postCollected = postsCollected[postId];
      this.setData({
        collected: postCollected
      });
    } else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected)
    }

    if (app.globalData.g_isPlayingMusic &&
      app.globalData.g_currentMusicPostId === postId) {
      this.setData({
        isPlayingMusic: true
      });
    }

    this.setMusicMonitor();

  },


  setMusicMonitor: function() {
    var that = this;
    wx.onBackgroundAudioPlay(function() {
      that.setData({
        isPlayingMusic: true
      });
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentMusicPostId = that.data.currentpostId;
    });

    wx.onBackgroundAudioPause(function() {
      that.setData({
        isPlayingMusic: false
      });
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    });

    wx.onBackgroundAudioStop(function() {
      that.setData({
        isPlayingMusic: false
      });
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    });

  },


  onCollectionTap: function(event) {
    this.getPostsCollectedSyc();
    // this.getPostsCollectedAyc();
  },


  //同步get 
  getPostsCollectedSyc: function() {
    var postsCollected = wx.getStorageSync('posts_collected');

    var postCollected = postsCollected[this.data.currentpostId];

    postCollected = !postCollected;
    postsCollected[this.data.currentpostId] = postCollected;
    //更新文章是否的缓存值 同步
    wx.setStorageSync('posts_collected', postsCollected)

    //更新页面收藏
    this.setData({
      collected: postCollected
    });

    wx.showToast({
      title: postCollected ? '收藏成功' : '取消成功',
      duration: 1000,
      icon: 'success'
    })
  },



  //异步get
  getPostsCollectedAyc: function() {
    var that = this;
    wx.getStorage({
      key: "posts_collected",
      success: function(res) {
        var postsCollected = res.data;

        var postCollected = postsCollected[that.data.currentpostId];

        postCollected = !postCollected;
        postsCollected[that.data.currentpostId] = postCollected;
        //更新文章是否的缓存值 同步
        wx.setStorageSync('posts_collected', postsCollected)

        //更新页面收藏
        that.setData({
          collected: postCollected
        });

        wx.showToast({
          title: postCollected ? '收藏成功' : '取消成功',
          duration: 1000,
          icon: 'success'
        })
      }
    })
  },


  onShareTap: function(event) {
    var itemList = [
      '分享给微信好友',
      '分享到朋友圈',
      '分享到QQ',
      '分享到微博'
    ]
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function(res) {
        //  res.cancel 用户点击取消
        //  res.tapIndex 数组元素序号,从零开始
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: '用户是否取消?' +
            res.cancel + "小程序暂时无法实现分享功能",
        })
      }
    })
  },


  onMusicTap: function(event) {
    var postData = postsData.postList[this.data.currentpostId];
    var isPlayingMusic = this.data.isPlayingMusic;
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      });
    } else {
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg

      });
      this.setData({
        isPlayingMusic: true
      });
    }
  }

})