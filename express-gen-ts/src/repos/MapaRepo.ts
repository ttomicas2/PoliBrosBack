import { IMapa } from "@src/models/Mapa";
import { getRandomInt } from "@src/util/misc";
import { mapaModel } from "./mongoose";
import { resolve } from "path";
import { rejects } from "assert";

// **** Functions **** //

/**
 * Get one mapa.
 */
async function getOne(email: string): Promise<IMapa | null> {
  return new Promise((resolve, reject) => {
    mapaModel
      .findOne({ email: email })
      .then((mapa: any) => {
        resolve(mapa);
      })
      .catch((error: any) => {
        console.error("Error al obtener usuario:", error);
        reject(error);
      });
  });
}

async function getAllFromCreator(email: string): Promise<IMapa[] | null> {
  return new Promise((resolve, reject) => {
    mapaModel
      .find({ "creator.email": email })
      .then((mapas: any) => {
        resolve(mapas);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}
/**
 * See if a mapa with the given id exists.
 */
async function persists(id: number): Promise<boolean> {
  const exists = await mapaModel.exists({ id: id });
  return new Promise((resolve, reject) => {
    if (exists != null) {
      resolve(true);
    } else {
      reject(false);
    }
  });
}

/**
 * Get all mapas.
 */
async function getAll(): Promise<IMapa[]> {
  return new Promise((resolve, reject) => {
    mapaModel
      .find({})
      .then((data: IMapa[]) => {
        resolve(data); // Resuelve la promesa con los festivales obtenidos
      })
      .catch((error: Error) => {
        console.error("Error al obtener festivales:", error);
        reject(error); // Rechazar la promesa en caso de error
      });
  });
}

/**
 * Add one mapa.
 */
async function add(mapa: IMapa): Promise<void> {
  mapa.id = getRandomInt();
  mapaModel
    .insertMany(mapa)
    .then((res: any) => {
      console.log(res);
    })
    .catch((err: any) => {
      console.error(err);
    });
}

/**
 * Update a mapa.
 */
async function update(mapa: IMapa): Promise<void> {
  mapaModel
    .replaceOne({ id: mapa.id }, mapa)
    .then((res: any) => {
      console.log(res);
    })
    .catch((err: any) => {
      console.error(err);
    });
}

/**
 * Delete one mapa.
 */
async function delete_(id: number): Promise<void> {
  mapaModel
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
  getOne,
  getAllFromCreator,
  persists,
  getAll,
  add,
  update,
  delete: delete_,
} as const;
