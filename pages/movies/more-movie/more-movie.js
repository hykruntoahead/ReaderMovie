var util = require('../../../utils/utils.js');

Page({
  data: {
    navigateTitle: "",
    movies: {},
    requestUrl:'',
    totalCount:0,
    isEmpty:true
  },

  onLoad: function(options) {
    var category = options.category;
    this.data.navigateTitle = category;

    var baseUrl = getApp().globalData.doubanBase;
    var dataUrl = "";
    switch (category) {
      case "正在热映":
        dataUrl = baseUrl + '/v2/movie/in_theaters';
        break
      case "即将上映":
        dataUrl = baseUrl + '/v2/movie/coming_soon';
        break
      case "豆瓣Top250":
        dataUrl = baseUrl + '/v2/movie/top250';
        break
    }

    this.data.requestUrl = dataUrl;

    util.http(dataUrl, this.proccessDoubanData);
  },

  onReady: function (options) {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    });
  },  



  proccessDoubanData: function (moviesDouban) {
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

    //concat 用于连接两个或多个数组
    var totalMovies = {};

    //如果绑定新加载的数据，那么需要同就有数据合并在一起
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    } else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovies
    });

    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
    this.data.totalCount += 20;
  }, 


  refresh:function (event) {
    var refreshUrl = this.data.requestUrl +
      "?star=0&count=20";
    this.data.movies = {};
    this.data.isEmpty = true;
    this.data.totalCount = 0;
    util.http(refreshUrl, this.proccessDoubanData);
    wx.showNavigationBarLoading();
  },
 


  onScrollLower:function(event){
    var nextUrl = this.data.requestUrl + "?start="
    +this.data.totalCount +"&count=20";
    util.http(nextUrl, this.proccessDoubanData);
    wx.showNavigationBarLoading();
  },

  onMovieTap: function (event) {
    //movieid---  all lower word
    var movieId = event.currentTarget.dataset.movieid; 
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId
    })
  },




})