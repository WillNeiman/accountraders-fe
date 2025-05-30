import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // 요청 전에 수행할 작업
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    // 응답 데이터를 가공
    return response;
  },
  (error) => {
    // 오류 응답을 처리
    if (error.response) {
      // 서버가 응답을 반환한 경우
      switch (error.response.status) {
        case 401:
          // 인증 오류 처리
          break;
        case 403:
          // 권한 오류 처리
          break;
        case 404:
          // 리소스를 찾을 수 없는 경우
          break;
        default:
          // 기타 오류 처리
          break;
      }
    }
    return Promise.reject(error);
  }
); 