import RouteError from '@src/common/RouteError';
import HttpStatusCodes from '@src/common/HttpStatusCodes';

import MapaRepo from '@src/repos/MapaRepo';
import { IMapa } from '@src/models/Mapa';


// **** Variables **** //

export const USER_NOT_FOUND_ERR = 'Mapa not found';


// **** Functions **** //

/**
 * Get all users.
 */
function getAll(): Promise<IMapa[]> {
  return MapaRepo.getAll();
}


function getOne(idMapa:number): Promise<IMapa | null> {
  return MapaRepo.getOne(idMapa);
}

function getAllFromCreator(emailCreator:string): Promise<IMapa[] | null> {
  return MapaRepo.getAllFromCreator(emailCreator);
}

/**
 * Add one mapa.
 */
function addOne(mapa: IMapa): Promise<number> {
  return MapaRepo.add(mapa);
}

/**
 * Update one mapa.
 */
async function updateOne(mapa: IMapa): Promise<void> {
  const persists = await MapaRepo.persists(mapa.id);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      USER_NOT_FOUND_ERR,
    );
  }
  // Return mapa
  return MapaRepo.update(mapa);
}

/**
 * Delete a mapa by their id.
 */
async function _delete(id: number): Promise<void> {
  const persists = await MapaRepo.persists(id);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      USER_NOT_FOUND_ERR,
    );
  }
  // Delete mapa
  return MapaRepo.delete(id);
}


// **** Export default **** //

export default {
  getAll,
  getOne,
  getAllFromCreator,
  addOne,
  updateOne,
  delete: _delete,
} as const;
