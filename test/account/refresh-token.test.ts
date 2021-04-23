import request from 'supertest'
import app from '@main/config/app'
import { MongoHelper } from '@gateways/helpers/mogodb-helper'
import { Collection } from 'mongodb'

describe('POST /refresh-token', () => {

  const givenRoute = '/refresh-token'
  const givenAuthorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblR5cGUiOiJhY2Nlc3MiLCJpZCI6IjEyMyIsIm5hbWUiOiJhbnkgbmFtZSIsImVtYWlsIjoidmFsaWRAbWFpbC5jb20iLCJpYXQiOjk0NjY5MjAwMCwiZXhwIjozMjQ3MjE0NDAwMH0.FVxr-iFByo3N59NxpPn7yWu4-7PZXpbh5_aIhKSHJ-g'
  const givenAccount = {
    name: 'any name',
    email: 'valid@mail.com',
    password: '$2b$12$BQwxpEG4DiXrJIj7EvTiFOzbRlkctrKB9pgajOmhyqY1uXYfV4mAu',
  }
  let accountsCollection: Collection

  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
    await accountsCollection.insertOne(givenAccount)
  })

  it('should return 400 if no refresh-token is provided', async () => {
    await request(app)
      .post(givenRoute)
      .set('authorization', givenAuthorization)
      .send({})
      .expect(400)
  })

  it('should return 401 if provided token is invalid', async () => {
    await request(app)
      .post(givenRoute)
      .set('authorization', givenAuthorization)
      .send({ refreshToken: 'invalid_token' })
      .expect(401)
  })

  it('should return 401 if provided token is expired', async () => {
    const givenExpiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblR5cGUiOiJyZWZyZXNoIiwiZW1haWwiOiJ2YWxpZEBtYWlsLmNvbSIsImlhdCI6OTQ2NjkyMDAwLCJleHAiOjk0NjY5MjAwMX0.hmzpNx5SAR6o7XY7TdJzjXHm10yFuGWC_h3HHj4tCcA'

    await request(app)
      .post(givenRoute)
      .set('authorization', givenAuthorization)
      .send({ refreshToken: givenExpiredToken })
      .expect(401)
  })

  it('should return 200 and new tokens on success', async () => {
    const givenRefreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblR5cGUiOiJyZWZyZXNoIiwiaWQiOiIxMjMiLCJuYW1lIjoiYW55IG5hbWUiLCJlbWFpbCI6InZhbGlkQG1haWwuY29tIiwiaWF0Ijo5NDY2OTIwMDAsImV4cCI6OTU2MTc1OTQ4MDB9.5XhqpjOs6JIBrxGwGq7r-nTxkzqrJnO52KgpfK3XdJU'

    await request(app)
      .post(givenRoute)
      .set('authorization', givenAuthorization)
      .send({ refreshToken: givenRefreshToken })
      .expect(200)
      .expect(/"accessToken" *: *"[a-zA-Z0-9-_.]+"/)
      .expect(/"refreshToken" *: *"[a-zA-Z0-9-_.]+"/)
  })

})

