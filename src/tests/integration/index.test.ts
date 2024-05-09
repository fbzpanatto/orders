import { describe, expect } from "@jest/globals"
import { query } from "../../services/db";
import request from 'supertest'
import app from '../../app'

async function dataBaseTestSettings() {
  await query('SET FOREIGN_KEY_CHECKS = 0')
  await query('TRUNCATE TABLE legal_persons')
  await query('TRUNCATE TABLE normal_persons')
  await query('TRUNCATE TABLE persons')
  await query('SET FOREIGN_KEY_CHECKS = 1')
}

describe('Endpoints', () => {

  beforeAll(async () => { await dataBaseTestSettings() })
  afterAll(async () => { await dataBaseTestSettings() })

  it('Return Hello World', async () => {
    const response = await request(app).get('/api')

    expect(response.ok).toBeTruthy()
  })

  it('Should return empty array of persons.', async () => {
    const response = await request(app).get('/persons')

    expect(response.body).toEqual({ "data": [], "message": "Consulta realizada com sucesso.", "meta": { "page": 1 }, "status": 200 })
  })

  it('Shoud create a normal person.', async () => {

    const response = await request(app).post('/persons').send({
      first_name: "João",
      last_name: "Ninguém",
      cpf: "36937725877",
      person_category_id: 2
    })

    expect(response.body).toEqual({ "message": "Registro criado com sucesso.", "status": 200 })
  })

  it('Shoud update a normal person.', async () => {

    const response = await request(app).patch('/persons/1?category=2').send({
      first_name: "João",
      middle_name: "da",
      last_name: "Silva"
    })

    expect(response.body).toEqual({ "message": "Registro atualizado com sucesso.", "status": 200 })
  })

  it('Should not update a normal person when wrong category is informed into query parameters.', async () => {

    const response = await request(app).patch('/persons/1?category=1').send({
      first_name: "João",
      middle_name: "da",
      last_name: "Silva"
    })

    expect(response.body).toEqual({ "message": "Registro não encontrado.", "status": 404 })
  })
})