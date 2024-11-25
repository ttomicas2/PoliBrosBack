import supertest, { Test } from 'supertest';
import TestAgent from 'supertest/lib/agent';
import { defaultErrMsg as ValidatorErr } from 'jet-validator';
import insertUrlParams from 'inserturlparams';

import app from '@src/server';
import UserRepo from '@src/repos/UserRepo';
import MapaRepo from '@src/repos/MapaRepo';
import User, { IUser } from '@src/models/User';
import Mapa, { IMapa } from '@src/models/Mapa';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { USER_NOT_FOUND_ERR } from '@src/services/UserService';
import Paths from '@src/common/Paths';
import apiCb from 'spec/support/apiCb';
import { TApiCb } from 'spec/types/misc';

// **** Helpers **** //

// Dummy users for tests
const getDummyUsers = (): IUser[] => [
  User.new('Sean Maxwell', 'sean.maxwell@gmail.com', 'password1'),
  User.new('John Smith', 'john.smith@gmail.com', 'password2'),
  User.new('Gordon Freeman', 'gordon.freeman@gmail.com', 'password3'),
];

// Dummy mapas for tests
const getDummyMapas = (): IMapa[] => [
  Mapa.new(
    'Mapa 1',
    'Valores 1',
    'photo1.jpg',
    10,
    getDummyUsers()[0],
    'Categoria 1'
  ),
  Mapa.new(
    'Mapa 2',
    'Valores 2',
    'photo2.jpg',
    5,
    getDummyUsers()[1],
    'Categoria 2'
  ),
];

// **** Tests **** //

describe('User and Mapa Endpoints', () => {
  let agent: TestAgent<Test>;

  // Setup agent
  beforeAll(done => {
    agent = supertest.agent(app);
    done();
  });

  // **** User Tests **** //

  describe(`"GET:${Paths.Users.Get}"`, () => {
    const api = (cb: TApiCb) => agent.get(Paths.Users.Get).end(apiCb(cb));

    it('should return all users with status 200.', done => {
      const dummyUsers = getDummyUsers();
      spyOn(UserRepo, 'getAll').and.resolveTo(dummyUsers);

      api(res => {
        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(res.body).toEqual({ users: dummyUsers });
        done();
      });
    });
  });

  // **** Mapa Tests **** //

  describe(`"GET:${Paths.Mapas.Get}"`, () => {
    const api = (cb: TApiCb) => agent.get(Paths.Mapas.Get).end(apiCb(cb));

    it('should return all mapas with status 200.', done => {
      const dummyMapas = getDummyMapas();
      spyOn(MapaRepo, 'getAll').and.resolveTo(dummyMapas);

      api(res => {
        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(res.body).toEqual({ mapas: dummyMapas });
        done();
      });
    });
  });

  describe(`"POST:${Paths.Mapas.Add}"`, () => {
    const DUMMY_MAPA = getDummyMapas()[0];
    const api = (mapa: IMapa | null, cb: TApiCb) =>
      agent.post(Paths.Mapas.Add).send({ mapa }).end(apiCb(cb));

    it('should add a mapa successfully and return status 201.', done => {
      spyOn(MapaRepo, 'add').and.resolveTo();

      api(DUMMY_MAPA, res => {
        expect(res.status).toBe(HttpStatusCodes.CREATED);
        done();
      });
    });

    it('should return 400 if mapa data is invalid.', done => {
      api(null, res => {
        expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
        done();
      });
    });
  });

  describe(`"DELETE:${Paths.Mapas.Delete}"`, () => {
    const api = (id: number, cb: TApiCb) =>
      agent.delete(insertUrlParams(Paths.Mapas.Delete, { id })).end(apiCb(cb));

    it('should delete a mapa successfully and return status 200.', done => {
      spyOn(MapaRepo, 'delete').and.resolveTo();
      spyOn(MapaRepo, 'persists').and.resolveTo(true);

      api(1, res => {
        expect(res.status).toBe(HttpStatusCodes.OK);
        done();
      });
    });

    it('should return 404 if the mapa does not exist.', done => {
      spyOn(MapaRepo, 'persists').and.resolveTo(false);

      api(-1, res => {
        expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
        done();
      });
    });
  });
});
