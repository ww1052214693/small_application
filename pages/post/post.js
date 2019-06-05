var postData = require('../../data/post-data.js')




Page({

  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      post_content:postData.postList
    });
  },

  onPostTap:function(event) {
    var id = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: './post-detail/detail?id=' + id,
    })
  },


  onSwiper:function(event) {
    var id = event.target.dataset.id;
    wx.navigateTo({
      url: './post-detail/detail?id=' + id,
    })
  }
})