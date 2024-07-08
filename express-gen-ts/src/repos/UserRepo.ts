import { IUser } from '@src/models/User';
import { getRandomInt } from '@src/util/misc';
import { userModel } from './mongoose';
import bcrypt from 'bcrypt-ts';

import jwt from 'jsonwebtoken';
import EnvVars from '@src/common/EnvVars';
// **** Functions **** //

async function logIn(userInput: IUser): Promise<string> {
  return new Promise((resolve, reject) => {
    userModel.findOne({ email: userInput.email, username: userInput.username }).then((user : any) => {
      if(user == null) reject("Usuario no encontrado");
      bcrypt.compare(userInput.password, user?.password, (result: any) => {
      if (result) {
        // Passwords match, authentication successful
        console.log('Passwords match! User authenticated.');
        const accessToken = jwt.sign(userInput, EnvVars.Jwt.Secret, { expiresIn: '1h' });
        resolve(accessToken);
      } else {
        // Passwords don't match, authentication failed
        console.log('Passwords do not match! Authentication failed.');
        reject("Contraseña incorrecta");
      }
      });
    }).catch((error: any) => {
      console.error("Error al obtener usuario:", error);
      reject(error);
    });
  });
}

/**
 * Get one user.
 */
async function getOne(email: string): Promise<IUser | null> {
  return new Promise((resolve, reject) => {
    userModel.findOne({ email: email }).then((user) => {
        resolve(user);
    }).catch((error: any) => {
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
    if(exists != null){
      resolve(true);
    }else{
      reject(false);
    }
  });
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
  bcrypt.genSalt(10).then( (salt: any) => {
    bcrypt.hash(user.password, salt).then((hash: any) => {
      user.password = hash;
      userModel
      .insertMany(user)
      .then((res: any) => {
        console.log(res);
      })
      .catch((err: any) => {
        console.error(err);
      });
    }).catch((error: any) => {
      console.error("Error al hashear contraseña:", error);
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
