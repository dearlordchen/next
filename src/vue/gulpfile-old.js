// ---------------- 项目个性化配置配置 -----------------
// view文件名
var path = require('path')
var sep = path.sep
var dir = __dirname.substring(__dirname.lastIndexOf(sep) + 1);
var type = dir.split('_')[0]

var viewName = dir || 'demo'
var is_mobile = type != 'p' ? true : false   //true h5 | false pc


var _ = require('lodash')
var gulp = require('gulp')
var gutil = require('gulp-util')
var clean = require('gulp-clean')
var sftp = require('gulp-sftp')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var myConfig = require('../../js_config/my-config.json')
var glob = require('glob')
var fs = require('fs')

var pagesDir = path.join(__dirname, 'pages')
var incPath = '../../../sinclude/wp/'
var incDevPath = '../../../sinclude/wp/'
var distPath = '../../dist/'

// 配置生成jsi和cssi文件，以及view的html文件
function generateSinclude(webpackConf, entrys, env) {
    // 注入个性化配置
    webpackConf.viewName = viewName
    webpackConf.libs = ['zepto'] //目前支持zepto jquery

    var htmlPages = [];

    _.forEach(entrys, function (v, k) {

        var fname = k + '.html';
        if (env == 'dev') {
            fname = 'html/' + k + '.html';
        }


        htmlPages.push(new HtmlWebpackPlugin({
            title: k,
            filename: fname,
            template: path.resolve(__dirname, './tpl/' + k + '.html'),
            chunks: [k]
        }));

        htmlPages.push(new HtmlWebpackPlugin({
            filename: incPath + viewName + '/cssi/' + k + '.html',
            template: path.resolve(__dirname, './cssi.html'),
            chunks: [k]
        }));

        htmlPages.push(new HtmlWebpackPlugin({
            filename: incPath + viewName + '/jsi/' + k + '.html',
            template: path.resolve(__dirname, './jsi.html'),
            chunks: [k]
        }));
    });

    webpackConf.plugins = (webpackConf.plugins || []).concat(htmlPages);

    return webpackConf
}

function getName(filePath) {
    return filePath.substring(filePath.lastIndexOf(sep) + 1, filePath.lastIndexOf('.'))
}
//
// gulp任务
// -------------------------------
// 实时编译
gulp.task('default', function (event) {
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
        var map = {}
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

            execTask(map);
        } else {
            console.log('请设置入口名称，多个入口请用","分隔');
            return false;
        }
    });

    function execTask(map) {
        console.log(map);
        // 执行命令
        wpTask('dev', map, function () {
            for (var filename in map) {
                console.log('uploading relative files')
                gulp.src(distPath + viewName + '/**/' + filename + '.*')
                    .pipe(sftp({
                        host: myConfig.sftp.dev.host,
                        port: myConfig.sftp.dev.port,
                        user: myConfig.sftp.dev.user,
                        pass: myConfig.sftp.dev.pass,
                        remotePath: myConfig.sftp.dev.staticRemotePath + viewName
                    }))
                console.log('uploading ssi...')
                gulp.src(incPath + viewName + '/**/' + filename + '.*')
                    .pipe(sftp({
                        host: myConfig.sftp.dev.host,
                        port: myConfig.sftp.dev.port,
                        user: myConfig.sftp.dev.user,
                        pass: myConfig.sftp.dev.pass,
                        remotePath: myConfig.sftp.dev.ssiRemotePath + viewName
                    }))
            }
        })
    }
})


gulp.task('build', function (event) {

    var argv = require('yargs').argv,
        ext = argv.ext || 'js',
        filename = argv.page;

    if (!filename) {
        console.log('请设置入口名称');
        return;
    }

    //clean
    gulp.src(distPath + viewName + '/**/' + filename + '.*.*.*', {read: false})
        .pipe(clean({force: true}));


//    var filePath =  pagesDir+viewName+sep+'pages'+sep+filename+'.'+ext
    var filePath = path.join(pagesDir, filename + '.' + ext);
    console.log(filePath)
    var map = {}
    map[filename] = filePath

    wpTask('build', map, function () {
        console.log('uploading relative files')
        gulp.src(distPath + viewName + '/' + filename + '.*')
            .pipe(sftp({
                host: myConfig.sftp.dev.host,
                port: myConfig.sftp.dev.port,
                user: myConfig.sftp.dev.user,
                pass: myConfig.sftp.dev.pass,
                remotePath: myConfig.sftp.dev.staticRemotePath + viewName
            }))
        console.log('uploading ssi...')
        gulp.src(incPath + viewName + '/**/' + filename + '.*')
            .pipe(sftp({
                host: myConfig.sftp.dev.host,
                port: myConfig.sftp.dev.port,
                user: myConfig.sftp.dev.user,
                pass: myConfig.sftp.dev.pass,
                remotePath: myConfig.sftp.dev.ssiRemotePath + viewName
            }))

    })
})

gulp.task('pub', function () {
    var argv = require('yargs').argv,
        filename = argv.page,
        env = argv.env || 'beta';

    if (!filename) {
        console.log('请设置入口名称');
        return;
    }
    console.log('generate publish order...')
//    var filelist = glob.sync(distPath + viewName +'/'+filename+'.*');
    var filelist = glob.sync(distPath + viewName + '/' + filename + '.*.*.*')
    var htmllist = glob.sync(distPath + viewName + '/' + filename + '.html');

    filelist = filelist.concat(htmllist)
    /*    var inclist = glob.sync(incPath + viewName +'*/
    /**/
    /*'+filename+'.html');
     console.log(inclist);
     filelist = filelist.concat(inclist);*/
    var publist = [];
    filelist.forEach(function (value) {
        var file = path.basename(value);
        publist.push('/usr/local/project/htdocs/static/wp/dist/' + viewName + '/' + file);
    })

    publist.push('/usr/local/project/htdocs/static/sinclude/wp/' + viewName + '/cssi/' + filename + '.html');
    publist.push('/usr/local/project/htdocs/static/sinclude/wp/' + viewName + '/jsi/' + filename + '.html');

    console.log(publist)
    var title = '【NEXT】-' + '项目：' + viewName + '模块：' + filename;
    publish(publist, title, env);

})


gulp.task('w', ['upload-ssi-dev'], function () {
    gulp.watch('../**', ['upload-ssi-dev'])
})

gulp.task('d', ['upload-ssi-dev']);

gulp.task('b', ['upload-ssi-build']);


// 清除多余文件
gulp.task('clean', function () {
    return gulp.src([distPath + viewName + '/', incPath + viewName + '/'], {read: false})
        .pipe(clean({force: true}))
})

// 上传到dev服务器
gulp.task('upload-dev', ['webpack-dev'], function () {

    return gulp.src(distPath + viewName + '/**')
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
    return gulp.src(distPath + viewName + '/*.*')
        .pipe(sftp({
            host: myConfig.sftp.dev.host,
            port: myConfig.sftp.dev.port,
            user: myConfig.sftp.dev.user,
            pass: myConfig.sftp.dev.pass,
            remotePath: myConfig.sftp.dev.staticRemotePath + viewName
        }))
})

gulp.task('upload-ssi-build', ['upload-build'], function () {
    return gulp.src(incPath + viewName + '/**/*')
        .pipe(sftp({
            host: myConfig.sftp.dev.host,
            port: myConfig.sftp.dev.port,
            user: myConfig.sftp.dev.user,
            pass: myConfig.sftp.dev.pass,
            remotePath: myConfig.sftp.dev.ssiRemotePath + viewName
        }))
})

// 打包压缩
gulp.task('webpack-dev', ['clean'], function (cb) {
    var entryFiles = glob.sync(pagesDir + '/*.{js,jsx}')
    var map = {}
    var chunks = []
    console.log(entryFiles)
    _.forEach(entryFiles, function (filePath) {
        var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
//        var filename = getName(filePath)
        console.log(filename)
        map[filename] = filePath
        chunks.push(filename)
    });

    wpTask('dev', map, cb)
})

gulp.task('webpack-build', ['clean'], function (cb) {
    var entryFiles = glob.sync(pagesDir + '/*.{js,jsx}')
    var map = {}
    var chunks = []
    _.forEach(entryFiles, function (filePath) {
        var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
//        var filename = getName(filePath)
        map[filename] = filePath
        chunks.push(filename)
    });
    wpTask('build', map, cb)
})

//创建发布单
gulp.task('test', function () {
    var filename = 'a';
    var farr = glob.sync(distPath + viewName + '/' + filename + '.*.*.*')
    var farr2 = glob.sync(distPath + viewName + '/' + filename + '.html');

    console.log(farr.concat(farr2));
})


function wpTask(env, map, cb) {
    var webpackConf = {}
    if (env == 'build') {
        webpackConf = require('../../js_config/webpack.js.prod.conf.js');
    } else {
        webpackConf = require('../../js_config/webpack.js.dev.conf.js')
    }

    webpackConf.entry = map;
    webpackConf.output.path = path.resolve(__dirname, '../../dist/') + sep + viewName;
    webpackConf.output.publicPath = myConfig.static.publicPath + viewName + '/';

    webpackConf.env = env;
    generateSinclude(webpackConf, map, env);


    //console.log(webpackConf);
    webpack(webpackConf, function (err, stats) {
        console.log(err)
        if (err) throw new gutil.PluginError('build', err)
        gutil.log('[build]', stats.toString({
            colors: true
        }));
        cb()
    })
}

//发布单
function publish(filelist, title, env) {
    var request = require('request');
    var string = filelist.join('\n');

    var j = request.jar();
    var cookie = request.cookie('user=' + myConfig.mipname);

    var url = "http://oa.midea.com/index.php/publish/newPublishForNode";
    j.setCookie(cookie, url);
    request.post({
        url: url,
        jar: j,
        method: 'get',
        qs: {
            title: title,
            id: 2,
            from: 'dev',
            to: env,
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
}