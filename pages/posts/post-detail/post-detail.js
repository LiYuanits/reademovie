// pages/posts/post-detail/post-detail.js
var postDatas = require('../../../data/posts.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayingMusic: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.currentPostId = options.id;
    var postId = options.id;
    var postData = postDatas.postList[postId];
    this.setData({
      postData: postData
    });
    var postsCollected = wx.getStorageSync('posts_collected');
    if (postsCollected) {
      var postCollected = postsCollected[postId];
      this.setData({
        collected: postCollected
      });
    } else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected);
    }
    if (app.globalData.g_isPlayingMusic && app.globalData.currentPostId === postId){
        this.setData({
          isPlayingMusic:true
        });
    }
    this.setMusicMonitor();
 
  },


  /**
   * 监听背景音乐事件
   */
  setMusicMonitor:function(){
    var that = this;
    const backgroundAudioManager = wx.getBackgroundAudioManager();
    backgroundAudioManager.onPause(() => {
      that.setData({
        isPlayingMusic: false
      });
      app.globalData.g_isPlayingMusic = false;
      app.globalData.currentPostId = null;
    });
    backgroundAudioManager.onPlay(() => {
      that.setData({
        isPlayingMusic: true
      });
      app.globalData.g_isPlayingMusic = true;
      app.globalData.currentPostId = that.data.currentPostId;
    });
  },



  /**
   * 收藏事件
   */
  onColletionTap: function(event) {
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = postsCollected[this.data.currentPostId];
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    wx.setStorageSync('posts_collected', postsCollected);
    this.setData({
      collected: postCollected
    });
    wx.showToast({
      title: postCollected ? "收藏成功" : "取消成功",
      duration: 1000,
      icon: "success",
      mask: true,
      success: function() {
      }
    })
  },

  /**
   * 音乐点击暂停播放事件
   */
  onMusicTap: function(event) {
    var isPlayingMusic = this.data.isPlayingMusic;
    var currentPostId = this.data.currentPostId;
    var postData = postDatas.postList[currentPostId];
    const backgroundAudioManager = wx.getBackgroundAudioManager()
    if (isPlayingMusic) {
      backgroundAudioManager.stop();
      this.setData({
        isPlayingMusic: false
      });
    } else {
      backgroundAudioManager.play(
        backgroundAudioManager.title = postData.music.title,
        backgroundAudioManager.coverImgUrl = postData.music.coverImg,
        // 设置了 src 之后会自动播放
        backgroundAudioManager.src = postData.music.url
      );
      this.setData({
        isPlayingMusic: true
      });

    }
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
    const backgroundAudioManager = wx.getBackgroundAudioManager();
    backgroundAudioManager.onEnded(() => {
      this.setData({
        isPlayingMusic: false
      });
      app.globalData.g_isPlayingMusic = false;
      app.globalData.currentPostId = null;
    });
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})