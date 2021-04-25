import request from 'supertest'
import app from '@main/config/app'
import { MongoHelper } from '@gateways/helpers/mogodb-helper'
import { Collection } from 'mongodb'
import { BCryptAdapter } from '@gateways/adapters/bcrypt-adapter/bcrypt-adapter'


describe('POST /password-reset', () => {

  const givenRoute = '/password-reset'
  const givenEmail = 'any@email.com'
  const givenPassword = 'new password'
  const givenToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFueUBlbWFpbC5jb20iLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MzI1MDM2ODAwMDB9.7o-dCutkoNXdF1FnG855S_OdFzHitZDmtD19IF3qiRg'
  let accountsCollection: Collection

  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
    await accountsCollection.insertOne({
      name: 'any name',
      email: givenEmail,
      password: '$2b$12$BQwxpEG4DiXrJIj7EvTiFOzbRlkctrKB9pgajOmhyqY1uXYfV4mAu',
    })
  })

  it('should return 400 if no token is provided', async () => {
    await request(app)
      .post(givenRoute)
      .send({ password: givenPassword, passwordConfirmation: givenPassword })
      .expect(400)
  })

  it('should return 400 if no password is provided', async () => {
    await request(app)
      .post(givenRoute)
      .send({ token: givenToken, passwordConfirmation: givenPassword })
      .expect(400)
  })

  it('should return 400 if no passwordConfirmation is provided', async () => {
    await request(app)
      .post(givenRoute)
      .send({ token: givenToken, password: givenPassword })
      .expect(400)
  })

  it('should return 400 if password and passwordConfirmation do not match', async () => {
    await request(app)
      .post(givenRoute)
      .send({ token: givenToken, password: givenPassword, passwordConfirmation: 'other password' })
      .expect(400)
  })

  it('should return 400 if token is invalid', async () => {
    await request(app)
      .post(givenRoute)
      .send({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFueUBlbWFpaC5jb20iLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MzI1MDM2ODAwMDB9.7o-dCutkoNXdF1FnG855S_OdFzHitZDmtD19IF3qiRg',
        password: givenPassword,
        passwordConfirmation: givenPassword,
      })
      .expect(400)
  })

  it('should change password on success', async done => {
    request(app)
      .post(givenRoute)
      .send({ token: givenToken, password: givenPassword, passwordConfirmation: givenPassword })
      .end(async (err, res) => {
        expect(err).toBeFalsy()
        expect(res.status).toBe(200)

        const updated = await accountsCollection.findOne({ email: givenEmail })
        const bcrypt = new BCryptAdapter()
        const validPassword = await bcrypt.compare(givenPassword, updated.password)

        expect(validPassword).toBeTruthy()
        done()
      })
  })

})
