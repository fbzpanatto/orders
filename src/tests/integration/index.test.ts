import { describe, expect } from "@jest/globals"
import { query } from "../../services/db";
import request from 'supertest'
import app from '../../app'

describe('Endpoints', () => {

  beforeAll(async () => {
    await query('SET FOREIGN_KEY_CHECKS = 0')
    await query('TRUNCATE TABLE legal_persons')
    await query('TRUNCATE TABLE normal_persons')
    await query('TRUNCATE TABLE persons')
    await query('SET FOREIGN_KEY_CHECKS = 1')
  })

  it('Return Hello World', async () => {
    const response = await request(app).get('/api')

    expect(response.ok).toBeTruthy()
  })

  // it('Return Persons', async () => {
  //   const response = await request(app).get('/persons')

  //   expect(response.body).toEqual({ "data": [], "message": "Consulta realizada com sucesso.", "meta": { "page": 1 }, "status": 200 })
  // })

  it('Create Normal Person', async () => {

    const response = await request(app).post('/persons').send({
      first_name: "João",
      last_name: "Ninguém",
      cpf: "36937725877",
      person_category_id: 2
    })

    expect(response.body).toEqual({ "message": "Registro criado com sucesso.", "status": 200 })
  })
})