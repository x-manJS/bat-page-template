import axios from 'axios'
import util from '@/lib/util'

// 创建一个错误
function errorCreate(msg) {
    const err = new Error(msg)
    errorLog(err)
    throw err
}

// 记录和显示错误
function errorLog(err) {
    // 添加到日志
    //   store.dispatch('d2admin/log/add', {
    //     type: 'error',
    //     err,
    //     info: '数据请求异常'
    //   })
    // 打印到控制台
    //   if (process.env.NODE_ENV === 'development') {
    //     util.log.danger('>>>>>> Error >>>>>>')
    //     console.log(err)
    //   }
    // 显示提示
    alert(err.message);

}

// 创建一个 axios 实例
const service = axios.create({
    //   baseURL: process.env.VUE_APP_API,
    baseURL: process.env.NODE_ENV == 'production' ? '' : `http://${process.env.DEV_HOST}:8080/api/`,

    timeout: 60000 // 请求超时时间
})

/**
 * 把数据转换成x-www-form-urlencoded数据格式
 * @param {} element  数据
 * @param {*} key 
 * @param {*} list 
 */
function JSON_to_URLEncoded(element, key, list) {
    var list = list || [];
    if (typeof element == 'object') {
        for (var idx in element)
            JSON_to_URLEncoded(
                element[idx],
                key ? key + '[' + idx + ']' : idx,
                list
            );
    } else {
        list.push(key + '=' + encodeURIComponent(element));
    }
    return list.join('&');
}


// 请求拦截器
service.interceptors.request.use(
    config => {
        // 在请求发送之前做一些处理
        const token = util.cookies.get('token')
        // 让每个请求携带token-- ['Authorization']为自定义key 请根据实际情况自行修改
        config.headers['Authorization'] = `Bearer ${token}`;
        config.data = JSON_to_URLEncoded(config.data);
        config.headers['content-type'] = 'application/x-www-form-urlencoded';
        return config
    },
    error => {
        // 发送失败
        console.log(error)
        Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    response => {
        // dataAxios 是 axios 返回数据中的 data
        const dataAxios = response.data
        // 这个状态码是和后端约定的
        const { success } = dataAxios
        // 根据 success 进行判断
        if (success === undefined) {
            // 如果没有 success 代表这不是项目后端开发的接口 比如可能是 D2Admin 请求最新版本
            return dataAxios
        } else {
            // 有 success 代表这是一个后端接口 可以进行进一步的判断
            switch (success) {
                case true:
                    // [ 示例 ] success === 0 代表没有错误
                    return dataAxios.result
                case false:
                    // [ 示例 ] 其它和后台约定的 success
                    errorCreate(`${dataAxios.error.message}: ${response.config.url}`)
                    break
                default:
                    // 不是正确的 success
                    errorCreate(`${dataAxios.msg}: ${response.config.url}`)
                    break
            }
        }
    },
    error => {
        if (error && error.response) {
            switch (error.response.status) {
                case 400: error.message = '请求错误'; break
                case 401: error.message = '未授权，请登录'; break
                case 403: error.message = '拒绝访问'; break
                case 404: error.message = `请求地址出错: ${error.response.config.url}`; break
                case 408: error.message = '请求超时'; break
                case 500: error.message = '服务器内部错误'; break
                case 501: error.message = '服务未实现'; break
                case 502: error.message = '网关错误'; break
                case 503: error.message = '服务不可用'; break
                case 504: error.message = '网关超时'; break
                case 505: error.message = 'HTTP版本不受支持'; break
                default: break
            }
        }
        errorLog(error)
        return Promise.reject(error)
    }
)

export default service
