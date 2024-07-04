import HttpStatusCodes from '@src/common/HttpStatusCodes';

import MapaService from '@src/services/MapaService';
import { IMapa } from '@src/models/Mapa';
import { IReq, IRes } from './types/express/misc';


// **** Functions **** //

/**
 * Get all users.
 */
async function getAll(_: IReq, res: IRes) {
  const mapas = await MapaService.getAll();
  return res.status(HttpStatusCodes.OK).json(mapas);
}

/**
 * Add one mapa.
 */
async function add(req: IReq<{mapa: IMapa}>, res: IRes) {
  const { mapa } = req.body;
  await MapaService.addOne(mapa);
  return res.status(HttpStatusCodes.CREATED).end();
}

/**
 * Update one mapa.
 */
async function update(req: IReq<{mapa: IMapa}>, res: IRes) {
  const { mapa } = req.body;
  await MapaService.updateOne(mapa);
  return res.status(HttpStatusCodes.OK).end();
}

/**
 * Delete one mapa.
 */
async function delete_(req: IReq, res: IRes) {
  const id = +req.params.id;
  await MapaService.delete(id);
  return res.status(HttpStatusCodes.OK).end();
}


// **** Export default **** //

export default {
  getAll,
  add,
  update,
  delete: delete_,
} as const;
