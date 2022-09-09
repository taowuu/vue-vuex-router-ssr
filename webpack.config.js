// 处理路径
const path = require('path')
// 处理 html
const HTMLPlugin = require('html-webpack-plugin')
// webpack.DefinePlugin
const webpack = require('webpack')
// 非 js 单独打包成静态资源文件
const ExtractPlugin = require('extract-text-webpack-plugin')
// 判断打包环境
// cross-env NODE_ENV=development
const isDev = process.env.NODE_ENV === 'development'

const config = {
  // 编译目标
  target: 'web',
  // 入口文件
  entry: path.join(__dirname, 'src/index.js'),
  // 打包输入的文件
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        // 处理 vue 文件
        loader: 'vue-loader'
      },
      {
        test: /\.jsx$/,
        // 处理 jsx 文件
        loader: 'babel-loader'
      },
      {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        // 处理 图片 文件
        use: [
          {
            loader: 'url-loader',
            // 文件小于 1024 转 base64
            options: {
              limit: 1024,
              name: '[name]-aaa.[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // webpack 打包时选择 vue 的环境
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    }),
    new HTMLPlugin()
  ]
}

if (isDev) {
  config.module.rules.push({
    test: /\.styl/,
    use: [
      'style-loader',
      'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
        }
      },
      // css 预处理
      'stylus-loader'
    ]
  })
  // 调试显示原始代码
  config.devtool = '#cheap-module-eval-source-map'
  config.devServer = {
    port: 8000,
    // 内网其他设备也能访问
    host: '0.0.0.0',
    // 显示编译错误
    overlay: {
      errors: true,
    },
    // 局部热更新
    hot: true
  }
  config.plugins.push(
    // 局部热更新插件
    new webpack.HotModuleReplacementPlugin(),
    // 减少信息展示
    new webpack.NoEmitOnErrorsPlugin()
  )
} else {
  config.entry = {
    app: path.join(__dirname, 'src/index.js'),
    // 库文件单独打包
    vendor: ['vue']
  }
  // chunkhash 生产下使用
  // 每个 chunk 单独一个哈希
  config.output.filename = '[name].[chunkhash:8].js'
  config.module.rules.push(
    {
      test: /\.styl/,
      // 静态文件区分打包
      use: ExtractPlugin.extract({
        fallback: 'style-loader',
        use: [
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            }
          },
          'stylus-loader'
        ]
      })
    },
  )
  config.plugins.push(
    // 静态文件区分打包
    new ExtractPlugin('styles.[contentHash:8].css'),
    // 库文件单独打包
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    // 给新模块加 id 维持长缓存
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime'
    })
  )
}

module.exports = config
