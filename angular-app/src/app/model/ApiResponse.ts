export interface ApiResponse<T> {
  status: string;
  state: string;
  message: string;
  data: T;
}
