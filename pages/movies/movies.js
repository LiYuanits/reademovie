// pages/movies/movies.js
var util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult: {},
    contaierShow: true,
    searchPanelShow: false,

    totalCount: 0,
    isEmpty: true

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=5&count=3";
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=2&count=3";
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=2&count=3";
    this.getMovieListData(inTheatersUrl, 'inTheaters', '正在热映');
    this.getMovieListData(comingSoonUrl, 'comingSoon', '即将上映');
    this.getMovieListData(top250Url, 'top250', '豆瓣top250');
  },

  getMovieListData: function(url, settedkey, categorytitle) {
    var that = this;
    wx.request({
      url: url, //仅为示例，并非真实的接口地址
      header: {
        'Content-type': 'application/json' // 默认值
      },
      success(res) {
        that.processDoubanData(res.data, settedkey, categorytitle);
      }
    })
  },

  processDoubanData: function(moviesDouban, settedkey, categorytitle) {
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
    var readyData = {};
    readyData[settedkey] = {
      categorytitle: categorytitle,
      movies: movies
    };
    this.setData(readyData);


  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function(event) {
    // if (this.data.searchPanelShow) {
 
    //   var nextUrl = app.globalData.doubanBase + "v2/movie/search?q=?start=" + this.data.totalCount + "&count=20";
    //   util.http(nextUrl, this.processDoubanData, "");
    //   wx.showNavigationBarLoading();
    // }
    // var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    // util.http(nextUrl, this.processDoubanData,"");
    // wx.showNavigationBarLoading();
  },


  onBindFocus: function(event) {
    this.setData({
      contaierShow: false,
      searchPanelShow: true
    });
  },
  onCancelImgTap: function(event) {
    this.setData({
      contaierShow: true,
      searchPanelShow: false,
      searchResult: {}
    });
  },
  onBindChange: function(event) {
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
    this.getMovieListData(searchUrl, "searchResult", "");
    this.data.isEmpty = false;
    this.data.requestUrl = app.globalData.doubanBase;

  },



  /**
   * 查看更多事件
   */
  onMoretap: function(event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category,
    })
  },
  onMovieTap: function(event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function(event) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(event) {

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
  onPullDownRefresh: function() {

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})