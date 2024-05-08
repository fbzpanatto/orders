import { describe, expect } from "@jest/globals"
import dotenv from 'dotenv';
import request from 'supertest'
import app from '../../app'

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