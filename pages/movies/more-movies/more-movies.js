var app = getApp();
var util = require('../../../utils/util.js');

Page({

 
  data: {
    currentType:"",
    movies:{},

  // 关联的函数 bindscrolltolower
    requestUrl:"",
    //请求的数据的个数,请求一次加20
    num:0,
    //判断movies中的值是否为空
    isEmpty:true,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //这里是从上一级页面传过来的电影类型
    var moviesType = options.type;
    //用this.data.属性名的方式来获取data中的数据
    this.data.currentType = moviesType;

  



    //获取数据的url连接
    var dataUrl = "";
    switch(moviesType) {
      case "正在热映":
                 //这里使用的是全局的属性,需要引入app
        dataUrl = app.globalData.douBanApi + "/v2/movie/in_theaters";
      break;
      case "即将上映":
        dataUrl = app.globalData.douBanApi + "/v2/movie/coming_soon";
      break;
      case "豆瓣top250":
        // dataUrl = app.globalData.douBanApi + "/v2/movie/in_theater";
        dataUrl = app.globalData.douBanApi + "/v2/movie/top250";
      break;
    }
    this.data.requestUrl = dataUrl;
    this.getMovieList(dataUrl)



    //获取电影搜索的信息
    var search = app.globalData.douBanApi + "/v2/movie/search?q=张艺谋";
    console.log("搜索")
    this.getMovieList(search);
  },



  getMovieList: function (url) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        //application/xml
        "Content-Type": "application/xml"
      },
      success: function (res) {
        that.processDoubanData(res);
      },
      fail: function (error) {
        console.log('失败')
      }
    })
  },

  

  processDoubanData: function (movieData) {
    var movies = [];
    for (var idx in movieData.data.subjects) {
      var subject = movieData.data.subjects[idx];
      var title = subject.title;
      //处理电影名字长度大于6的情况
      if (title.length > 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        stars: util.ratingStars(subject.rating.stars),
        title: title,
        movieImg: subject.images.large,
        //电影的评分
        average: subject.rating.average,
        movieId: subject.id
      }
      movies.push(temp);
    }



   //和加载更多数据的功能有关    onScrollFooter
    var totalMovies = {};
     if(!this.data.isEmpty) {
       //若this.data.movies中有数据,则将新数据和旧数据组合起来  数组的concat方法
        totalMovies = this.data.movies.concat(movies)
     }else {
      
       totalMovies  = movies;
       this.data.isEmpty = false;
      
     }
     this.setData({
       movies:totalMovies
     })
     this.data.num += 20;
     wx.hideNavigationBarLoading();
     wx.stopPullDownRefresh()




  },



  //这里是 向上滚动,加载更多数据的函数   scroll-view
//这里 用 onReachBottom 函数是为了解决   下拉刷新 (enablePullDownRefresh) 与 (scroll-view组件)不能同时存在的问题
  onReachBottom:function(event) {
    console.log('加载更多');
    //请求路径,请求的次数, 因为一个页面只装了20条数据,所以要想装更多的数据,每次请求后将新添加的数据更新
    //requestUrl, num  ,
    var requestDataUrl = this.data.requestUrl + "?start=" + this.data.num + "&count=20";
    // console.log(requestDataUrl);
    this.getMovieList(requestDataUrl);
    
    //这里时设置导航栏 在等待数据记载是的 动画下过  圈圈转
   //  wx.showNavigationBarLoading() 和 wx.hideNavigationBarLoading()   两个一起使用,前一个是加载数据时的等待效果,后一个是加载完毕后等待效果的动画结束
    wx.showNavigationBarLoading();

  },


//下拉刷新函数
//在使用 enablePullDownRefresh 函数后,框架会给你提供一个onPullDownRefresh这个函数
onPullDownRefresh:function() {
  //只刷新前20条数据
  var refreshUrl = this.data.requestUrl + "?start=0&count=20";
  //因为进入更多电影页面后,就已经加载了20条数据,此时在下拉刷新加载,又会加载之前重复的数据,所以这里应该讲 movie 和 isEmpty  num 初始化
  this.data.movies= {};
  this.data.isEmpty = true;
  this.data.num = 0;
  this.getMovieList(refreshUrl);
  wx.showNavigationBarLoading();
},



  //电影详情页函数
  onMovieDetail: function (event) {
    var movieId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId
    })
  },






  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //这里是设置顶部导航条的代码
    wx.setNavigationBarTitle({
      title: this.data.currentType
    })
  },

  
  
})