'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

let conf = {
  NODE_ENV: 'development',
  // SERVER_HOST: '192.168.3.50', // 服务器IP或域名
  SERVER_HOST: '192.168.3.80', // 服务器IP或域名
  // SERVER_HOST: '192.168.31.150',
  SERVER_PORT: '8080', // 服务器端口号 80端口也要写
  SERVER_SCHEMA: 'http', // 请求协议
};

conf.SERVER_HTTP = `${conf.SERVER_SCHEMA}://` +
  `${conf.SERVER_HOST}${conf.SERVER_PORT == '80' ? '' : ':' + conf.SERVER_PORT}` +
  `/`;

for (let key in conf) {
  conf[key] = JSON.stringify(conf[key]);
}

module.exports = merge(prodEnv, conf);
