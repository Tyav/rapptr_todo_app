export enum ErrorCode {
  BAD_REQUEST = 'BAD_REQUEST',
  FORBIDDEN = 'FORBIDDEN',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  CONFLICT = 'CONFLICT',
}

export type IErrorData = string | Array<string | Record<string, string|number>> | Record<string, string|number> | Error | Record<string, (string|number)[]>
export interface IError extends Partial<Error> {
  code: string
  message: string
  data: IErrorData
}
