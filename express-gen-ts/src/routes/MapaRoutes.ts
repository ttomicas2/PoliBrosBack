import HttpStatusCodes from "@src/common/HttpStatusCodes";

import MapaService from "@src/services/MapaService";
import { IMapa } from "@src/models/Mapa";
import { IReq, IRes } from "./types/express/misc";

// **** Functions **** //

/**
 * Get all users.
 */
async function getAll(_: IReq, res: IRes) {
  const mapas = await MapaService.getAll();
  return res.status(HttpStatusCodes.OK).json(mapas);
}

async function getPage(req: IReq<{ page: number, limit:number }>, res: IRes) {
  const { page, limit } = req.params;
  const mapas = await MapaService.getPage(Number(page), Number(limit));
  return res.status(HttpStatusCodes.OK).json(mapas);
}

async function getOne(req: IReq<{ id: string }>, res: IRes) {
  const { id } = req.params;
  const mapas = await MapaService.getOne(Number(id));
  return res.status(HttpStatusCodes.OK).json(mapas);
}

async function getAllFromCreator(req: IReq<{ email: string }>, res: IRes) { // deprecated
  const { email } = req.params;
  const mapas = await MapaService.getAllFromCreator(email);
  return res.status(HttpStatusCodes.OK).json(mapas);
}

async function getPageFromCreator(req: IReq<{ email: string, page: number, limit:number }>, res: IRes) {
  const { email, page, limit} = req.params;
  const mapas = await MapaService.getPageFromCreator(email, Number(page), Number(limit));
  return res.status(HttpStatusCodes.OK).json(mapas);
}
/**
 * Add one mapa.
 */
async function add(req: IReq<{ mapa: IMapa }>, res: IRes) {
  const { mapa } = req.body;
  const id = await MapaService.addOne(mapa);
  return res.status(HttpStatusCodes.CREATED).json(id);
}

/**
 * Update one mapa.
 */
async function update(req: any, res: IRes) {
  const { mapa } = req.body;
  const userId  = +req.userId;
  await MapaService.updateOne(mapa, userId);
  return res.status(HttpStatusCodes.OK).end();
}

async function addVisita(req: IReq<{ id: number }>, res: IRes) {
  const { id } = req.params;
  await MapaService.addVisita(Number(id));
  return res.status(HttpStatusCodes.OK).end();
}

async function addMuerte(req: IReq<{ id: number, muertes: number }>, res: IRes) {
  const { id } = req.params;
  const { muertes }= req.body;
  await MapaService.addMuerte(Number(id), muertes);
  return res.status(HttpStatusCodes.OK).end();
}

/**
 * Delete one mapa.
 */
async function delete_(req: any, res: IRes) {
  const id = +req.params.id;
  const userId =+req.userId;
  await MapaService.delete(id, Number(userId));
  return res.status(HttpStatusCodes.OK).end();
}

// **** Export default **** //

export default {
  getAll,
  getPage,
  getOne,
  getAllFromCreator,
  getPageFromCreator,
  add,
  update,
  addVisita,
  addMuerte,
  delete: delete_,
} as const;
