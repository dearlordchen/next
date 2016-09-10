var webpack = require('webpack')
var config = require('./webpack.js.base.conf')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var devConfig = Object.assign({}, config)

// naming output files with hashes for better caching.
// dist/index.html will be auto-generated with correct URLs.
devConfig.output.filename = '[name].js'
devConfig.output.chunkFilename = '[name].js'


// whether to generate source map for production files.
// disabling this can speed up the build.
var SOURCE_MAP = true

devConfig.devtool = SOURCE_MAP ? 'source-map' : false

// generate loader string to be used with extract text plugin
function generateExtractLoaders (loaders) {
  return loaders.map(function (loader) {
    return loader + '-loader' + (SOURCE_MAP ? '?sourceMap' : '')
  }).join('!')
}

var extractCSS = new ExtractTextPlugin('[name].css?[contenthash]')
var cssLoader = extractCSS.extract(['css'])
var sassLoader = extractCSS.extract(['css', 'sass'])

var cf=[
{test: /\.css$/, loader: cssLoader},
{test: /\.scss$/, loader: sassLoader}
]



devConfig.vue.loaders = {
  // js: 'babel!eslint',
  js: 'babel',
  // http://vuejs.github.io/vue-loader/configurations/extract-css.html
  css: ExtractTextPlugin.extract('vue-style-loader', generateExtractLoaders(['css'])),
  less: ExtractTextPlugin.extract('vue-style-loader', generateExtractLoaders(['css', 'less'])),
  sass: ExtractTextPlugin.extract('vue-style-loader', generateExtractLoaders(['css', 'sass'])),
  stylus: ExtractTextPlugin.extract('vue-style-loader', generateExtractLoaders(['css', 'stylus']))
}

devConfig.module.loaders = devConfig.module.loaders.concat(cf);


devConfig.plugins = (devConfig.plugins || []).concat([
  // http://vuejs.github.io/vue-loader/workflow/production.html
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"development"'
    }
  }),

/*  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }),*/
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin(),

  // extract css into its own file
  extractCSS,
  // generate dist index.html with correct asset hash for caching.
  // you can customize output by editing /build/index.template.html
  // see https://github.com/ampedandwired/html-webpack-plugin
  // new HtmlWebpackPlugin({
  //   filename: '../index.html',
  //   template: 'src/index.html',
  //   chunks: ['app', 'vendor']
  // })

/*    new webpack.ProvidePlugin({
        $: 'zepto',
        JQ: 'jquery'
    })*/
])

module.exports = devConfig
