import { Document } from "mongoose";
import validator from "validator";
import { ErrorMessage, Request, Response, NextFunction } from "../src/types";
export interface IRequestDocument extends Document {
  photo: string;
  language: string;
  name: string;
  middleName?: string;
  surname: string;
  username?: string;
  email?: string;
  phone?: string;
  password: string;
  refCode?: string;
}

const schemas = {
  title: "Register",
  description: "Create new user",
  groups: ["auth"],
  request: {
    title: "Register",
    description: "Create new user",
    schema: {
      photo: { type: String, default: "/defaults/profile.png", required: true },
      language: {
        type: String,
        enum: ["en", "tr", "ru"],
        default: "en",
      },
      name: {
        type: String,
        required: true,
      },
      middleName: {
        type: String,
      },
      surname: {
        type: String,
        required: true,
      },
      username: {
        type: String,
        required(this: IRequestDocument) {
          return !this.email && !this.phone;
        },
      },
      email: {
        type: String,
        required(this: IRequestDocument) {
          return !this.username && !this.phone;
        },
        validate: {
          validator: (value: string) => validator.isEmail(value),
          message: "email",
        },
      },
      phone: {
        type: String,
        required(this: IRequestDocument) {
          return !this.email && !this.username;
        },
        validate: {
          validator: (value: string) =>
            validator.isMobilePhone(value, undefined, { strictMode: true }),
          message: "phone",
        },
      },
      password: {
        type: String,
        required: true,
      },
      refCode: {
        description: "Referral Code",
        type: String,
      },
    },
  },
  response: {
    schemas: {
      "201": {
        title: "User Created",
        description: "If user created successfully",
        schema: { id: { type: String } },
      },
      "400": {
        title: "User not created",
        description: "If user not created",
        schema: { code: { type: String, default: "AUTHX004" } },
      },
      "409": [
        {
          title: "Conflict",
          description: "If email already exists",
          schema: {
            username: { type: String },
            code: { type: String, default: "ERRORx001" },
          },
        },
        {
          title: "Conflict",
          description: "If username already exists",
          schema: {
            username: { type: String },
            code: { type: String, default: "ERRORx001" },
          },
        },
      ],
    },
  },
};

const options = {
  filter: {
    request: true,
    response: true,
  },
  validate: {
    request: true,
    response: true,
  },
  onReqError(
    _req: Request,
    _res: Response,
    next: NextFunction,
    message: ErrorMessage
  ) {
    next(message);
  },
  onResError(
    _req: Request,
    res: Response,
    _next: NextFunction,
    message: ErrorMessage
  ) {
    res.send({
      message: "Please contact the development team",
      code: message.code,
    });
  },
};

export default { schemas, options };
