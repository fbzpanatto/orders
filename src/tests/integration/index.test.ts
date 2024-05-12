import { formatDate } from "../../utils/formatDate";
import { describe, expect } from "@jest/globals"
import { query } from "../../services/db";
import request from 'supertest'
import app from '../../app'

async function dataBaseTestSettings() {
  await query('SET FOREIGN_KEY_CHECKS = 0')
  await query('TRUNCATE TABLE legal_persons')
  await query('TRUNCATE TABLE normal_persons')
  await query('TRUNCATE TABLE persons')
  await query('TRUNCATE TABLE person_addresses')
  await query('TRUNCATE TABLE person_phones')
  await query('SET FOREIGN_KEY_CHECKS = 1')
}

beforeAll(async () => { await dataBaseTestSettings() })
// afterAll(async () => { await dataBaseTestSettings() })

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

  it('Should create a normal person.', async () => {

    const response = await request(app).post('/persons/normal').send({
      first_name: "People",
      last_name: "One",
      cpf: "36937725877",
      created_at: formatDate(new Date()),
      observation: 'observation value',
      first_field: 'first_field value',
      second_field: 'second_field value',
      third_field: 'third_field'
    })

    expect(response.body).toEqual({ "message": "Registro criado com sucesso.", "status": 200, "affectedRows": 1 })
  })

  it('Should create other person.', async () => {

    const response = await request(app).post('/persons/normal').send({
      first_name: "People",
      last_name: "Two",
      cpf: "12337725877",
      created_at: formatDate(new Date()),
    })

    expect(response.body).toEqual({ "message": "Registro criado com sucesso.", "status": 200, "affectedRows": 1 })
  })

  it('Should update a normal person.', async () => {

    const response = await request(app).patch('/persons/normal/1').send({
      first_name: "João",
      middle_name: "da",
      last_name: "Silva",
      updated_at: formatDate(new Date()),
    })

    expect(response.body).toEqual({ "message": "Registro atualizado com sucesso.", "status": 200, "affectedRows": 1 })
  })

  it('Should not create a normal person with same cpf registered in database.', async () => {

    const response = await request(app).post('/persons/normal').send({
      first_name: "Marcos",
      last_name: "Paulo",
      cpf: "36937725877",
      created_at: formatDate(new Date()),
    })

    expect(response.body).toEqual({ "message": "Dado duplicado.", "status": 409 })
  })

  it('Should not update a normal person with same cpf', async () => {

    const response = await request(app).patch('/persons/normal/1').send({
      first_name: "João",
      middle_name: "da",
      last_name: "Silva",
      cpf: "12337725877",
      updated_at: formatDate(new Date()),
    })

    expect(response.body).toEqual({ "message": "Não foi possível processar a sua solicitação.", "status": 400 })
  })

  it('Should not update a normal person with inexistent id', async () => {

    const response = await request(app).patch('/persons/normal/109').send({
      first_name: "João",
      middle_name: "da",
      last_name: "Silva",
      cpf: "12337725877",
      updated_at: formatDate(new Date()),
    })

    expect(response.body).toEqual({ "message": "Registro não encontrado.", "status": 404 })
  })

  it('Should not update a normal person if :id is not present.', async () => {

    const response = await request(app).patch('/persons/normal/').send({
      corporate_name: "Marketing Company updated corporate name",
      updated_at: formatDate(new Date()),
    })

    expect(response.body).toEqual({})
  })

  it('Should not update a normal person with invalid body fields values', async () => {

    const response = await request(app).patch('/persons/normal/1').send({
      first_name: "People",
      last_name: "One",
      cpf: "aa",
      updated_at: formatDate(new Date()),
    })

    expect(response.body).toEqual({ "message": "Valor(es) inválido(s) no corpo da requisição.", "status": 400 })
  })

  it('Should not update a normal person with wrong body fields', async () => {

    const response = await request(app).patch('/persons/normal/2').send({
      wrong_field: "invalid field",
      first_name: "People",
      last_name: "Two",
      cpf: "12337725877",
      updated_at: formatDate(new Date()),
    })

    expect(response.body).toEqual({ "message": "Campo(s) inesperado(s) no corpo da requisição.", "status": 400 })
  })
})

describe('/persons/legal', () => {
  it('Should create a legal person.', async () => {

    const response = await request(app).post('/persons/legal').send({
      corporate_name: "Marketing Company",
      social_name: "SkyLab Company",
      state_registration: "123456789",
      cnpj: "25871712000109",
      created_at: formatDate(new Date()),
      observation: 'observation value',
      first_field: 'first_field value',
      second_field: 'second_field value',
      third_field: 'third_field'
    })

    expect(response.body).toEqual({ "message": "Registro criado com sucesso.", "status": 200, "affectedRows": 1 })
  })

  it('Should create other legal person.', async () => {

    const response = await request(app).post('/persons/legal').send({
      corporate_name: "Other Company",
      social_name: "Other Company",
      state_registration: "123456321",
      cnpj: "11171712000798",
      created_at: formatDate(new Date()),
    })

    expect(response.body).toEqual({ "message": "Registro criado com sucesso.", "status": 200, "affectedRows": 1 })
  })

  it('Should update a legal person.', async () => {

    const response = await request(app).patch('/persons/legal/3').send({
      corporate_name: "Marketing Company",
      social_name: "SkyLab Company",
      state_registration: "123456789",
      cnpj: "25871712000109",
      updated_at: formatDate(new Date()),
    })

    expect(response.body).toEqual({ "message": "Registro atualizado com sucesso.", "status": 200, "affectedRows": 1 })
  })

  it('Should not create a legal person with same cnpj registered in database.', async () => {

    const response = await request(app).post('/persons/legal').send({
      corporate_name: "Another name",
      social_name: "Other Company",
      state_registration: "123456321",
      cnpj: "25871712000109",
      created_at: formatDate(new Date()),
    })

    expect(response.body).toEqual({ "message": "Dado duplicado.", "status": 409 })
  })

  it('Should not update a legal person with inexistent id.', async () => {

    const response = await request(app).patch('/persons/legal/109').send({
      corporate_name: "Marketing Company",
      social_name: "SkyLab Company",
      state_registration: "123456789",
      cnpj: "25871712000109",
      updated_at: formatDate(new Date()),
    })

    expect(response.body).toEqual({ "message": "Registro não encontrado.", "status": 404 })
  })

  it('Should not update a legal person with same cnpj', async () => {

    const response = await request(app).patch('/persons/legal/4').send({
      corporate_name: "Marketing Company",
      social_name: "SkyLab Company",
      state_registration: "123456789",
      cnpj: "25871712000109",
      updated_at: formatDate(new Date()),
    })

    expect(response.body).toEqual({ "message": "Não foi possível processar a sua solicitação.", "status": 400 })
  })

  it('Should not update a legal person if :id is not present.', async () => {

    const response = await request(app).patch('/persons/legal/').send({
      corporate_name: "Marketing Company updated corporate name",
      updated_at: formatDate(new Date()),
    })

    expect(response.body).toEqual({})
  })

  it('Should not update a legal person with invalid body fields values', async () => {

    const response = await request(app).patch('/persons/legal/4').send({
      corporate_name: "Marketing Company",
      social_name: "SkyLab Company",
      state_registration: "123456789",
      // cnpj: "12113456789101",
      // updated_at: formatDate(new Date()),
    })

    expect(response.body).toEqual({ "message": "Valor(es) inválido(s) no corpo da requisição.", "status": 400 })
  })

  it('Should not update a legal person with wrong body fields', async () => {

    const response = await request(app).patch('/persons/legal/4').send({
      corporate_name: "Marketing Company",
      social_name: "SkyLab Company",
      state_registration: "123456789",
      wrong_field: "invalid field",
      cnpj: "25871712000109",
      updated_at: formatDate(new Date()),
    })

    expect(response.body).toEqual({ "message": "Campo(s) inesperado(s) no corpo da requisição.", "status": 400 })
  })
})

describe('/addresses', () => {
  it('Should create a new address for normal or legal person', async () => {

    const response = await request(app).post('/addresses').send({
      person_id: 1,
      add_street: "Rua Jundiai",
      add_number: "210",
      add_zipcode: "13253500",
      add_city: "Itatiba",
      add_neighborhood: "Centro",
      created_at: formatDate(new Date())
    })

    expect(response.body).toEqual({ "message": "Registro criado com sucesso.", "status": 200, "affectedRows": 1 })
  })

  it('Should update an address.', async () => {

    const response = await request(app).patch('/addresses/1').send({
      add_street: "Rua Jundiai",
      add_number: "210",
      add_zipcode: "13253500",
      add_city: "Itatiba",
      add_neighborhood: "Centro",
      updated_at: formatDate(new Date())
    })

    expect(response.body).toEqual({ "message": "Registro atualizado com sucesso.", "status": 200, "affectedRows": 1 })
  })

  it('Should not create a new address for normal or legal person without previously registered ID ', async () => {

    const response = await request(app).post('/addresses').send({
      person_id: 1000,
      add_street: "Rua Jundiai",
      add_number: "210",
      add_zipcode: "13253500",
      add_city: "Itatiba",
      add_neighborhood: "Centro",
      created_at: formatDate(new Date())
    })

    expect(response.body).toEqual({ "message": "Não foi possível processar a sua solicitação.", "status": 400 })
  })

  it('Should not create a new address with invalid body fields values.', async () => {

    const response = await request(app).post('/addresses').send({
      person_id: 1,
      add_street: "Rua Jundiai",
      add_number: "210",
      add_zipcode: "123",
      add_city: "Itatiba",
      add_neighborhood: "Centro",
      created_at: formatDate(new Date())
    })

    expect(response.body).toEqual({ "message": "Valor(es) inválido(s) no corpo da requisição.", "status": 400 })
  })

  it('Should not create a new address with wrong body fields.', async () => {

    const response = await request(app).post('/addresses').send({
      person_id: 1000,
      add_street: "Rua Jundiai",
      add_number: "210",
      add_zipcode: "13253500",
      add_city: "Itatiba",
      add_neighborhood: "Centro",
      created_at: formatDate(new Date()),
      wrongField: "value"
    })

    expect(response.body).toEqual({ "message": "Campo(s) inesperado(s) no corpo da requisição.", "status": 400 })
  })

  it('Should not update an address with invalid body fields values.', async () => {

    const response = await request(app).patch('/addresses/1').send({
      add_street: "Rua Jundiai",
      add_number: "210",
      add_zipcode: "132",
      add_city: "Itatiba",
      add_neighborhood: "Centro",
      updated_at: formatDate(new Date())
    })

    expect(response.body).toEqual({ "message": "Valor(es) inválido(s) no corpo da requisição.", "status": 400 })
  })

  it('Should not update an address with wrong body fields.', async () => {

    const response = await request(app).patch('/addresses/1').send({
      add_street: "Rua Jundiai",
      add_number: "210",
      add_zipcode: "13253600",
      add_city: "Itatiba",
      add_neighborhood: "Centro",
      updated_at: formatDate(new Date()),
      wrongFild: 'wrongValue'
    })

    expect(response.body).toEqual({ "message": "Campo(s) inesperado(s) no corpo da requisição.", "status": 400 })
  })
})

describe('/phones', () => {
  it('Should create a new phone.', async () => {

    const response = await request(app).post('/phones').send({
      person_id: 1,
      phone_number: "11968568913",
      contact: "Fabrizio Panato",
      created_at: formatDate(new Date())
    })

    expect(response.body).toEqual({ "message": "Registro criado com sucesso.", "status": 200, "affectedRows": 1 })
  })

  it('Should update a phone.', async () => {

    const response = await request(app).patch('/phones/1').send({
      phone_number: "11968568999",
      contact: "Fabrizio Panato Atualizado",
      updated_at: formatDate(new Date())
    })

    expect(response.body).toEqual({ "message": "Registro atualizado com sucesso.", "status": 200, "affectedRows": 1 })
  })

  it('Should not create a new phone without previously registered person id', async () => {

    const response = await request(app).post('/phones').send({
      person_id: 1000,
      phone_number: "11968568913",
      contact: "Fabrizio Panato",
      created_at: formatDate(new Date())
    })

    expect(response.body).toEqual({ "message": "Não foi possível processar a sua solicitação.", "status": 400 })
  })

  it('Should not create a new phone with invalid body fields values.', async () => {

    const response = await request(app).post('/phones').send({
      person_id: 1,
      phone_number: "11",
      contact: "Fabrizio Panato",
      created_at: formatDate(new Date())
    })

    expect(response.body).toEqual({ "message": "Valor(es) inválido(s) no corpo da requisição.", "status": 400 })
  })

  it('Should not create a new phone with wrong body fields.', async () => {

    const response = await request(app).post('/phones').send({
      person_id: 1000,
      phone_number: "11968568913",
      contact: "Fabrizio Panato",
      created_at: formatDate(new Date()),
      wrongField: "value"
    })

    expect(response.body).toEqual({ "message": "Campo(s) inesperado(s) no corpo da requisição.", "status": 400 })
  })

  it('Should not update a phone with invalid body fields values.', async () => {

    const response = await request(app).patch('/phones/1').send({
      phone_number: "11",
      contact: "Fabrizio Panato",
      updated_at: formatDate(new Date())
    })

    expect(response.body).toEqual({ "message": "Valor(es) inválido(s) no corpo da requisição.", "status": 400 })
  })

  it('Should not update a phone with wrong body fields.', async () => {

    const response = await request(app).patch('/phones/1').send({
      phone_number: "11968568913",
      contact: "Fabrizio Panato",
      updated_at: formatDate(new Date()),
      wrongField: "value"
    })

    expect(response.body).toEqual({ "message": "Campo(s) inesperado(s) no corpo da requisição.", "status": 400 })
  })
})