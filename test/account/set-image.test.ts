import request from 'supertest'
import path from 'path'
import { Collection, ObjectId } from 'mongodb'
import app from '@main/config/app'
import { MongoHelper } from '@gateways/helpers/mogodb-helper'

describe('POST /set-image', () => {

  const givenRoute = '/set-image'
  const givenAuthorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblR5cGUiOiJhY2Nlc3MiLCJpZCI6IjYwNmU2ODcwYzZiNDdiYzQ5ZjU1MWYxZSIsIm5hbWUiOiJhbnkgbmFtZSIsImVtYWlsIjoidmFsaWRAbWFpbC5jb20iLCJpYXQiOjk0NjY5MjAwMCwiZXhwIjozMjQ3MjE0NDAwMH0.BEyDozhXPI7ZleJPJU9P1RRj7CppGZpw_6pMCBx5gso'
  const givenAccount = {
    _id: new ObjectId('606e6870c6b47bc49f551f1e'),
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

  it('should return 401 if no authorization is provided', async () => {
    await request(app)
      .post(givenRoute)
      .attach('image', path.join(__dirname, '..', 'fixtures', 'image.jpeg'))
      .expect(401)
  })

  it('should return 400 if no file is provided', async () => {
    await request(app)
      .post(givenRoute)
      .set('authorization', givenAuthorization)
      .send({})
      .expect(400)
      .expect({ message: 'Missing param: image' })
  })

  it('should return 400 if file is not an image', async () => {
    await request(app)
      .post(givenRoute)
      .set('authorization', givenAuthorization)
      .attach('image', path.join(__dirname, '..', 'fixtures', 'file.txt'))
      .expect(400)
      .expect({ message: 'Invalid param: image' })
  })

  it('should return 200 on success', async done => {
    request(app)
      .post(givenRoute)
      .set('authorization', givenAuthorization)
      .attach('image', path.join(__dirname, '..', 'fixtures', 'image.jpeg'))
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)

        expect(res.body).toEqual({
          uri: expect.stringMatching(/^https?:\/\//),
          uri64: expect.stringMatching(/^https?:\/\/.+_64$/),
          uri256: expect.stringMatching(/^https?:\/\/.+_256$/),
        })

        done()
      })
  })

})

