module.exports = [
  { test: /\.pug$/, use: ["pug-plain-loader"] },
  { test: /\.less$/, use: ["style-loader", "css-loader", "less-loader"] },
  { test: /\.css$/, use: ["vue-style-loader", "css-loader", "postcss-loader"] },
  {
    test: /\.vue$/,
    loader: "vue-loader",
    options: {
      loaders: {
        scss: "vue-style-loader!css-loader!sass-loader",
        sass: "vue-style-loader!css-loader!sass-loader?indentedSyntax"
      }
    }
  },
  {
    test: /\.tsx?$/,
    loader: "ts-loader",
    exclude: /node_modules/,
    options: { appendTsSuffixTo: [/\.vue$/] }
  },
  {
    test: /\.(png|jpg|gif|svg|ttf|woff)$/,
    loader: "file-loader",
    options: { name: "[name].[ext]?[hash]" }
  },
  {
    test: /\.js$/,
    use: ["babel-loader"],
    exclude: /node_modules/
  }
];
