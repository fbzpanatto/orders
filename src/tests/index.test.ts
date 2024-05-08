import { describe, test, expect } from "@jest/globals"
import { sum } from './index'
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

    console.log(response.body)

    expect(response.ok).toBeTruthy()
  })
})