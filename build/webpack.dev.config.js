var path = require("path");
var webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");
const envConf = require("../config/dev.env");
const rules = require("../config/rules");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./dist/"), // dev-server会在内存中当前目录下生成dist文件
    publicPath: "./", 
    filename: "[name].[hash]].js"
  },
  devServer: {
    contentBase: path.resolve(__dirname, './dist'), // 指定到生成的虚拟目录dist下
    publicPath: '/',
    historyApiFallback: true,
    noInfo: true,
    overlay: true,
    disableHostCheck: true,
    host: JSON.parse(envConf.SERVER_HOST),
    proxy: {
      "/api/*": {
        target: "http://localhost:5000/",
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({ "process.env": envConf }),
    new HtmlWebpackPlugin({template: path.resolve(__dirname, './template.html')})
  ],
  module: {
    rules: rules
  },
  resolve: {
    extensions: [".ts", ".js", ".vue", ".json"],
    alias: {
      vue$: "vue/dist/vue.esm.js",
      "@": path.resolve(__dirname, "../src")
    }
  },
  performance: {
    hints: false
  },
  devtool: "#source-map",
  cache: true,

  externals: {
    vue: "Vue",
    "element-ui": "ELEMENT"
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: "initial",
          test: path.resolve(process.cwd(), "node_modules"),
          name: "vendor",
          enforce: true
        }
      }
    }
  }
};

module.exports.mode = "development";
console.info("当前版本为开发环境...");
console.info(`open address ${envConf.SERVER_HTTP}`);
