import { Model, Document, MongooseError } from "mongoose";
import { e, Request, Response, NextFunction } from "express-serve-static-core";
import path from "path";

type Express = e;

interface Permissions {
  [key: string]: {
    [key: string]: boolean;
  };
}

export interface ErrorMessage {
  code: string;
  message: string;
  fields?: string[];
  error?: any;
  statusCode?: number;
}
export type ErrorHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
  message: ErrorMessage
) => void;
export interface Options {
  auth?: (
    req: Request
  ) => Promise<boolean | Permissions> | boolean | Permissions;
  permissions?: { [key: string]: string[] };
  schemaKey?: string;
  filter?: {
    request?: boolean;
    response?: boolean;
  };
  validate?: {
    request?: boolean;
    response?: boolean;
  };
  onReqError?: ErrorHandler;
  onResError?: ErrorHandler;
  onACLError?: ErrorHandler;
  $error?: (any) => void;
}

export interface StrictOptions extends Options {
  schemaKey: string;
  filter: {
    request: boolean;
    response: boolean;
  };
  validate: {
    request: boolean;
    response: boolean;
  };
}

interface DocObject {
  title?: string;
  description?: string;
  schema: any;
}

export type ResponseSchema = {
  [statusCode: string]: DocObject | Array<DocObject>;
};

export interface Schemas {
  title?: string;
  description?: string;
  groups?: string[];
  request: DocObject;
  response: {
    title?: string;
    description?: string;
    schemas: ResponseSchema;
  };
}

export interface DTOParams {
  schemas: Schemas;
  options?: Options;
}

export {
  Express,
  Request,
  Response,
  NextFunction,
  Model,
  Document,
  MongooseError,
};

type RouteFN<T> = (
  dto: DTOParams,
  ...args: RequestHandler | RequestHandler[]
) => T;

type RouterFN<T> = (
  path: string,
  dto: DTOParams,
  ...args: RequestHandler | RequestHandler[]
) => T;

export type ISend<ResBody = any, T = Response<ResBody>> = (
  body?: ResBody
) => Promise<T> | T;

declare module "express-serve-static-core" {
  export interface Application {
    $post: RouterFN<Application>;
    $put: RouterFN<Application>;
    $patch: RouterFN<Application>;
    $get: RouterFN<Application>;
    $delete: RouterFN<Application>;
  }

  export interface IRouter {
    $post: RouterFN<IRouter>;
    $put: RouterFN<IRouter>;
    $patch: RouterFN<IRouter>;
    $get: RouterFN<IRouter>;
    $delete: RouterFN<IRouter>;
  }

  export interface IRoute {
    $post: RouteFN<IRoute>;
    $put: RouteFN<IRoute>;
    $patch: RouteFN<IRoute>;
    $get: RouteFN<IRoute>;
    $delete: RouteFN<IRoute>;
  }

  export interface Response {
    $send: ISend<any, this>;
    $json: ISend<any, this>;
    $error: (any) => void;
  }
}
