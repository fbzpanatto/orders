import { describe, test, expect } from "@jest/globals"
import { sum } from './index'
import supertest from 'supertest'
import app from '../app'

import dotenv from 'dotenv';
dotenv.config();

const request = supertest(app)

describe('Sum function2', () => {
  it('Returns correct value', () => {
    expect(sum(2, 3)).toEqual(5)
  })

  it('Return Hello World', () => {
    const response = request.get('/api')

    console.log(process.env.PORT, process.env.DATABASE)

    expect(response.ok).toBeTruthy()
  })
})