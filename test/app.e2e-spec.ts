import { INestApplication } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { ModelCtor, Sequelize } from 'sequelize';
import { Model } from 'sequelize-typescript';
import request from 'supertest';

import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let sequelize: Sequelize;
  let userModel: ModelCtor<Model>;
  let refreshSessionModel: ModelCtor<Model>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    sequelize = moduleFixture.get<Sequelize>(getConnectionToken());
    userModel = sequelize?.models?.['UserEntity'] as ModelCtor<Model>;
    refreshSessionModel = sequelize?.models?.[
      'RefreshSessionEntity'
    ] as ModelCtor<Model>;

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    await refreshSessionModel.destroy({ where: {}, cascade: true });
    await userModel.destroy({ where: {}, cascade: true });
  });

  describe('Register User', () => {
    it('Should register a user', async () => {
      const userData = { email: 'john@gmail.com', password: '123456' };

      const registerResponse = await request(app.getHttpServer())
        .post('/register-user')
        .send(userData);

      expect(registerResponse.status).toBe(201);
      expect(registerResponse.header['set-cookie']).toBeTruthy();

      const createdUser = await userModel.findOne({
        where: { email: userData.email },
      });

      // @ts-ignore
      expect(createdUser?.email).toBe(userData.email);

      const refreshSession = await refreshSessionModel.findOne({
        where: { userId: createdUser?.id },
      });

      expect(refreshSession).toBeTruthy();
    });
  });
});
