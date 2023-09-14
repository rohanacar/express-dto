import express, { Router } from "express";
import DTO, { Inject } from "../src";
import RegisterDto from "./Register.dto";

const options = {
  title: "Test App",
  description: "",
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

Inject(express, options);

const app = express();

app.$post("/register", RegisterDto, (req, res) => {
  console.log(req.body);
  res.send({ id: "123" });
});

// OR
const appDTO = new DTO(RegisterDto.schemas, RegisterDto.options);
app.post("/register", appDTO.middleware, (req, res) => {
  console.log(req.body);
  res.send({ id: "123" });
});

// OR
const router = Router();
router.$post("/register", RegisterDto, (req, res) => {
  console.log(req.body);
  res.send({ id: "123" });
});
// OR
const routerDTO = new DTO(RegisterDto.schemas, RegisterDto.options);
router.post("/register", routerDTO.middleware, (req, res) => {
  console.log(req.body);
  res.send({ id: "123" });
});

// OR
const route = router.route("/register");

route.$post(RegisterDto, (req, res) => {
  console.log(req.body);
  res.send({ id: "123" });
});

// OR
const routeDTO = new DTO(RegisterDto.schemas, RegisterDto.options);
route.post(routeDTO.middleware, (req, res) => {
  console.log(req.body);
  res.send({ id: "123" });
});

app.listen(3000, () => {
  console.log("Server started");
});
