const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

function resolve(dir) {
  return path.resolve(__dirname, dir);
}

module.exports = {
  // 入口文件
  entry: './src/app.js',
  // 编译输出文件
  output: {
    path: resolve('./'),
    filename: 'build.js'
  },
  resolve: {
    alias: {
      // 因为我们这里用的是 require 引入方式，所以应该使用vue.common.js/vue.js/vue.min.js
      'vue$': 'vue/dist/vue.common.js'
    }
  },
  devServer: {
    // 这里定义 webpack-dev-server 开启的web服务的根目录
    contentBase: resolve('./')
  },
  module: {
    // 这里用来配置处理不同后缀文件所使用的loader
    rules: [
      {
        test: /.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: [
              {
                loader: 'vue-style-loader'
              },
              {
                loader: 'css-loader'
              },
              {
                loader: 'sass-loader'
              },
              {
                loader: 'sass-resources-loader',
                options: {
                  resources: [resolve('./src/styles/_var.scss')]
                }
              }
            ],
            docs: ExtractTextPlugin.extract('raw-loader')
          }
        }
      },
      {
        test: /.js$/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('docs.md')
  ]
}
