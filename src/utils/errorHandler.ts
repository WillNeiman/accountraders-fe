export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: unknown, showToast: (msg: string) => void) => {
  if (error instanceof AppError) {
    showToast(error.message);
  } else if (error instanceof Error) {
    showToast('알 수 없는 오류가 발생했습니다');
  } else {
    showToast('알 수 없는 오류가 발생했습니다');
  }
};

export const withErrorHandling = <T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T
): ((...args: Parameters<T>) => Promise<unknown>) => {
  return async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, () => {});
      throw error;
    }
  };
}; 