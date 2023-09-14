<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
<br />

<div align="center">
  <h3 align="center">Express DTO Guard</h3>
  <a href="https://xmrsoft.com">Sponsored by xMR Software Solutions</a>
  <br />
  <p align="center">
    This module provides Express middleware for validating requests and responses.
    <br />
    <br />
    <a href="https://github.com/rohanacar/express-dto/blob/main/examples/index.ts">Go Examples</a>
    ·
    <a href="https://github.com/rohanacar/express-dto/issues">Report Bug</a>
    ·
    <a href="https://github.com/rohanacar/express-dto/issues">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
<ol>
  <li>
    <a href="#about-the-project">About The Project</a>
    <ul>
      <li><a href="#built-with">Built With</a></li>
    </ul>
  </li>
  <li>
    <a href="#getting-started">Getting Started</a>
    <ul>
      <li><a href="#installation">Installation</a></li>
    </ul>
  </li>
  <li>
    <a href="#usage">Usage</a>
    <ul>
      <li>
        <a href="#create-dto-file">Create DTO File</a>
        <ul>
          <li><a href="#request-schema">Request Schema</a></li>
          <li><a href="#response-schema">Response Schema</a></li>
          <li><a href="#full-schema-example">Full Schema Example</a></li>
        </ul>
      </li>
      <li>
        <a href="#options">Options</a>
      </li>
      <li>
        <a href="#method-1">Method 1</a>
        <ul>
          <li><a href="#injection-process">Injection process</a></li>
          <li><a href="#with-app">With App</a></li>
          <li><a href="#with-approute">With app.Route</a></li>
          <li><a href="#with-approuter">With app.Router</a></li>
          <li><a href="#with-routerroute">With router.Route</a></li>
        </ul>
      </li>
      <li>
        <a href="#method-2">Method 2</a>
        <ul>
          <li><a href="#middleware-with-app">Middleware With App</a></li>
          <li>
            <a href="#middleware-with-approute">Middleware With app.Route</a>
          </li>
          <li>
            <a href="#middleware-with-approuter">Middleware With app.Router</a>
          </li>
          <li>
            <a href="#middleware-with-routerroute"
              >Middleware With router.Route
            </a>
          </li>
        </ul>
      </li>
    </ul>
  </li>
  <li><a href="#roadmap">Roadmap</a></li>
  <li><a href="#contributing">Contributing</a></li>
  <li><a href="#license">License</a></li>
  <li><a href="#contact">Contact</a></li>
</ol>

</details>

## About The Project

We use the [Mongoose Model.validate()](<https://mongoosejs.com/docs/api/model.html#Model.validate()>) method for validation and the [Mongoose Document.toJSON()](<https://mongoosejs.com/docs/api/document.html#Document.prototype.toJSON()>) method for filtering.
If you have previous experience with Mongoose, this module will be a breeze for you :smile:

We are currently working on further development to enable automatic Swagger integration through DTO schemas.

- Please note that this module can only be used with Express.

### Built With

We express our gratitude to [Mongoose](https://mongoosejs.com) for its excellent validation mechanism. <br>
We thank the [UUID](https://github.com/uuidjs/uuid) team for providing a simple and useful package.

<!-- GETTING STARTED -->

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Installation

```sh
npm install express-dto
```

```sh
yarn add express-dto
```

## Usage

You can utilize this module in two different ways. Examples are provided for both methods.

- The Express-dto module is only applicable to the "POST," "PUT," "PATCH," "GET," and "DELETE" HTTP methods.

#### Method 1

Using Router methods encapsulating Express methods.

```javascript
import express, { Router } from "express";
import { Inject } from "express-dto";

// Your DTO files
import { GetUserDto, UpdateUserDto, AddUserDto } from "./dtos";
import CreateAddressDto from "./createAddress.dto.ts";
import DeleteAddressDto from "./deleteAddress.dto.json";
```

#### Injection process

```javascript
const options = {
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
};

Inject(express, options);
```

#### With app

```javascript
const app = express();

app.$post("/create-user", AddUserDto, (req, res) => {
  res.send(req.body);
});

app.$patch("/update-user", UpdateUserDto, (req, res) => {
  res.send(req.body);
});

app.$put("/add-address", CreateAddressDto, (req, res) => {
  res.send(req.body);
});

app.$get("/get-user", GetUserDto, (req, res) => {
  res.send(req.query);
});

app.$delete("/delete-address", DeleteAddressDto, (req, res) => {
  res.send(req.query);
});
```

#### With app.Route

```javascript
const route = app.route("/user");
route
  .$post(AddUserDto, (req, res) => {
    res.send(req.body);
  })
  .$patch(UpdateUserDto, (req, res) => {
    res.send(req.body);
  })
  .$put(CreateAddressDto, (req, res) => {
    res.send(req.body);
  })
  .$get(GetUserDto, (req, res) => {
    res.send(req.query);
  })
  .$delete(DeleteAddressDto, (req, res) => {
    res.send(req.query);
  });
```

#### With app.Router

```javascript
const router = Router();

router.$post("/create-user", AddUserDto, (req, res) => {
  res.send(req.body);
});

router.$patch("/update-user", UpdateUserDto, (req, res) => {
  res.send(req.body);
});

router.$put("/add-address", CreateAddressDto, (req, res) => {
  res.send(req.body);
});

router.$get("/get-user", GetUserDto, (req, res) => {
  res.send(req.query);
});

router.$delete("/delete-address", DeleteAddressDto, (req, res) => {
  res.send(req.query);
});
```

#### With router.Route

```javascript
const router = new Router();
const route = router.route("/user");
route
  .$post(AddUserDto, (req, res) => {
    res.send(req.body);
  })
  .$patch(UpdateUserDto, (req, res) => {
    res.send(req.body);
  })
  .$put(CreateAddressDto, (req, res) => {
    res.send(req.body);
  })
  .$get(GetUserDto, (req, res) => {
    res.send(req.query);
  })
  .$delete(DeleteAddressDto, (req, res) => {
    res.send(req.query);
  });
```

### Method 2

As a simple Express middleware.

```javascript
import express, { Router } from "express";
import DTO from "express-dto";

// Your DTO files
import { GetUserDto, UpdateUserDto, AddUserDto } from "./dtos";
import CreateAddressDto from "./createAddress.dto.ts";
import DeleteAddressDto from "./deleteAddress.dto.json";
```

#### Middleware With app

```javascript
const app = express();

const { middleware } = new DTO(AddUserDto.schemas, AddUserDto.options);

app.post("/create-user", middleware, (req, res) => {
  res.send(req.body);
});

const { m } = new DTO(UpdateUserDto.schemas);

app.patch("/update-user", m, (req, res) => {
  res.send(req.body);
});

const createAddressDTO = new DTO(CreateAddressDto.schemas);

app.put("/add-address", createAddress.middleware, (req, res) => {
  res.send(req.body);
});

const getUserDTO = new DTO(GetUserDto.schemas);

app.get("/get-user", getUserDTO.m, (req, res) => {
  res.send(req.query);
});

const deleteAddressDTO = new DTO(DeleteAddressDto.schemas);

app.delete("/delete-address", deleteAddressDTO.middleware, (req, res) => {
  res.send(req.query);
});
```

#### Middleware With app.Route

```javascript
const { middleware } = new DTO(AddUserDto.schemas);
const { m } = new DTO(UpdateUserDto.schemas);
const createAddressDTO = new DTO(CreateAddressDto.schemas);
const getUserDTO = new DTO(GetUserDto.schemas);
const deleteAddressDTO = new DTO(DeleteAddressDto.schemas);

const route = app.route("/user");
route
  .$post(middleware, (req, res) => {
    res.send(req.body);
  })
  .$patch(m, (req, res) => {
    res.send(req.body);
  })
  .$put(createAddressDTO.middleware, (req, res) => {
    res.send(req.body);
  })
  .$get(getUserDTO.m, (req, res) => {
    res.send(req.query);
  })
  .$delete(deleteAddressDTO.middleware, (req, res) => {
    res.send(req.query);
  });
```

#### Middleware With app.Router

```javascript
const router = Router();

const { middleware } = new DTO(AddUserDto.schemas);

router.post("/create-user", middleware, (req, res) => {
  res.send(req.body);
});

const { m } = new DTO(UpdateUserDto.schemas);

router.patch("/update-user", m, (req, res) => {
  res.send(req.body);
});

const createAddressDTO = new DTO(CreateAddressDto.schemas);

router.put("/add-address", createAddress.middleware, (req, res) => {
  res.send(req.body);
});

const getUserDTO = new DTO(GetUserDto.schemas);

router.get("/get-user", getUserDTO.m, (req, res) => {
  res.send(req.query);
});

const deleteAddressDTO = new DTO(DeleteAddressDto.schemas);

router.delete("/delete-address", deleteAddressDTO.middleware, (req, res) => {
  res.send(req.query);
});
```

#### Middleware With router.Route

```javascript
const { middleware } = new DTO(AddUserDto.schemas);
const { m } = new DTO(UpdateUserDto.schemas);
const createAddressDTO = new DTO(CreateAddressDto.schemas);
const getUserDTO = new DTO(GetUserDto.schemas);
const deleteAddressDTO = new DTO(DeleteAddressDto.schemas);

const router = new Router();
const route = router.route("/user");

route
  .$post(middleware, (req, res) => {
    res.send(req.body);
  })
  .$patch(m, (req, res) => {
    res.send(req.body);
  })
  .$put(createAddressDTO.middleware, (req, res) => {
    res.send(req.body);
  })
  .$get(getUserDTO.m, (req, res) => {
    res.send(req.query);
  })
  .$delete(deleteAddressDTO.middleware, (req, res) => {
    res.send(req.query);
  });
```

### Options

Settings fields marked "Will be available in the future" are settings fields created for future updates, we recommend that you use them now.

| Field             | Type                  | Default        | Description                                                                        |
| :---------------- | :-------------------- | :------------- | :--------------------------------------------------------------------------------- |
| auth              | function or undefined | undefined      | Checks the user's permission to use the entpoint (Will be available in the future) |
| permissions       | object or undefined   | undefined      | Checks the user's permission to use the entpoint (Will be available in the future) |
| schemaKey         | string                | $key           | Allows you to create schema for non-object responses                               |
| filter            | object                | filterObject   | Sets filtering status.                                                             |
| filter.request    | boolean               | true           | Changes the request body according to the dto definition                           |
| filter.response   | boolean               | false          | Changes the response body according to the dto definition                          |
| validate          | object                | validateObject | Sets validation status.                                                            |
| validate.request  | boolean               | true           | Validate the request body according to the dto definition                          |
| validate.response | boolean               | true           | Validate the response body according to the dto definition                         |
| onReqError        | function or undefined | undefined      | Function to be triggered when request validation error occurs                      |
| onResError        | function or undefined | undefined      | Function to be triggered when response validation error occurs                     |
| onACLError        | function or undefined | undefined      | Function to be triggered when non-permission error occurs                          |

#### Default Option Object

```javascript
{
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
}
```

#### Full Option Example

```javascript
const options = {
  auth: (req) => {
    try {
      req.jwt = null;
      if (!req.headers.auth || typeof req.headers.auth !== "string") {
        return false;
      }

      const auth = req.headers.auth.split(" ");

      if (auth[0] !== "Bearer" || !auth[1]) {
        return false;
      }

      req.jwt = jwt.verify(auth[1], config.jwtKey);

      if (result) {
        return req.jwt.permissions;
      } else {
        return false;
      }
    } catch (err) {
      req.jwt = null;
      return false;
    }
  },
  permissions: {
    user: ["read", "write"], // OR user:'reader'
  },
  schemaKey: "$custom",
  filter: {
    request: true,
    response: true,
  },
  validate: {
    request: true,
    response: true,
  },
  onReqError(req, res, next, message) {
    next(message);
  },
  onResError: (req, res, next, message) => {
    res.status(500).send({
      message: "Please contact the development team",
      code: "001",
    });
  },
  onACLError(req, res, next, message) {
    res.status(401).json({
      message: "You are not authorized",
      code: "002",
    });
  },
};
```

### Methods

#### DTO

```javascript
import DTO from "express-dto";

const { middleware } = new DTO(schemas, options);
```

#### Inject

```javascript
import express from "express";
import { Inject } from "express-dto";

Inject(express, options);
```

#### SetDefaults

```javascript
import { SetDefaults } from "express-dto";

SetDefaults(options);
```

### Create DTO File

```javascript
export default {
  schemas:{
    title: "Register",
    description: "Create new user",
    groups: ["auth"],
    request: requestSchema
    response: responseSchemas
  },
  options: optionObject
}
```

#### Request Schema

```javascript
export default {
  title: "Register",
  description: "Create new user",
  schema: Mongoose.Schema.definition,
};
```

#### Response Schema

```javascript
export default {
  title: "Register",
  description: "Create new user",
  schemas: {
    201: {
      title: "User Created",
      description: "If user created successfully",
      schema: { $key: { type: String } },
    },
    400: {
      title: "User not created",
      description: "If user not created",
      schema: { code: { type: String, default: "AUTHX004" } },
    },
    409: [
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
};
```

#### Full Schema Example

```javascript
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
      201: {
        title: "User Created",
        description: "If user created successfully",
        schema: { id: { type: String } },
      },
      400: {
        title: "User not created",
        description: "If user not created",
        schema: { code: { type: String, default: "AUTHX004" } },
      },
      409: [
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
```

## Roadmap

- [x] Add Request Validation
- [x] Add Response Validation
- [x] Add Data Filter
- [x] Add Router Medhods
- [ ] Add ACL Integration
- [ ] Add Swagger Integration

See the [open issues](https://github.com/rohanacar/express-dto/issues) for a full list of proposed features (and known issues).

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See [LICENSE](https://github.com/rohanacar/express-dto/blob/main/LICENSE) for more information.

<!-- CONTACT -->

## Contact

Rohan Acar :wave: <hi@rohanacar.com>

Project Link: [https://github.com/rohanacar/express-dto](https://github.com/rohanacar/express-dto)

[contributors-shield]: https://img.shields.io/github/contributors/rohanacar/express-dto.svg?style=for-the-badge
[contributors-url]: https://github.com/rohanacar/express-dto/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/rohanacar/express-dto.svg?style=for-the-badge
[forks-url]: https://github.com/rohanacar/express-dto/network/members
[stars-shield]: https://img.shields.io/github/stars/rohanacar/express-dto.svg?style=for-the-badge
[stars-url]: https://github.com/rohanacar/express-dto/stargazers
[issues-shield]: https://img.shields.io/github/issues/rohanacar/express-dto.svg?style=for-the-badge
[issues-url]: https://github.com/rohanacar/express-dto/issues
[license-shield]: https://img.shields.io/github/license/rohanacar/express-dto.svg?style=for-the-badge
[license-url]: https://github.com/rohanacar/express-dto/blob/master/LICENSE.txt
