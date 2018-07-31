var util = require('../../utils/utils.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult:{},
    containerShow: true,
    searchPanelShow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 豆瓣api无法访问成功 
    // 使用 ---> http://t.yushu.im

    var baseUrl = getApp().globalData.doubanBase;

    var inTheatersUrl = baseUrl + '/v2/movie/in_theaters' + "?start=0&count=3";
    var comingSoonUrl = baseUrl + '/v2/movie/coming_soon' + "?start=0&count=3";
    var top250Url = baseUrl + '/v2/movie/top250' +
      "?start=0&count=3";

    this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMovieListData(top250Url, "top250", "豆瓣Top250");

  },

  getMovieListData: function(url, key, categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': "application/json"
      },
      success: function(res) {
        //success 
        that.proccessDoubanData(res.data, key, categoryTitle);
      },
      fail: function(error) {
        console.log('failed')
      }

    })
  },

  proccessDoubanData: function(moviesDouban, key, categoryTitle) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id,
      }
      movies.push(temp);
    }


    var readyData = {};
    readyData[key] = {
      movies: movies,
      categoryTitle: categoryTitle
    }
    this.setData(readyData);
  },


  onMoreTap: function(event) {
    var category = event.currentTarget.dataset.category
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category,
    })
  },

  onCancelImgTap: function(event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false, 
    })
  },

  onBindFocus: function(event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },

  onBindBlur: function(event) {
    var text = event.detail.value;
    var searchUrl = getApp().globalData.doubanBase +'/v2/movie/search?q='+text;
    console.log(searchUrl)
    this.getMovieListData(searchUrl,"searchResult","")
  },

  onMovieTap:function(event){
    //movieid---  all lower word
    var movieId = event.currentTarget.dataset.movieid;
    console.log("movieId=" + movieId)
      wx.navigateTo({
        url: 'movie-detail/movie-detail?id='+movieId
      })
  },


})