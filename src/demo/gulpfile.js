// ---------------- 项目个性化配置配置 -----------------
// view文件名
var path = require('path')
var sep = path.sep
var dir = __dirname.substring(__dirname.lastIndexOf(sep) + 1);
var type = dir.split('_')[0]

var viewName = dir||'template'
var is_mobile = type!='p'?true:false   //true h5 | false pc


var _ = require('lodash')
var gulp = require('gulp')
var gutil = require('gulp-util')
var clean = require('gulp-clean')
var sftp = require('gulp-sftp')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var myConfig = require('../../config/my-config.json')
var glob = require('glob')



var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')


var pagesDir = path.join(__dirname, 'pages')
var incPath = '../../../sinclude/wp/'
var distPath = '../../dist/'




//
// gulp任务
// -------------------------------
// 实时编译
//watch 所有入口js文件，如果有修改就编译生成相关文件，不影响项目内其他文件
gulp.task('default',function(event){
  var watcher = gulp.watch('./**');
  var argv = require('yargs').argv;
  var fileList = argv.page;
  watcher.on('change', function (event) {
      var arrSplitFile = event.path.split(sep),
          changeFileName = arrSplitFile[arrSplitFile.length - 1];
      // gulpfile的修改不重编业务
      if (changeFileName === 'gulpfile.js') {
          return false;
      }

      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
      var map = {};
      if (fileList) {
          var arrFileName = fileList.split(',');
          if (event.path.indexOf(pagesDir) > -1 && !_.includes(arrFileName, changeFileName.replace('.js', ''))) {
              console.log(`当前修改的入口文件${changeFileName}不在指定的入口名称列表${fileList}中`);
              return false;
          }

          arrFileName.forEach(function (filename) {
              var entryPath = pagesDir + sep + filename + '.js';
              map[filename] = entryPath;
          });

          wpTask('dev',map,function(){
              console.log('project dev compile finished...')
          });
      } else {
          console.log('请设置入口名称，多个入口请用","分隔');
          return false;
      }
  });
})


gulp.task('hot',function(event){
    var watcher = gulp.watch('./**');
    var argv = require('yargs').argv;
    var fileList = argv.page;


    var map = {};
    if (fileList) {
        var arrFileName = fileList.split(',');
        var hotMiddlewareScript = 'commonjs/dev-client.js';
        arrFileName.forEach(function (filename) {
          var entryArr = [];
            var entryPath = pagesDir + sep + filename + '.js';
            entryArr.push(entryPath);
            entryArr.push(hotMiddlewareScript);

            map[filename] = entryArr;
        });

        wpHot('dev',map,function(){
            console.log('project dev compile finished...')
        });
    } else {
        console.log('请设置入口名称，多个入口请用","分隔');
        return false;
    }


})


//针对单个入口发布模式编译打包
gulp.task('build',function(event){

    var argv = require('yargs').argv,
        ext = argv.ext||'js',
        fileList = argv.page;


    var map = {};
    if (fileList) {
        var arrFileName = fileList.split(',');
        arrFileName.forEach(function (filename) {
            var entryPath = pagesDir + sep + filename + '.js';
            map[filename] = entryPath;
            //clean
            gulp.src(distPath + viewName + '/build/**/'+filename+'.*.*.*', {read: false})
                .pipe(clean({ force: true }));
        });

        wpTask('build',map,function(){
            console.log('project build compile finished...')
        });
    } else {
        console.log('请设置入口名称，多个入口请用","分隔');
        return false;
    }

  })


  //针对单个入口发布模式编译打包
  gulp.task('dev',function(event){

      var argv = require('yargs').argv,
          ext = argv.ext||'js',
          fileList = argv.page;


      var map = {};
      if (fileList) {
          var arrFileName = fileList.split(',');
          arrFileName.forEach(function (filename) {
              var entryPath = pagesDir + sep + filename + '.js';
              map[filename] = entryPath;
              //clean
              gulp.src(distPath + viewName + '/dev/**/'+filename+'.*.*.*', {read: false})
                  .pipe(clean({ force: true }));
          });

          wpTask('dev',map,function(){
              console.log('project dev compile finished...')
          });
      } else {
          console.log('请设置入口名称，多个入口请用","分隔');
          return false;
      }
    })



function wpHot(env,map,cb){
    var webpackConf = {}

    if(env == 'build'){
        webpackConf = require('../../config/webpack.js.prod.conf.js');
    }else{
        webpackConf = require('../../config/webpack.js.dev.conf.js')
    }

    webpackConf.entry = map;
    webpackConf.output.path = path.resolve(__dirname, '../../dist/') + sep + viewName + sep+env;
    webpackConf.output.publicPath = '/';


    //webpackConf.output.chunkFilename ='[chunkhash:8].chunk.js'
    //webpackConf.output.publicPath = myConfig.static.publicPath + viewName + '/'

    webpackConf.env = env
    generateSinclude(webpackConf, map)
    // webpackConf.plugins = (webpackConf.plugins || []).concat(
    //   new webpack.optimize.CommonsChunkPlugin({
    //     name: 'common', // 将公共模块提取，生成名为`common`的chunk
    //     chunks: chunks,
    //     minChunks: 2
    //   })
    // );

    console.log(webpackConf);

    var app = express()
    var compiler = webpack(webpackConf)

    // Define HTTP proxies to your custom API backend
    // https://github.com/chimurai/http-proxy-middleware
    var proxyTable = {
      // '/api': {
      //   target: 'http://jsonplaceholder.typicode.com',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/api': ''
      //   }
      // }
    }

    var devMiddleware = require('webpack-dev-middleware')(compiler, {
      publicPath: webpackConf.output.publicPath,
      stats: {
        colors: true,
        chunks: false
      },
      hot: true,
      noInfo: false,
      historyApiFallback: true
    })


    var hotMiddleware = require('webpack-hot-middleware')(compiler)
    // force page reload when html-webpack-plugin template changes
    compiler.plugin('compilation', function (compilation) {
      compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        hotMiddleware.publish({ action: 'reload' })
        cb()
      })
    })

    // proxy api requests
    Object.keys(proxyTable).forEach(function (context) {
      var options = proxyTable[context]
      if (typeof options === 'string') {
        options = { target: options }
      }
      app.use(proxyMiddleware(context, options))
    })

    // handle fallback for HTML5 history API
    app.use(require('connect-history-api-fallback')())

    // serve webpack bundle output
    app.use(devMiddleware)

    // enable hot-reload and state-preserving
    // compilation error display
    app.use(hotMiddleware)

    // serve pure static assets
    app.use('/img', express.static('./img'))

    app.listen(8081, function (err) {
      if (err) {
        console.log(err)
        return
      }
      console.log('Listening at http://localhost:8081\n')
    })


    //console.log(webpackConf);
    // webpack(webpackConf, function (err, stats) {
    //     if (err) throw new gutil.PluginError('build', err)
    //     gutil.log('[build]', stats.toString({
    //         colors: true
    //     }))
    //     cb()
    // })
}

function wpTask(env,map,cb){
    var webpackConf = {}

    if(env == 'build'){
        webpackConf = require('../../config/webpack.js.prod.conf.js');
    }else{
        webpackConf = require('../../config/webpack.js.dev.conf.js')
    }

    webpackConf.entry = map;
    webpackConf.output.path = path.resolve(__dirname, '../../dist/') + sep + viewName + sep+env;
    //webpackConf.output.publicPath = myConfig.static.publicPath + viewName + '/'+dir+ '/';


    //webpackConf.output.chunkFilename ='[chunkhash:8].chunk.js'
    //webpackConf.output.publicPath = myConfig.static.publicPath + viewName + '/'

    webpackConf.env = env
    generateSinclude(webpackConf, map)
    // webpackConf.plugins = (webpackConf.plugins || []).concat(
    //   new webpack.optimize.CommonsChunkPlugin({
    //     name: 'common', // 将公共模块提取，生成名为`common`的chunk
    //     chunks: chunks,
    //     minChunks: 2
    //   })
    // );

    //console.log(webpackConf);
    webpack(webpackConf, function (err, stats) {
        if (err) throw new gutil.PluginError('build', err)
        gutil.log('[build]', stats.toString({
            colors: true
        }))
        cb()
    })
}

// 配置生成jsi和cssi文件，以及view的html文件
function generateSinclude(webpackConf, entrys) {
    // 注入个性化配置
    webpackConf.viewName = viewName
    webpackConf.libs = [''] //目前支持zepto jquery

//    webpackConf.libName = is_mobile ? 'zepto' : 'jquery';


    var htmlPages = [];

    _.forEach(entrys, function(v,k) {

        htmlPages.push(new HtmlWebpackPlugin({
            title: k,
            filename: k+'.html',
            template: path.resolve(__dirname, './tpl/'+k+'.html'),
            chunks: [k]
        }));

    });

    webpackConf.plugins = (webpackConf.plugins || []).concat(htmlPages);

    return webpackConf
}

function getName(filePath){
    return filePath.substring(filePath.lastIndexOf(sep) + 1, filePath.lastIndexOf('.'))
}
