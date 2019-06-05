
var postData = require('../../../data/post-data.js');



Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //这里的 id 是 用户点击的第几篇文章
      var postId = options.id;

      this.data.id = postId;
      //用户点击的那篇文章,这个存放的就是那篇文章的内容
      this.setData({
        post_Content: postData.postList[postId]
      });
      // var arr = { 0:15};
      // console.log(arr[0])

    //以下代码是关于收藏功能的逻辑代码
    /*思路:1.首先获取存放文章的收藏状态的缓存对象 
       
          2.判断这个对象是否为空,如果不为空,则将改文章的收藏状态(t or f)传给 collected,来控制前台显示对应的图片)

          3.判断如果为空,代表文章都是第一次被访问,没有收藏状态,则传一个空对象,将访问的这个文章的收藏状态置为false,讲对象缓存
    
    
    */
    var postsCollection = wx.getStorageSync('posts_collection');
    if (postsCollection) {
      this.setData({
        //绑定当前文章的收藏状态
        collected:postsCollection[postId]
      }) 
      
      } else {
        postsCollection = {};
        postsCollection[postId] = false;
        wx.setStorageSync('posts_collection', postsCollection)
      }



  },

  //控制收藏的函数
  onCollection: function(event) {
    
   //先获所有文章的收藏状态
   var postsCollection = wx.getStorageSync('posts_collection');
   //在获取当前文章的收藏状态
   var postCollection = postsCollection[this.data.id];
   //已收藏变为未收藏,反之亦然
   postCollection = !postCollection;
   //然后再将更新的状态存入对象中,更新后台的缓存对象,同时更新前台的显示图片
   postsCollection[this.data.id] = postCollection;
   wx.setStorageSync('posts_collection', postsCollection);
   this.setData({
     collected:postCollection
   })
    wx.showToast({
      title: postCollection?'已收藏':'取消收藏',
      icon: 'success',
      duration: 2000
    }) 
  },

  onShare:function(event) {
    wx.showActionSheet({
      itemList: [
        '分享到QQ',
        '分享到微博',
        '分享到朋友圈'  
      ]
     
    })
  },

  onMusic:function(event) {
    wx.playBackgroundAudio({
      dataUrl: 'http://music.163.com/song?id=463268158&userid=1541950910',
      title: '',
      coverImgUrl: ''
    })
  }
})