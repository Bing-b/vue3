import router from "@/router";
import axios from "axios"
// import qs from "qs"

// 配置开发&生产环境接口，根据 node 环境变量来进行判断
const devBaseURL = '/';
const proBaseURL = 'http://prod.xxxx';
const baseURL = process.env.NODE_ENV === "development" ? devBaseURL : proBaseURL;

const instance = axios.create({
  baseURL: baseURL,
  timeout: 5000, // 设置超时时间
  withCredentials: true // 设置是否允许跨域传递的 cookie 携带凭证
})

// 配置请求参数传递格式，默认是JSON格式，根据服务器决定
instance.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
//instance.defaults.transformRequest = data => qs.stringify(data)

// 配置 axios 请求拦截器, 配置 token 登录认证
instance.interceptors.request.use(
  config => {
    // 配置每次发送请求之前判断是否存在 token,存在则在请求头 header 上添加 token,
    let token = localStorage.getItem('token');
    token && (config.headers.Authorization = token);
    return config;
  },
  error => {
    return Promise.reject(error)
  }
)

// 配置 axios 响应拦截器
instance.interceptors.response.use(
  // 判断返回状态码，进行对应的数据返回与异常抛出操作
  response => {
    if(response.status === 200) {
      return Promise.resolve(response)
    }else {
      return Promise.reject(response)
    }
  },
  // 配置服务器状态码不是200的情况
  error => {
    if(error.response) {
      switch(error.response.status) {
        // 401: 未登录
        case 401: 
          localStorage.removeItem('token');
          alert('连接超时，请重新登录');
          router.push({path: '/'});
          break
        // 403： 登录过期
        case 403:
          alert('登录过期，请重新登录');
          localStorage.removeItem('token');
          router.push({path: '/'});
          break
        // 404: 请求不存在
        case 404: 
          alert('网络请求不存在');
          break
        // 500: 服务错误
        case 500:
          alert('网络请求有误');
        default:
          alert('服务错误');
      }
      //return Promise.reject('服务错误')
    }else {
      // 配置服务器没有返回结果情况
      if(!window.navigator.onLine) {
        // 断网情况，进行断网处理
        return
      }
      return Promise.reject(error)
    }
  }
)

export default instance
