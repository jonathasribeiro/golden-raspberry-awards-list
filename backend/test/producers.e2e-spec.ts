import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('ProducersController (e2e)', () => {
  let app: INestApplication;
  let response: request.Response;

  beforeAll(async () => {
    jest.setTimeout(20000);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    response = await request(app.getHttpServer()).get('/producers/intervals');
  });

  it('should return status 200', () => {
    expect(response.status).toBe(200);
  });

  it('should contain min and max properties', () => {
    expect(response.body).toHaveProperty('min');
    expect(response.body).toHaveProperty('max');
  });

  it('should contain min and max as arrays', () => {
    expect(Array.isArray(response.body.min)).toBe(true);
    expect(Array.isArray(response.body.max)).toBe(true);
  });

  it('should contain at least one element in min and max', () => {
    expect(response.body.min.length).toBeGreaterThan(0);
    expect(response.body.max.length).toBeGreaterThan(0);
  });

  it('should contain required fields in each min item', () => {
    for (const item of response.body.min) {
      expect(item).toHaveProperty('producer');
      expect(item).toHaveProperty('interval');
      expect(item).toHaveProperty('previousWin');
      expect(item).toHaveProperty('followingWin');
    }
  });

  it('should contain required fields in each max item', () => {
    for (const item of response.body.max) {
      expect(item).toHaveProperty('producer');
      expect(item).toHaveProperty('interval');
      expect(item).toHaveProperty('previousWin');
      expect(item).toHaveProperty('followingWin');
    }
  });

  it('should have correct interval values', () => {
    const allItems = [...response.body.min, ...response.body.max];
    for (const item of allItems) {
      expect(item.interval).toBe(item.followingWin - item.previousWin);
    }
  });
});
