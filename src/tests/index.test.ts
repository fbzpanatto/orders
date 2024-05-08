import { describe, expect } from "@jest/globals"
import request from 'supertest'
import app from '../app'

import dotenv from 'dotenv';
dotenv.config();

describe('Endpoints', () => {

  it('Return Hello World', async () => {
    const response = await request(app).get('/api')

    expect(response.ok).toBeTruthy()
  })

  it('Return Persons', async () => {
    const response = await request(app).get('/persons')

    expect(response.body).toEqual({ "data": [], "message": "Consulta realizada com sucesso.", "meta": { "page": 1 }, "status": 200 })
  })
})