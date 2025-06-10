export interface ErrorLog {
  id: number;
  timestamp: string;
  level: string;
  loggerName: string;
  threadName: string;
  errorMessage: string;
  rawLog: string;
}
