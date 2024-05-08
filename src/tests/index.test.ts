import { describe, test, expect } from "@jest/globals"
import { sum } from './index'
import supertest from 'supertest'
import app from '../app'

const request = supertest(app)

describe('Sum function2', () => {
  it('Returns correct value', () => {
    expect(sum(2, 3)).toEqual(5)
  })

  it('Return Hello World', () => {
    const response = request.get('/api')

    expect(response.ok).toBeTruthy()
  })
})