import { NextFunction, Request, Response } from "express";
import { ErrorCode, IError, IErrorData } from "../interfaces/error.interface";
import Joi, { ValidationError } from "joi";

const { isError: isJoiError } = Joi;

export class UnauthorizedAccess implements IError {
  code: string;
  message: string;
  data: IErrorData;

  constructor (error: Partial<IError>) {
    this.code = ErrorCode.UNAUTHORIZED_ACCESS;
    this.message = error.message ?? 'Unauthorized access';
    this.data = error.data as IErrorData;
  }
}
export class BadRequest implements IError {
  code: string;
  message: string;
  data: IErrorData;

  constructor (error: Partial<IError>) {
    this.code = ErrorCode.BAD_REQUEST;
    this.message = error.message ?? 'Some important parameters might be missing';
    this.data = error.data as IErrorData;
  }
}
export class ResourceNotFound implements IError {
  code: string;
  message: string;
  data: IErrorData;

  constructor (error: Partial<IError>) {
    this.code = ErrorCode.RESOURCE_NOT_FOUND;
    this.message = error.message ?? 'Resource not found';
    this.data = error.data as IErrorData;
  }
}
export class ForbiddenAccess implements IError {
  code: string;
  message: string;
  data: IErrorData;

  constructor (error: Partial<IError>) {
    this.code = ErrorCode.FORBIDDEN;
    this.message = error.message ?? 'Not permitted';
    this.data = error.data as IErrorData;
  }
}
export class Conflict implements IError {
  code: string;
  message: string;
  data: IErrorData;

  constructor (error: Partial<IError>) {
    this.code = ErrorCode.CONFLICT;
    this.message = error.message ?? 'There was a conflict performing your request';
    this.data = error.data as IErrorData;
  }
}
export class ServerError implements IError {
  code: string;
  message: string;
  data: IErrorData;

  constructor (error: Partial<IError>) {
    this.code = ErrorCode.SERVER_ERROR;
    this.message = error.message ?? 'An unexpected internal server error occurred';
    this.data = error.data as IErrorData;
  }
}

/**
 * Creates a formatted error object from error resulting from joi validation
 */
const customJoiErrorData = (errors: ValidationError) => {
  // input
  const errorData: { [key: string]: string } = {};
  // create an array from errors.details
  return Array.from(errors.details).reduce((acc, detail) => {
    const { message } = detail;
    const key = detail.context?.key as string;
    if (key) {
      // this removes the un-need (") in the message string
      acc[key] = message?.replace(/"/g, '') as string;
    }
    /**
     * you can add custom messages here
     * 
     * if (key === 'phone') acc[key] = 'Phone number must be a valid number!';
     */ 
    return acc;
  }, errorData);
};

/*
 * If error is an instance of JoiError, convert it and let HandleErrorResponse fulfill the response
 */
export const errorConverter = (err: IError, _req: Request, res: Response, next: NextFunction) => {
  let convertedError = err;
  if (isJoiError(err)) {
    convertedError = new BadRequest({
      message: 'Invalid fields',
      data: customJoiErrorData(err) || {},
    });
  }
  if (!err) {
    return next();
  }
  return HandleErrorResponse(convertedError, res);
};

/**
 * Handle unknown route with not found error 
 */
export const notFoundHandler = ( _req: Request, _res: Response, next: NextFunction) => {
  next(new ResourceNotFound({ message: 'Resource not found'}));
};

export const HandleErrorResponse = (err: any, res: Response) => {
  
  switch (err.code) {
    case ErrorCode.FORBIDDEN:
      return res.status(403).json(new ForbiddenAccess(err));
    case ErrorCode.BAD_REQUEST:
      return res.status(400).json(new BadRequest(err));
    case ErrorCode.RESOURCE_NOT_FOUND:
      return res.status(404).json(new ResourceNotFound(err));
    case ErrorCode.UNAUTHORIZED_ACCESS:
      return res.status(401).json(new UnauthorizedAccess(err));
    case ErrorCode.CONFLICT:
      return res.status(409).json(new Conflict(err));
    default: {
      return res.status(500).json(new ServerError(err));
    }
    }
}