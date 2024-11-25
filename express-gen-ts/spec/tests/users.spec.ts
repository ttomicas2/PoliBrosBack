
import supertest, { Test } from 'supertest';
import TestAgent from 'supertest/lib/agent';
import insertUrlParams from 'inserturlparams';

import app from '@src/server';
import UserRepo from '@src/repos/UserRepo';
import MapaRepo from '@src/repos/MapaRepo';
import User, { IUser } from '@src/models/User';
import Mapa, { IMapa } from '@src/models/Mapa';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import Paths from '@src/common/Paths';
import apiCb from 'spec/support/apiCb';
import { TApiCb } from 'spec/types/misc';

// **** Tests **** //

describe('User and Mapa Endpoints', () => {
  let agent: TestAgent<Test>;

  beforeAll(done => {
    agent = supertest.agent(app);
    done();
  });

  // **** User Tests **** //

  describe(`GET: ${Paths.Base + Paths.Users.Base + Paths.Users.Get}`, () => {
    const api = (cb: TApiCb) => agent.get(Paths.Base + Paths.Users.Base + Paths.Users.Get).end(apiCb(cb));

    it('should return status 200.', done => {
      api(res => {
        expect(res.status).toBe(HttpStatusCodes.OK);
        done();
      });
    });
  });

  // **** Mapa Tests **** //

  describe(`GET: ${Paths.Base + Paths.Mapas.Base + Paths.Mapas.Get}`, () => {
    const api = (cb: TApiCb) => agent.get(Paths.Base + Paths.Mapas.Base + Paths.Mapas.Get).end(apiCb(cb));

    it('should return status 200.', done => {
      api(res => {
        expect(res.status).toBe(HttpStatusCodes.OK);
        done();
      });
    });
  });
});
