import router from '@/router';
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';

// --- Auth Utilities ---
export const logout = (message?: string) => {
  localStorage.removeItem('token');
  // Clear other session data if needed
  if (message) ElMessage.warning(message);
  router.push({ path: '/login' }); // Ensure this matches your login route name or path
};

const instance = axios.create({
  baseURL:
    import.meta.env.MODE === 'production'
      ? window.api.url
      : (import.meta.env.VITE_SERVER_BASE_URL as string),
  timeout: 10000,
});

instance.defaults.headers['Content-Type'] = 'application/json';

// --- Request Interceptor ---
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// --- Response Interceptor ---
instance.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return response;
    }
    return Promise.reject(response);
  },
  (error) => {
    if (error.response) {
      const { status, config } = error.response;

      const isExternal =
        config.url.includes('github.com') ||
        config.url.includes('amap.com') ||
        config.url.includes('tianditu.gov.cn') ||
        config.url.startsWith('/github') ||
        config.url.startsWith('/api') ||
        config.url.startsWith('/td');

      switch (status) {
        case 401:
          if (!isExternal) {
            logout('Session expired, please login again.');
          }
          break;
        case 403:
          if (!isExternal) {
            ElMessageBox.confirm('Login expired, do you want to stay on this page or login again?', 'System Hint', {
              confirmButtonText: 'Relogin',
              cancelButtonText: 'Cancel',
              type: 'warning',
            }).then(() => {
              logout();
            });
          } else {
            console.warn('External API Forbidden:', config.url);
          }
          break;
        case 404:
          ElMessage.error('API endpoint not found');
          break;
        case 500:
          ElMessage.error('Internal server error');
          break;
        default:
          ElMessage.error(`Request failed: ${status}`);
      }
    } else if (!window.navigator.onLine) {
      ElMessage.error('Network disconnected');
    } else {
      ElMessage.error(error.message || 'Request Error');
    }
    return Promise.reject(error);
  },
);

export default instance;
