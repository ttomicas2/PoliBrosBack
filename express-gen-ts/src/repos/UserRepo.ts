import { IUser } from "@src/models/User";
import { getRandomInt } from "@src/util/misc";
import { mapaModel, moderadorModel, userModel } from "./mongoose";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import EnvVars from "@src/common/EnvVars";
import { IMapa } from "@src/models/Mapa";
// **** Functions **** //

async function logIn(userInput: IUser): Promise<string> {
  let query: any;
  if (userInput.username != "") {
    query = {
      username: userInput.username,
    };
  } else {
    query = {
      email: userInput.email,
    };
  }
  return new Promise((resolve, reject) => {
    userModel.findOne(query).then((user: any) => {
      if (user == null) reject("Usuario no encontrado");
      bcrypt.compare(
        userInput.password,
        user?.password,
        async (err: Error | undefined, result: boolean) => {
          if (err) {
            console.error("Error al obtener usuario:", err);
            reject(err);
          }
          if (result) {
            // Passwords match, authentication successful
            let rolActivo: string;
            if(await isModerador(user.id)){
              rolActivo = "Moderador";
            }else{
              rolActivo = "Usuario";
            }
            console.log("Passwords match! User authenticated.");
            const payload = {
              rol: rolActivo,
              id: user.id,
              username: user.username,
              email: user.email,
            };
            const accessToken = jwt.sign(payload, EnvVars.Jwt.Secret, {
              expiresIn: "10h",
            });
            resolve(accessToken);
          } else {
            // Passwords don't match, authentication failedl
            console.log("Passwords do not match! Authentication failed.");
            reject("Contraseña incorrecta");
          }
        }
      );
    });
  });
}

/**
 * Get one user.
 */
async function getOne(email: string): Promise<IUser | null> {
  return new Promise((resolve, reject) => {
    userModel
      .findOne({ email: email })
      .then((user: any) => {
        resolve(user);
      })
      .catch((error: any) => {
        console.error("Error al obtener usuario:", error);
        reject(error);
      });
  });
}

/**
 * See if a user with the given id exists.
 */
async function persists(id: number): Promise<boolean> {
  const exists = await userModel.exists({ id: id });
  return new Promise((resolve, reject) => {
    if (exists != null) {
      resolve(true);
    } else {
      reject(false);
    }
  });
}

export async function isModerador(id: number): Promise<boolean> {
  const exists = await moderadorModel.exists({ id: id });
  console.log("Moderador?: " + exists?._id);
    if (exists != null) {
      return true
    } else {
      return false;
    }
}

/**
 * Get all users.
 */
async function getAll(): Promise<IUser[]> {
  return new Promise((resolve, reject) => {
    userModel
      .find({})
      .then((data: IUser[]) => {
        resolve(data); // Resuelve la promesa con los festivales obtenidos
      })
      .catch((error: Error) => {
        console.error("Error al obtener festivales:", error);
        reject(error); // Rechazar la promesa en caso de error
      });
  });
}

/**
 * Add one user.
 */
async function add(user: IUser): Promise<void> {
  user.id = getRandomInt();
  if (await checkDuplicateEmail(user.email)) {
    console.error("Mail ya existe");
    console.log("Duplicado Mail");
    return;
  } else {
    console.log("No duplicado");
  }
  if (await checkUsuarioDuplicate(user.username)) {
    console.error("Usuario ya existe");
    return;
  }
  console.log(user.password);
  bcrypt.genSalt(10).then((salt: any) => {
    bcrypt
      .hash(user.password, salt)
      .then((hash: any) => {
        user.password = hash;
        userModel
          .insertMany(user)
          .then((res: any) => {
            console.log(res);
          })
          .catch((err: any) => {
            console.error(err);
          });
      })
      .catch((error: any) => {
        console.error("Error al hashear contraseña:", error);
      });
  });
}

async function checkDuplicateEmail(email: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    userModel
      .findOne({ email: email })
      
      .then((user: any) => {
        if (user != null) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((error: any) => {
        console.error("Error al obtener usuario:", error);
        reject(error);
      });
  });
}

async function checkUsuarioDuplicate(username: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    userModel
      .findOne({ username: username })
      .then((user: any) => {
        if (user != null) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((error: any) => {
        console.error("Error al obtener usuario:", error);
        reject(error);
      });
  });
}

/**
 * Update a user.
 */
async function update(user: IUser): Promise<void> {
  userModel
    .replaceOne({ id: user.id }, user)
    .then((res: any) => {
      console.log(res);
    })
    .catch((err: any) => {
      console.error(err);
    });
}

/**
 * Delete one user.
 */
async function delete_(id: number): Promise<void> {
  userModel
    .deleteOne({ id: id })
    .then((res: any) => {
      console.log(res);
    })
    .catch((err: any) => {
      console.error(err);
    });
}

async function getAllMapas(id: number): Promise<IMapa[]> {
  return new Promise((resolve, reject) => {
    mapaModel
      .find({ "creator.id": id })
      .then((data: IMapa[]) => {
        resolve(data); // Resuelve la promesa con los festivales obtenidos
      })
      .catch((error: Error) => {
        console.error("Error al obtener festivales:", error);
        reject(error); // Rechazar la promesa en caso de error
      });
  });
}

// **** Export default **** //

export default {
  logIn,
  getOne,
  persists,
  getAll,
  add,
  update,
  delete: delete_,
} as const;
