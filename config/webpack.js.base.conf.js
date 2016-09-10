var path = require('path')
var nodeModPath = path.resolve(__dirname, '../node_modules')
var pathMap = Object.assign({
    'commonjs':path.join(__dirname,'../src/common/js')
})
module.exports = {
  entry: {},
  output: {
    path: path.resolve(__dirname, '../dist/'),
    //publicPath: '//g.mdcdn.cn/wp/dist/' // 静态文件地址
  },
  resolve: {
    extensions: ['', '.js', '.vue','.jsx'],
    alias: pathMap,
    root: [nodeModPath,path.join(__dirname,'../src/common/js'),path.join(__dirname,'../src/common/js/func'),path.join(__dirname,'../src/common/js/ui')]
  },
  // externals: {
  //     'zepto': 'Zepto',
  //     'jquery': 'jQuery'
  // },
/*  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },*/
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.jsx?$/,
        // loader: 'babel!eslint',
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: './img/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.jsx$/,
        loaders: ['jsx?harmony']
      },
      {
        test: /\.ma$/,
        loader: 'mustache'
        // loader: 'mustache?minify'
        // loader: 'mustache?{ minify: { removeComments: false } }'
        // loader: 'mustache?noShortcut'
      }
    ]
  },
  vue: {
    loaders: {
      // js: 'babel!eslint'
      js: 'babel'
    }
  },
  eslint: {
    formatter: require('eslint-friendly-formatter')
  }
}
