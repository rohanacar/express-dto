import { Model, Document, MongooseError } from "mongoose";
import {
  e,
  RequestHandler,
  RequestHandlerParams,
  Request,
  Response,
  NextFunction,
  IRoute,
} from "express-serve-static-core";
type Express = e;
type Methods = "get" | "post" | "patch" | "put" | "delete";
type DTOMethod = (
  DTOParams,
  DTOParams,
  DTOParams,
  ...handlers: any[]
) => IRoute;

interface DTORouterHandler<T, Route extends string = string> {
  (DTOParams, ...handlers: Array<RequestHandler<RouteParameters<Route>>>): T;
  (
    DTOParams,
    ...handlers: Array<RequestHandlerParams<RouteParameters<Route>>>
  ): T;
  <
    P = RouteParameters<Route>,
    ResBody = any,
    ReqBody = any,
    ReqQuery = ParsedQs,
    LocalsObj extends Record<string, any> = Record<string, any>
  >(
    DTOParams,
    ...handlers: Array<RequestHandler<P, ResBody, ReqBody, ReqQuery, LocalsObj>>
  ): T;
  <
    P = RouteParameters<Route>,
    ResBody = any,
    ReqBody = any,
    ReqQuery = ParsedQs,
    LocalsObj extends Record<string, any> = Record<string, any>
  >(
    DTOParams,
    ...handlers: Array<
      RequestHandlerParams<P, ResBody, ReqBody, ReqQuery, LocalsObj>
    >
  ): T;
  <
    P = ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    ReqQuery = ParsedQs,
    LocalsObj extends Record<string, any> = Record<string, any>
  >(
    DTOParams,
    ...handlers: Array<RequestHandler<P, ResBody, ReqBody, ReqQuery, LocalsObj>>
  ): T;
  <
    P = ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    ReqQuery = ParsedQs,
    LocalsObj extends Record<string, any> = Record<string, any>
  >(
    DTOParams,
    ...handlers: Array<
      RequestHandlerParams<P, ResBody, ReqBody, ReqQuery, LocalsObj>
    >
  ): T;
}

interface DTORouterMatcher<
  T,
  Method extends "get" | "post" | "put" | "delete" | "patch" = any
> {
  <
    Route extends string,
    P = RouteParameters<Route>,
    ResBody = any,
    ReqBody = any,
    ReqQuery = ParsedQs,
    LocalsObj extends Record<string, any> = Record<string, any>
  >(
    path: Route,
    DTOParams,
    ...handlers: Array<RequestHandler<P, ResBody, ReqBody, ReqQuery, LocalsObj>>
  ): T;
  <
    Path extends string,
    P = RouteParameters<Path>,
    ResBody = any,
    ReqBody = any,
    ReqQuery = ParsedQs,
    LocalsObj extends Record<string, any> = Record<string, any>
  >(
    path: Path,
    DTOParams,
    ...handlers: Array<
      RequestHandlerParams<P, ResBody, ReqBody, ReqQuery, LocalsObj>
    >
  ): T;
  <
    P = ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    ReqQuery = ParsedQs,
    LocalsObj extends Record<string, any> = Record<string, any>
  >(
    path: PathParams,
    DTOParams,
    ...handlers: Array<RequestHandler<P, ResBody, ReqBody, ReqQuery, LocalsObj>>
  ): T;
  <
    P = ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    ReqQuery = ParsedQs,
    LocalsObj extends Record<string, any> = Record<string, any>
  >(
    path: PathParams,
    DTOParams,
    ...handlers: Array<
      RequestHandlerParams<P, ResBody, ReqBody, ReqQuery, LocalsObj>
    >
  ): T;
  (path: PathParams, subApplication: Application): T;
}

export type ISend<ResBody = any, T = Response<ResBody>> = (
  body?: ResBody
) => Promise<T> | T;
declare module "express-serve-static-core" {
  export interface IRouter {
    $post: DTORouterMatcher<this, "post">;
    $patch: DTORouterMatcher<this, "patch">;
    $put: DTORouterMatcher<this, "put">;
    $get: DTORouterMatcher<this, "get">;
    $delete: DTORouterMatcher<this, "delete">;
  }
  export interface IRoute {
    $post: DTORouterHandler<this, Route>;
    $patch: DTORouterHandler<this, Route>;
    $put: DTORouterHandler<this, Route>;
    $get: DTORouterHandler<this, Route>;
    $delete: DTORouterHandler<this, Route>;
  }
  export interface Application {
    $post: DTORouterMatcher<this, "post">;
    $patch: DTORouterMatcher<this, "patch">;
    $put: DTORouterMatcher<this, "put">;
    $get: DTORouterMatcher<this, "get">;
    $delete: DTORouterMatcher<this, "delete">;
  }

  export interface Response {
    $send: ISend<ResBody, this>;
    $json: ISend<ResBody, this>;
  }
}

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
  onReqError?: (
    req: Request,
    res: Response,
    next: NextFunction,
    message: ErrorMessage
  ) => void;
  onResError?: (
    req: Request,
    res: Response,
    next: NextFunction,
    message: ErrorMessage
  ) => void;
  onACLError?: (
    req: Request,
    res: Response,
    next: NextFunction,
    message: ErrorMessage
  ) => void;
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
  options: Options;
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
