var app = getApp();
var util = require('../../utils/util.js');
Page({

  data:{
    //因为请求数据是异步的所以必须给定一个初始值,所以哲里是必须的
   inTheater:{},
   comingSoon:{},
   top250:{},



  hideShadow:false

  },

  onLoad: function (options) {
    var inTheaterUrl = "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSonnUrl = "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = "/v2/movie/top250" + "?start=0&count=3";
    //因为下面三个函数都是请求服务器的函数,都是异步的,所以执行顺序不一定,那么如何得到指定类型的数据呢?给每个函数指定一个标识(id)
    //                               这个就是标识
    this.getMovieList(inTheaterUrl, "inTheater","正在热映");
    this.getMovieList(comingSonnUrl,"comingSoon","即将上映");
    this.getMovieList(top250Url,"top250","豆瓣top250");


    
  },

   
  getMovieList: function (url,name,movieType) {
    var that = this;
    wx.request({
      url: app.globalData.douBanApi + url,
      method: 'GET',
      header: {
        "Content-Type": "application/xml"
      },
      success: function (res) {
        console.log(res)
        that.processDoubanData(res,name,movieType);
      },
      fail: function (error) {
        console.log('失败')
      }
    })
  },

  processDoubanData: function (movieData,name,movieType) {
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
    //这里使用的 js 中的动态语言特点. 个对象设置一个变量的属性
    var readyData = {};
    
    readyData[name] = {
      movieType:movieType,
      movies:movies
    }
    //将数据绑定到data中的三个属性中
    //最后得到的数据:    inTheater:{movies:[里面存的是movies数组]}
    //setData接收的参数是一个json对象
    this.setData(readyData);
   
  },


  //给 更多 设置点击事件,跳转页面
  onMoreMovie:function(event) {
    console.log(event)
    var type = event.currentTarget.dataset.type
    wx.navigateTo({
      url: './more-movies/more-movies?type=' + type,
    })
  },


  //电影搜索函数

  //得到焦点函数
  onBindFocus: function () {
    this.setData({
      hideShadow:true
    })
   
  },

  //点击 X 回到原来的页面
  onCancelSearch:function(event) {
    
      this.setData({
        hideShadow: false

      })
  },

  //失去焦点函数
  onBindconfirm: function (event) {
    //input输入的数据通过事件参数 event.detail.value 来获取
    var text = event.detail.value;
    console.log(text);


  },




  //电影详情页函数
  onMovieDetail:function(event) {
    var movieId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: './movie-detail/movie-detail?id=' + movieId
    })
  }


})