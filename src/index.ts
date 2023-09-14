import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

import type {
  Express,
  Schemas,
  Options,
  StrictOptions,
  ResponseSchema,
  Model,
  Document,
  Request,
  Response,
  NextFunction,
  DTOParams,
} from "./types";

// Create a new mongoose instance
const instance = new mongoose.Mongoose();
// Disable versionKey and _id
instance.plugin((schema: Schema) => {
  schema.set("versionKey", false);
  schema.set("_id", false);
});

// Set default options
let defaults: StrictOptions = {
  auth: undefined,
  permissions: undefined,
  schemaKey: "$key",
  filter: {
    request: true,
    response: true,
  },
  validate: {
    request: true,
    response: false,
  },
  onReqError: undefined,
  onResError: undefined,
  onACLError: undefined,
};

export default class DTO {
  m = this.middleware.bind(this);
  #options: StrictOptions;
  #requestModel: Model<any> | undefined;
  #responseModels: { [statusCode: string]: Model<any> | Array<Model<any>> } =
    {};

  constructor(schemas: Schemas, options: Options) {
    if (!options) {
      options = {};
    }
    this.#options = {
      ...defaults,
      ...options,
      filter: {
        ...defaults.filter,
        ...options.filter,
      },
      validate: {
        ...defaults.validate,
        ...options.validate,
      },
    };

    if (this.#options.filter.request || this.#options.validate.request) {
      this.#createRequestModel(schemas.request.schema);
    }

    if (this.#options.filter.response || this.#options.validate.response) {
      this.#createResponseModels(schemas.response.schemas);
    }
    return this;
  }

  get #requestOpts() {
    return {
      filter: this.#options.filter.request,
      validate: this.#options.validate.request,
    };
  }

  get #responseOpts() {
    return {
      filter: this.#options.filter.response,
      validate: this.#options.validate.response,
    };
  }

  #isJSONString(str: string) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  #createRequestModel(schema: object) {
    this.#requestModel = instance.model(uuidv4(), new Schema(schema));
  }

  #createResponseModels(schemas: ResponseSchema) {
    Object.entries(schemas).forEach(([key, doc]) => {
      if (Array.isArray(doc)) {
        this.#responseModels[key] = [];
        const arr: Array<Model<any>> = [];
        doc.forEach((item) => {
          arr.push(instance.model(uuidv4(), new Schema(item.schema)));
        });
        this.#responseModels[key] = arr;
      } else {
        this.#responseModels[key] = instance.model(
          uuidv4(),
          new Schema(doc.schema)
        );
      }
    });
  }

  async #validate(doc: Document): Promise<{
    isValid: boolean;
    fields?: string[];
    error?: any;
  }> {
    try {
      await doc.validate();
      return {
        isValid: true,
      };
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        return {
          isValid: false,
          fields: Object.keys(error.errors),
          error,
        };
      }

      return {
        isValid: false,
        error,
      };
    }
  }
  #resValidationFailed(
    req: Request,
    res: Response,
    next: NextFunction,
    payload: {
      fields?: string[];
      error?: Error;
    }
  ) {
    const { fields, error } = payload;
    if (this.#options.onResError) {
      this.#options.onResError(req, res, next, {
        code: "RESx001",
        message: "Response validation failed.",
        fields,
        error,
      });
      return res;
    } else {
      next({
        code: "RESx001",
        message: "Response validation failed.",
        fields,
        error,
      });
      return res;
    }
  }
  #reqValidationFailed(
    req: Request,
    res: Response,
    next: NextFunction,
    payload: {
      fields?: string[];
      error?: Error;
    }
  ) {
    const { fields, error } = payload;
    if (this.#options.onReqError) {
      this.#options.onReqError(req, res, next, {
        code: "REQx001",
        message: "Request validation failed.",
        fields,
        error,
      });
    } else {
      next({
        code: "REQx001",
        message: "Request validation failed.",
        fields,
        error,
      });
    }
  }
  async middleware(req: Request, res: Response, next: NextFunction) {
    if (this.#options.auth) {
      if (typeof this.#options.auth !== "function") {
        if (this.#options.onACLError) {
          return this.#options.onACLError(req, res, next, {
            code: "ACLx002",
            message: "Auth parameter must be a function.",
          });
        }
        return next({
          code: "ACLx002",
          message: "Auth parameter must be a function.",
        });
      }
      const _permissions = await this.#options.auth(req);
      if (typeof _permissions === "object") {
        if (this.#options.permissions) {
          let hasPermission = true;
          Object.entries(this.#options.permissions).forEach(([key, value]) => {
            value.forEach((item) => {
              if (!(_permissions[key] && _permissions[key][item])) {
                hasPermission = false;
              }
            });
          });

          if (!hasPermission) {
            if (this.#options.onACLError) {
              return this.#options.onACLError(req, res, next, {
                code: "ACLx001",
                message: "Access denied.",
              });
            } else {
              return next({
                code: "ACLx001",
                message: "Access denied.",
              });
            }
          }
        }
      } else if (_permissions === false) {
        if (this.#options.onACLError) {
          this.#options.onACLError(req, res, next, {
            code: "ACLx001",
            message: "Access denied.",
          });
        } else {
          next({
            code: "ACLx001",
            message: "Access denied.",
          });
        }
      } else if (_permissions !== true) {
        if (this.#options.onACLError) {
          return this.#options.onACLError(req, res, next, {
            code: "ACLx002",
            message: "Return type must be a boolean or object.",
          });
        }
        return next({
          code: "ACLx002",
          message: "Return type must be a boolean or object.",
        });
      }
    }
    if (this.#responseOpts.filter || this.#responseOpts.validate) {
      const model = this.#responseModels[`${res.statusCode}`];

      const isArray = Array.isArray(model);

      if (!isArray || (isArray && this.#responseOpts.validate)) {
        if (!model || (isArray && !model[0])) {
          if (this.#options.onReqError) {
            this.#options.onReqError(req, res, next, {
              code: "SCHEMAx001",
              message: "Response schema not found.",
              statusCode: res.statusCode,
            });
          } else {
            next({
              code: "SCHEMAx001",
              message: "Response schema not found.",
              statusCode: res.statusCode,
            });
          }
        } else {
          res.$send = async (body: any) => {
            let obj = { [this.#options.schemaKey]: body };
            let isString = true;
            if (this.#isJSONString(body)) {
              obj = JSON.parse(body);
              isString = false;
            }

            if (Array.isArray(model)) {
              const doc: Document[] = model.map((item) => new item(obj));
              if (this.#responseOpts.validate) {
                let validDoc;
                const promises: Promise<any>[] = [];
                doc.forEach((element) => {
                  promises.push(
                    this.#validate(element).then((result) => {
                      if (result.isValid) {
                        validDoc = result;
                        return result;
                      }
                      return result;
                    })
                  );
                });
                const [{ error, fields }] = await Promise.all(promises);
                if (!validDoc) {
                  return this.#resValidationFailed(req, res, next, {
                    fields,
                    error,
                  });
                }
              }
            } else {
              const doc: Document = new model(obj);
              if (this.#responseOpts.validate) {
                const { isValid, fields, error } = await this.#validate(doc);
                if (!isValid) {
                  return this.#resValidationFailed(req, res, next, {
                    fields,
                    error,
                  });
                }
              }
              if (this.#responseOpts.filter) {
                body = doc.toJSON();
                if (isString) {
                  return res.send(body[this.#options.schemaKey]);
                }
                return res.send(body);
              }
            }
            return res.send(body);
          };

          res.$json = function (obj: any) {
            const app = this.app;
            const escape = app.get("json escape");
            const replacer = app.get("json replacer");
            const spaces = app.get("json spaces");
            const body = stringify(obj, replacer, spaces, escape);

            if (!this.get("Content-Type")) {
              this.set("Content-Type", "application/json");
            }

            return res.$send(body);
          };
        }
      }

      if (this.#requestModel) {
        const model = this.#requestModel;
        if (["POST", "PUT", "PATCH"].includes(req.method)) {
          const doc = new model(req.body);
          if (this.#requestOpts.validate) {
            const { isValid, error, fields } = await this.#validate(doc);
            if (!isValid) {
              return this.#reqValidationFailed(req, res, next, {
                fields,
                error,
              });
            }
          }
          if (this.#requestOpts.filter) {
            req.body = doc.toJSON();
          }
          next();
        } else if (["GET", "DELETE"].includes(req.method)) {
          const doc = new model(req.query);
          if (this.#requestOpts.validate) {
            const { isValid, error, fields } = await this.#validate(doc);
            if (!isValid) {
              return this.#reqValidationFailed(req, res, next, {
                fields,
                error,
              });
            }
          }
          if (this.#requestOpts.filter) {
            req.query = doc.toJSON();
          }
          next();
        } else if (this.#options.onReqError) {
          this.#options.onReqError(req, res, next, {
            code: "REQx002",
            message: "Invalid request method.",
          });
        } else {
          next();
        }
      } else {
        next();
      }
    }
  }
}

function stringify(value: any, replacer: any, spaces: any, escape: any) {
  let json =
    replacer || spaces
      ? JSON.stringify(value, replacer, spaces)
      : JSON.stringify(value);

  if (escape && typeof json === "string") {
    json = json.replace(/[<>&]/g, function (c) {
      switch (c.charCodeAt(0)) {
        case 0x3c:
          return "\\u003c";
        case 0x3e:
          return "\\u003e";
        case 0x26:
          return "\\u0026";
        default:
          return c;
      }
    });
  }
}

export const SetDefaults = (options: Options) => {
  if (!options) {
    options = {};
  }
  defaults = {
    ...defaults,
    ...options,
    filter: {
      ...defaults.filter,
      ...options.filter,
    },
    validate: {
      ...defaults.validate,
      ...options.validate,
    },
  };
};

export const Inject = (express: Express, options?: Options) => {
  if (options) {
    SetDefaults(options);
  }
  const { Route, Router, application } = express;
  const methods = ["get", "post", "patch", "put", "delete"];

  methods.forEach((method) => {
    Route.prototype[`$${method}`] = function (dto: DTOParams, ...args: any[]) {
      const { middleware } = new DTO(dto.schemas, dto.options);
      return this[method].call(this, middleware, ...args);
    };

    Router[`$${method}`] = function (
      path: string,
      dto: DTOParams,
      ...args: any[]
    ) {
      const { middleware } = new DTO(dto.schemas, dto.options);
      const route = this.route(path);
      route[method].apply(route, [middleware, ...args]);
      return this;
    };

    application[`$${method}`] = function (
      path: string,
      dto: DTOParams,
      ...args: any[]
    ) {
      const { middleware } = new DTO(dto.schemas, dto.options);
      this.lazyrouter();
      const route = this._router.route(path);
      route[method].apply(route, [middleware, ...args]);
      return this;
    };
  });
};
