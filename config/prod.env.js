'use strict'

let conf = {
  NODE_ENV: '"production"',
  SERVER_HOST: 'jianbeixm.com', // 服务器IP或域名
  SERVER_PORT: '80', // 服务器端口号 80端口也要写
  SERVER_SCHEMA: 'http', // 请求协议
  WEBSITE_NAME: '树洞-健蓓医疗',
};

/**
 * 服务器地址全路径
 */
conf.SERVER_HTTP = `${conf.SERVER_SCHEMA}://`+
                   `${conf.SERVER_HOST}${conf.SERVER_PORT == '80' ? '' : ':' + conf.SERVER_PORT}`+
                   `/`

for(let key in  conf){
  conf[key] = JSON.stringify(conf[key]);
}

module.exports = conf;
