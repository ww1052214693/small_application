// pages/movies/movie-detail/movie-detail.js

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    actorName:"",
    actorImg:{},
    movieType:"",
    boll:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var movieId = options.id;
    


    //设置查找指定电影的url
    var thisMovieUrl = app.globalData.douBanApi + "/v2/movie/subject/" + movieId;
    this.getMovieList(thisMovieUrl);

    console.log(this.data.actorName)

  },

  getMovieList: function (url) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "application/xml"
      },
      success: function (res) {
        console.log(res);
        //这里要注意this指向问题
        that.processDoubanData(res);


      },
      fail: function (error) {
        console.log('失败')
      }
    })
  },

  //处理演员的名字
  playActorName:function(a) {
    var actorName = [];
    var actorImg = [];
    for(var i = 0;i<a.length;i++) {
     actorName.push(a[i].name)
     actorImg.push(a[i].avatars.small)
    }
    //使用join()将数组转换为字符串
    actorName.join("、")
    this.setData({
      actorName: actorName.join("/"),
      actorImg:actorImg
    })
  },

  



  //处理电影详情的函数
  processDoubanData: function (movieData) {
    var movieData = movieData.data;

    //处理演员的名字
    this.playActorName(movieData.casts);

    //处理电影的类型
    this.setData({
      movieType: movieData.genres.join("、")
    })
    //var movie = [];
    var temp = {
      movie_title: movieData.title,
      country: movieData.countries[0],
      playDate: movieData.mainland_pubdate,
      like: movieData.ratings_count,
      ratings: movieData.reviews_count,
      average: movieData.rating.average,
      stars: movieData.rating.stars,
      dao_yan: movieData.directors[0].name,
      jian_jie: movieData.summary,
      bigImg: movieData.trailers[0].medium,
      smallImg: movieData.images.small



    };
   //movie.push(temp)
    this.setData({
      movie:temp
    })
    console.log(temp)


















  },

})