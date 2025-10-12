export class ApiError extends Error {
  status?: number;
  code?: string | number;

  constructor(message: string, status?: number, code?: string | number) {
    super(message);
    this.status = status;
    this.code = code;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
