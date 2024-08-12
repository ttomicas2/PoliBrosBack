import { Router } from "express";
import jetValidator from "jet-validator";

import Paths from "../common/Paths";
import User from "@src/models/User";
import UserRoutes from "./UserRoutes";
import Mapa from "@src/models/Mapa";
import MapaRoutes from "./MapaRoutes";
import UserRepo from "@src/repos/UserRepo";
import { verifyToken } from "@src/middleware/authenticate";


// **** Variables **** //

const apiRouter = Router(),
  validate = jetValidator();

// ** Add UserRouter ** //

const userRouter = Router();
const mapaRouter = Router();

// Get all users
userRouter.get(Paths.Users.Get, UserRoutes.getAll);

mapaRouter.get(Paths.Mapas.Get, MapaRoutes.getAll);
mapaRouter.get(Paths.Mapas.GetFromCreator, verifyToken, MapaRoutes.getAllFromCreator);

mapaRouter.get(Paths.Mapas.GetOne, MapaRoutes.getOne);

// Add one user
userRouter.post(
  Paths.Users.Add,
  validate(["user", User.isUser]),
  UserRoutes.add
);

userRouter.post(
  Paths.Users.LogIn,
  validate(["user", User.isUser]),
  UserRoutes.logIn
);

mapaRouter.post(
  Paths.Mapas.Add,
  verifyToken,
  validate(["mapa", Mapa.isMapa]),
  MapaRoutes.add
);

// Update one user
userRouter.put(
  Paths.Users.Update,
  validate(["user", User.isUser]),
  UserRoutes.update
);

mapaRouter.put(
  Paths.Mapas.Update,
  verifyToken,
  validate(["mapa", Mapa.isMapa]),
  MapaRoutes.update
);

// Delete one user
userRouter.delete(
  Paths.Users.Delete,
  verifyToken,
  validate(["id", "number", "params"]),
  UserRoutes.delete
);

mapaRouter.delete(
  Paths.Mapas.Add,
  verifyToken,
  validate(["id", "number", "params"]),
  MapaRoutes.delete
);

// Add UserRouter
apiRouter.use(Paths.Users.Base, userRouter);
apiRouter.use(Paths.Mapas.Base, mapaRouter);

// **** Export default **** //

export default apiRouter;
