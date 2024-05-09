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

beforeAll(async () => { await dataBaseTestSettings() })
afterAll(async () => { await dataBaseTestSettings() })

describe('/api', () => {
  it('Return Hello World', async () => {
    const response = await request(app).get('/api')

    expect(response.ok).toBeTruthy()
  })
})

describe('/persons', () => {
  it('Should return empty array of persons.', async () => {
    const response = await request(app).get('/persons')

    expect(response.body).toEqual({ "data": [], "message": "Consulta realizada com sucesso.", "meta": { "page": 1 }, "status": 200 })
  })
})

describe('/persons/normal', () => {

  it('Shoud create a normal person.', async () => {

    const response = await request(app).post('/persons/normal').send({
      first_name: "People",
      last_name: "One",
      cpf: "36937725877"
    })

    expect(response.body).toEqual({ "message": "Registro criado com sucesso.", "status": 200, "affectedRows": 1 })
  })

  it('Shoud create other person.', async () => {

    const response = await request(app).post('/persons/normal').send({
      first_name: "People",
      last_name: "Two",
      cpf: "12337725877"
    })

    expect(response.body).toEqual({ "message": "Registro criado com sucesso.", "status": 200, "affectedRows": 1 })
  })

  it('Shoud not create a normal person with same cpf registered in database.', async () => {

    const response = await request(app).post('/persons/normal').send({
      first_name: "Marcos",
      last_name: "Paulo",
      cpf: "36937725877"
    })

    expect(response.body).toEqual({ "message": "Dado duplicado.", "status": 409 })
  })

  it('Shoud update a normal person.', async () => {

    const response = await request(app).patch('/persons/normal/1').send({
      first_name: "João",
      middle_name: "da",
      last_name: "Silva"
    })

    expect(response.body).toEqual({ "message": "Registro atualizado com sucesso.", "status": 200, "affectedRows": 1 })
  })

  it('Shoud not update a normal person with same cpf', async () => {

    const response = await request(app).patch('/persons/normal/1').send({
      first_name: "João",
      middle_name: "da",
      last_name: "Silva",
      cpf: "12337725877",
    })

    expect(response.body).toEqual({ "message": "Não foi possível processar a sua solicitação.", "status": 400 })
  })

  it('Shoud not update normal person if :id is not present.', async () => {

    const response = await request(app).patch('/persons/normal/').send({
      corporate_name: "Marketing Company updated corporate name",
    })

    expect(response.body).toEqual({})
  })

    it('Shoud not update a normal person with invalid body fields values', async () => {

    const response = await request(app).patch('/persons/normal/1').send({
      first_name: "People",
      last_name: "One",
      cpf: "aa"
    })

    expect(response.body).toEqual({ "message": "Valor(es) inválido(s) no corpo da requisição.", "status": 400 })
  })

  it('Shoud not update a normal person with wrong body fields', async () => {

    const response = await request(app).patch('/persons/normal/2').send({
      wrong_field: "invalid field",
      first_name: "People",
      last_name: "Two",
      cpf: "12337725877"
    })

    expect(response.body).toEqual({ "message": "Campo(s) inesperado(s) no corpo da requisição.", "status": 400 })
  })
})

describe('/persons/legal', () => {
  it('Shoud create a legal person.', async () => {

    const response = await request(app).post('/persons/legal').send({
      corporate_name: "Marketing Company",
      social_name: "SkyLab Company",
      state_registration: "123456789",
      cnpj: "25871712000109"
    })

    expect(response.body).toEqual({ "message": "Registro criado com sucesso.", "status": 200, "affectedRows": 1 })
  })

  it('Shoud create other legal person.', async () => {

    const response = await request(app).post('/persons/legal').send({
      corporate_name: "Other Company",
      social_name: "Other Company",
      state_registration: "123456321",
      cnpj: "11171712000798"
    })

    expect(response.body).toEqual({ "message": "Registro criado com sucesso.", "status": 200, "affectedRows": 1 })
  })

  it('Shoud not create a legal person with same cnpj registered in database.', async () => {

    const response = await request(app).post('/persons/legal').send({
      corporate_name: "Another name",
      social_name: "Other Company",
      state_registration: "123456321",
      cnpj: "25871712000109"
    })

    expect(response.body).toEqual({ "message": "Dado duplicado.", "status": 409 })
  })

  it('Shoud update a legal person.', async () => {

    const response = await request(app).patch('/persons/legal/3').send({
      corporate_name: "Marketing Company",
      social_name: "SkyLab Company",
      state_registration: "123456789",
      cnpj: "25871712000109"
    })

    expect(response.body).toEqual({ "message": "Registro atualizado com sucesso.", "status": 200, "affectedRows": 1 })
  })

  it('Shoud not update a legal person with same cnpj', async () => {

    const response = await request(app).patch('/persons/legal/4').send({
      corporate_name: "Marketing Company",
      social_name: "SkyLab Company",
      state_registration: "123456789",
      cnpj: "25871712000109"
    })

    expect(response.body).toEqual({ "message": "Não foi possível processar a sua solicitação.", "status": 400 })
  })

  it('Shoud not update legal person if :id is not present.', async () => {

    const response = await request(app).patch('/persons/legal/').send({
      corporate_name: "Marketing Company updated corporate name",
    })

    expect(response.body).toEqual({})
  })

  it('Shoud not update a legal person with invalid body fields values', async () => {

    const response = await request(app).patch('/persons/legal/4').send({
      corporate_name: "Marketing Company",
      social_name: "SkyLab Company",
      state_registration: "123456789",
      cnpj: "aa"
    })

    expect(response.body).toEqual({ "message": "Valor(es) inválido(s) no corpo da requisição.", "status": 400 })
  })

  it('Shoud not update a legal person with wrong body fields', async () => {

    const response = await request(app).patch('/persons/legal/4').send({
      corporate_name: "Marketing Company",
      social_name: "SkyLab Company",
      state_registration: "123456789",
      wrong_field: "invalid field",
      cnpj: "25871712000109"
    })

    expect(response.body).toEqual({ "message": "Campo(s) inesperado(s) no corpo da requisição.", "status": 400 })
  })
})