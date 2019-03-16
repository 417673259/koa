const axios = require('axios');

const instance = axios.create({
  timeout: 5000,
});

instance.interceptors.request.use((config) => {
  if (typeof window === 'undefined') {
    return {
      ...config,
      url: `http://localhost:4000${config.url}`,
    };
  }
  return config;
}, (error) => {
  // 对请求错误做些什么
  console.log(error);
  return Promise.reject(error);
});


instance.interceptors.response.use((res) => {
  const { data: { code, data } } = res;
  if (typeof code === 'undefined') {
    return res.data;
  }
  if (code !== 200) {
    return Promise.reject(res.data);
  }

  return data;
}, (err) => {
  Promise.reject(err);
});

module.exports = instance;
