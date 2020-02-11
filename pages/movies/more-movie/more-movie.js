// pages/movies/more-movie/more-movie.js
var util = require('../../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies: {},
    requestUrl: "",
    totalCount: 0,
    navigateTitle: "",
    isEmpty: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var category = options.category;
    this.data.navigateTitle = category;
    var dataUrl = "";
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "豆瓣top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break
    }
    this.data.requestUrl = dataUrl;
    util.http(dataUrl, this.processDoubanData);
  },

  /**
   * 上拉加载更多
   */
  onReachBottom: function(event) {
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },

  /**
   * 获取页面数据回调函数
   */
  processDoubanData: function(moviesDouban) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subjects = moviesDouban.subjects[idx];
      var title = subjects.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        stars: util.convertToStarsArray(subjects.rating.stars),
        title: title,
        average: subjects.rating.average,
        coverageUrl: subjects.images.large,
        movieId: subjects.id
      }
      movies.push(temp);
    }
    var totalMovies = {};


    //如果要绑定新的数据，需要把旧的数据跟新的数据合并
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    } else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovies
    });
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId,
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function(event) {
    //动态设置导航栏标题
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function(event) {
    var refreshUrl = this.data.requestUrl + "?start=0&count=20";
    this.data.movies = {};
    this.data.isEmpty = true;
    this.data.totalCount = 0;
    util.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})