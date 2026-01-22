import axios from 'axios';
import { message } from 'antd';
import { baseUrl } from '@/config/baseUrl';

/**
 * 基础请求实例配置
 */
const request = axios.create({
    baseURL: `${baseUrl}/api`,
    timeout: 30000,
});

/**
 * 响应拦截器
 * 统一处理业务状态码与基础错误提示
 */
request.interceptors.response.use(
    (response) => {
        const { data } = response;
        if (data.code === 200) {
            return data.data;
        }
        message.error(data.message || '网络请求错误');
        return Promise.reject(new Error(data.message || 'Error'));
    },
    (error) => {
        message.error(error.message || '服务连接失败');
        return Promise.reject(error);
    }
);

export default request;
