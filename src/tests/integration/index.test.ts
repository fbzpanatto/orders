import { describe, expect } from "@jest/globals"
import dotenv from 'dotenv';
import request from 'supertest'
import app from '../../app'
import { createConnection } from "../../services/db";

dotenv.config();

describe('Endpoints', () => {

  // afterAll(async () => {
  //   (await createConnection()).end()
  // })

  it('Return Hello World', async () => {
    const response = await request(app).get('/api')

    expect(response.ok).toBeTruthy()
  })

  it('Return Persons', async () => {
    const response = await request(app).get('/persons')

    expect(response.body).toEqual({ "data": [], "message": "Consulta realizada com sucesso.", "meta": { "page": 1 }, "status": 200 })
  })

  it('Create Normal Person', async () => {

    const response = await request(app).post('/persons').send({
      first_name: "João",
      last_name: "Ninguém",
      cpf: "12345678900",
      person_category_id: 2
    })

    // expect(response.body).toEqual({})
  })
})