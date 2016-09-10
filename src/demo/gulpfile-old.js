// ---------------- 项目个性化配置配置 -----------------
// view文件名
var path = require('path')
var sep = path.sep
var dir = __dirname.substring(__dirname.lastIndexOf(sep) + 1);
var type = dir.split('_')[0]

var viewName = dir||js_template
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




var pagesDir = path.join(__dirname, 'pages')
//var cssDir = path.resolve(process.cwd(), 'assets')
//var sincDir = path.resolve(process.cwd(), '../../../sinclude')
//var wpSincDir = path.resolve(sincDir, '/wp')
var incPath = '../../../sinclude/wp/'
var distPath = '../../dist/'




// 配置生成jsi和cssi文件，以及view的html文件
function generateSinclude(webpackConf, entrys) {
    // 注入个性化配置
    webpackConf.viewName = viewName
    webpackConf.libs = ['zepto'] //目前支持zepto jquery

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

//
// gulp任务
// -------------------------------
// 实时编译
//watch 所有入口js文件，如果有修改就编译生成相关文件，不影响项目内其他文件
gulp.task('default',function(event){
    var watcher = gulp.watch(pagesDir+'/*');
    watcher.on('change', function(event) {
//        console.log(event)
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');


        var filePath = event.path
        var filename = getName(filePath)
        console.log(filename)
        var map={}
        map[filename] = filePath


        wpTask('dev',map,function(){
            console.log('project dev compile finished...')
        });
      })
})

//针对单个入口发布模式编译打包
gulp.task('build',function(event){

    var argv = require('yargs').argv,
        ext = argv.ext||'js',
        filename = argv.page;

    if (!filename) {
        console.log('请设置入口名称');
        return;
    }

    //clean
    gulp.src(distPath + viewName + '/**/'+filename+'.*.*.*', {read: false})
        .pipe(clean({ force: true }));


//    var filePath =  pagesDir+viewName+sep+'pages'+sep+filename+'.'+ext
    var filePath=path.join(pagesDir,filename+'.'+ext);
    console.log(filePath)
    var map={}
    map[filename] = filePath

    wpTask('build',map,function(){
        console.log('project build compile finished...')
    })
  })

/*gulp.task('w', function () {
 gulp.watch(pagesDir+'*//*', ['upload-ssi-dev'])

 })*/

//整个项目开发模式编译
gulp.task('d',['webpack-dev'])

//整个项目发布模式编译
gulp.task('b', ['webpack-build'])

//watch 整个项目目录，只要有文件修改就执行开发模式编译
gulp.task('w', ['webpack-dev'], function () {
    gulp.watch('../**', ['webpack-dev'])
})

// 清除多余文件
gulp.task('clean', function () {
    return gulp.src([distPath + viewName + '/',incPath+viewName+'/'], {read: false})
        .pipe(clean({ force: true }))
})

// 上传到dev服务器
gulp.task('upload-dev', ['webpack-dev'], function () {
    return gulp.src( distPath + viewName + '/**')
        .pipe(sftp({
            host: myConfig.sftp.dev.host,
            port: myConfig.sftp.dev.port,
            user: myConfig.sftp.dev.user,
            pass: myConfig.sftp.dev.pass,
            remotePath: myConfig.sftp.dev.staticRemotePath + viewName
        }))
})

gulp.task('upload-ssi-dev', ['upload-dev'], function () {
    return gulp.src(incPath + viewName + '/**')
        .pipe(sftp({
            host: myConfig.sftp.dev.host,
            port: myConfig.sftp.dev.port,
            user: myConfig.sftp.dev.user,
            pass: myConfig.sftp.dev.pass,
            remotePath: myConfig.sftp.dev.ssiRemotePath + viewName
        }))
})



// 上传到dev服务器
gulp.task('upload-build', ['webpack-build'], function () {
    return gulp.src(distPath + viewName + '/**')
        .pipe(sftp({
            host: myConfig.sftp.dev.host,
            port: myConfig.sftp.dev.port,
            user: myConfig.sftp.dev.user,
            pass: myConfig.sftp.dev.pass,
            remotePath: myConfig.sftp.dev.staticRemotePath + viewName
        }))
})

gulp.task('upload-ssi-build', ['upload-build'], function () {
    return gulp.src(incPath + viewName + '/**')
        .pipe(sftp({
            host: myConfig.sftp.dev.host,
            port: myConfig.sftp.dev.port,
            user: myConfig.sftp.dev.user,
            pass: myConfig.sftp.dev.pass,
            remotePath: myConfig.sftp.dev.ssiRemotePath + viewName
        }))
})

// 打包压缩
gulp.task('webpack-dev', function (cb) {
    var entryFiles = glob.sync(pagesDir + '/*.{js,jsx}')
    var map = {}
    var chunks = []
    _.forEach(entryFiles, function(filePath) {
        //var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
        var filename = getName(filePath)
        map[filename] = filePath
        chunks.push(filename)
    });

    wpTask('dev',map,cb)
})

gulp.task('webpack-build', ['clean'], function (cb) {
    var entryFiles = glob.sync(pagesDir + '/*.{js,jsx}')
    var map = {}
    var chunks = []
    _.forEach(entryFiles, function(filePath) {
        //var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
        var filename = getName(filePath)
        map[filename] = filePath
        chunks.push(filename)
    });
    wpTask('build',map,cb)
})

//创建发布单
gulp.task('publish', function () {

    var request = require('request');

    var argv = require('yargs').argv,
        mod = argv.mod,
        title = argv.title,
        from = argv.from || 'dev',
        to = argv.to || 'idc';

    if (!mod) {
        console.log('请设置模块名称');
        return;
    }

    var files = [];

    var modfiles = glob.sync(distPath + viewName + '/**/'+mod+'.*');
    var modincs = glob.sync(incPath + viewName + '/**/'+mod+'.*');

    files = modfiles.concat(modincs);

    var string = files.join('\n');

    var j = request.jar();
    var cookie = request.cookie('user=' + myConfig.sftp.dev.user);


    var url = "http://oa.midea.com/index.php/publish/newPublishOrder";
    j.setCookie(cookie, url);
    console.log(string)
    request.post({
        url: url,
        jar: j,
        form: {
            title: title||mod,
            id: 2,
            from: from,
            to: to,
            files: string
        }
    }, function (error, response, body) {

        if (response.statusCode == 463) {
            console.log('[error]请在host文件加上legos的host的，用filldler无效哦！');
            return;
        }

        if (response.statusCode == 500) {
            console.log('[error]模块ID不能重复!');
            return;
        }
        if (!error && response.statusCode == 200) {

            if (!JSON.parse(body)) {
                console.log('返回值出错');
                return;
            }
            var data = JSON.parse(body);
            if (data.code == 0) {
                console.log(data)
            }
        }
    })


})

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
