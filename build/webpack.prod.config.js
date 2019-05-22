var path = require("path");
var webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");
const envConf = require("../config/prod.env");
const rules = require("../config/rules");

// analyz
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "../dist"),
    publicPath: "/webapp/forum/",
    filename: "[name].[hash].js"
  },
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
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      "process.env": envConf
    }),
    new webpack.LoaderOptionsPlugin({ minimize: true }),
    new HtmlWebpackPlugin({template: path.resolve(__dirname, './template.html')}),
    new BundleAnalyzerPlugin({
      analyzerMode: "server",
      analyzerHost: "127.0.0.1",
      analyzerPort: 8889,
      reportFilename: "report.html",
      defaultSizes: "parsed",
      openAnalyzer: true,
      generateStatsFile: false,
      statsFilename: "stats.json",
      statsOptions: null,
      logLevel: "info"
    })
  ]
};

module.exports.mode = "production";
console.info("您正在发布生产版本...");
