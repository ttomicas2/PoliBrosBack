import jsonfile from "jsonfile";

import { IUser } from "@src/models/User";

import Mongoose, { Connection, Model, Schema } from "mongoose";
import { Console } from "console";
import { IMapa } from "@src/models/Mapa";

// **** Variables **** //

// **** Types **** //

const userSchema: Schema = new Mongoose.Schema(
  {
    id: { type: Number, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { collection: "usuarios", versionKey: false }
);

const mapaSchema: Schema = new Mongoose.Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    valores: { type: String, required: true },
    photo: { type: String, required: true },
    likes: { type: Number, required: true },
    creator: {
      id: { type: Number, required: true },
      username: { type: String, required: true },
      email: { type: String, required: true },
      password: { type: String, required: true },
    },
    categoria: { type: String, required: true },
  },
  { collection: "mapas", versionKey: false }
);

// **** Functions **** //

/**
 * Fetch the json from the file.
 */
const db: Connection = Mongoose.createConnection(
  "mongodb://127.0.0.1:27017/PoliBros"
);

export const userModel = db.model<IUser>("Users", userSchema);
export const mapaModel = db.model<IMapa>("Mapas", mapaSchema);
