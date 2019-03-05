
var path = require('path')
var webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const EnvConfs = require('./env.config.json');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  module: {
    rules: [
      { test: /\.pug$/, use: ['pug-plain-loader'] },
      { test: /\.css$/, use: ['vue-style-loader', 'css-loader'] },
      { test: /\.less$/, use: ['css-loader', 'less-loader'] },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
          }
        }
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: { appendTsSuffixTo: [/\.vue$/] }
      },
      {
        test: /\.(png|jpg|gif|svg|ttf|woff)$/,
        loader: 'file-loader',
        options: { name: '[name].[ext]?[hash]' }
      },
      { test: /\.js$/, use: ["babel-loader"], exclude: /node_modules/ }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, 'src')
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true,
    host: EnvConfs.DEV_HOST,
    proxy: {
      '/api/*': {
        target: `http://${EnvConfs.DEV_HOST}:5500/`,
        changeOrigin: true,
        secure: false
      }
    }
  },
  performance: {
    hints: false
  },
  devtool: '#source-map',
  cache: true,

  externals: {
    'vue': 'Vue',
    'element-ui': 'ELEMENT',
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.EnvironmentPlugin(EnvConfs)
  ]
}

var isProduction = process.env.NODE_ENV == 'production';
var isDevelopment = 'development' == process.env.NODE_ENV;
var isTest = process.env.NODE_ENV == 'test';

if (isProduction) {
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.LoaderOptionsPlugin({ minimize: true }),
  ]);
  module.exports.mode = "production";
  console.info('您正在发布生产版本...');

} else if (isTest) {
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.LoaderOptionsPlugin({ minimize: true }),
    new BundleAnalyzerPlugin()
  ]);
  module.exports.mode = "production";
  console.info('您正在发布测试版本...');

} else if (isDevelopment) {
  module.exports.mode = "development";
  
  module.exports.optimization = {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: "initial",
          test: path.resolve(process.cwd(), "node_modules"),
          name: "vendor",
          enforce: true
        },
      }
    }
  }

  console.info('当前版本为开发环境...');
} else {
  console.warn('似乎没指定发布环境...?');
  module.exports.mode = "none";
}