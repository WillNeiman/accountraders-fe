import { AxiosError } from 'axios';

interface ErrorResponse {
  status: number;
  code: string;
  message: string;
}

export const formatErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data as ErrorResponse;
    
    if (responseData?.message) {
      return `${responseData.message}\n[오류코드: ${error.response?.status}]`;
    }
    
    return `요청 처리 중 오류가 발생했습니다.\n[오류코드: ${error.response?.status}]`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return '알 수 없는 오류가 발생했습니다.';
}; 