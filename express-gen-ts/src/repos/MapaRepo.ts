import { Dificultad, IMapa } from "@src/models/Mapa";
import { getRandomInt } from "@src/util/misc";
import { mapaModel } from "./mongoose";
import { isModerador } from "./UserRepo";

// **** Functions **** //

/**
 * Get one mapa.
 */
async function getOne(id: number): Promise<IMapa | null> {
  return new Promise((resolve, reject) => {
    mapaModel
      .findOne({ id: id })
      .then((mapa: any) => {
        resolve(mapa);
      })
      .catch((error: any) => {
        console.error("Error al obtener el mapa:", error);
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

async function getPageFromCreator(email: string, page: number, limit: number): Promise<IMapa[] | null> {
  return new Promise((resolve, reject) => {
    mapaModel
      .find({ "creator.email": email })
      .skip((page - 1) * limit)
      .limit(limit)
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

async function getPage(page: number, limit: number): Promise<IMapa[]> {
  return new Promise((resolve, reject) => {
    mapaModel
      .find({})
      .skip((page - 1) * limit) 
      .limit(limit)
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
async function add(mapa: IMapa): Promise<number> {
  mapa.id = getRandomInt();
  return new Promise((resolve, reject) => {
    mapaModel
      .insertMany(mapa)
      .then((res: any) => {
        console.log(res);
        resolve(mapa.id);
      })
      .catch((err: any) => {
        console.error(err);
        reject(err);
      });
  });
}

/**
 * Update a mapa.
 */
async function update(mapa: IMapa, idUserToken: number): Promise<void> {
  mapaModel
  .findOne({ id: mapa.id })
  .then(async (mapa: any) => {
    if(mapa.creator.id === idUserToken || await isModerador(idUserToken)){
      mapaModel
      .replaceOne({ id: mapa.id }, mapa)
      .then((res: any) => {
        console.log(res);
      }).catch((err: any) => {
        console.error(err);
      });
    }
    }).catch((err: any) => {
      console.error(err);
    });
}

async function addVisita(id: number): Promise<void> {
  mapaModel
    .updateOne({ id: id }, { $inc: { likes: 1 } })
    .then((res: any) => {
      console.log(res);
    })
    .catch((err: any) => {
      console.error(err);
    });
}

async function addMuerte(id: number, muertes: number): Promise<void> {
  mapaModel
    .updateOne({ id: id }, { $push: { intentos: muertes } })
    .then(async (res: any) => {
      try {
        const mapa = await mapaModel.findOne({id : id});
        // Actualizar el mapa por su id
        if(mapa === null){
          return;
        }
        const nuevaDificultad = calcularDificultad(mapa);
        const mapaActualizado = await mapaModel.findOneAndUpdate(
          { id: id },  // Buscar por el id del mapa
          { dificultad: nuevaDificultad },  // Actualizar la dificultad
          { new: true }  // Devuelve el documento actualizado
        );
    
        if (!mapaActualizado) {
          throw new Error('Mapa no encontrado');
        }
    
        console.log('Dificultad actualizado:', mapaActualizado.dificultad);
      } catch (error) {
        console.error('Error al cambiar la dificultad del mapa:', error);
      }
    })
    .catch((err: any) => {
      console.error(err);
    });
}

function calcularDificultad(mapa: IMapa) : Dificultad{
  let total = 0;
  for(let i of mapa.intentos) total+=i;
  const promedio = total/mapa.intentos.length;
  if(mapa.intentos.length === 0){
    return Dificultad.noTesteado
  }
  if(promedio <= 2){
    return Dificultad.facil;
  }else if(promedio <= 10) {
    return  Dificultad.normal;
  }else{
    return Dificultad.dificil;
  }
}

/**
 * Delete one mapa.
 */
async function delete_(id: number, idUserToken: number): Promise<void> {
  mapaModel
    .findOne({ id: id })
    .then(async (mapa: any) => {
      if(mapa.creator.id === idUserToken || await isModerador(idUserToken)){
        mapaModel
        .deleteOne({ id: id })
        .then((res: any) => {
          console.log(res);
        })
        .catch((err: any) => {
          console.error(err);
        });
      }else{
        console.log("No es el dueño del mapa");
      }
    })
    .catch((err: any) => {
      console.error(err);
    });
}

// **** Export default **** //

export default {
  getOne,
  getAllFromCreator,
  getPageFromCreator,
  persists,
  getAll,
  getPage,
  add,
  update,
  addVisita,
  addMuerte,
  delete: delete_,
} as const;
