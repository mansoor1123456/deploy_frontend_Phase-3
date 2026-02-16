export interface ApiError {
  code: string;
  message: string;
  details?: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}