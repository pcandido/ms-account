import request from 'supertest'
import app from '@main/config/app'
import { MongoHelper } from '@gateways/helpers/mogodb-helper'
import { QueueHelper } from '@gateways/helpers/queue-helper'
import { Collection } from 'mongodb'
import config from '@utils/config'


describe('POST /password-recovery', () => {

  const givenRoute = '/password-recovery'
  const givenEmail = 'any@email.com'
  const givenName = 'any name'
  let accountsCollection: Collection

  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
    await accountsCollection.insertOne({
      name: givenName,
      email: givenEmail,
      password: '$2b$12$BQwxpEG4DiXrJIj7EvTiFOzbRlkctrKB9pgajOmhyqY1uXYfV4mAu',
    })
  })

  it('should return 400 if no email is provided', async () => {
    await request(app)
      .post(givenRoute)
      .send({})
      .expect(400)
  })

  it('should return 400 if an invalid email is provided', async () => {
    await request(app)
      .post(givenRoute)
      .send({ email: 'invalid email' })
      .expect(400)
  })

  it('should return 404 if provided email does not exists in accounts collection', async () => {
    await request(app)
      .post(givenRoute)
      .send({ email: 'inexistent@email.com' })
      .expect(404)
  })

  it('should return 200 and add an email to queue on success', async done => {
    request(app)
      .post(givenRoute)
      .send({ email: givenEmail })
      .end(async (err, res) => {
        expect(err).toBeFalsy()
        expect(res.status).toBe(200)

        const message = await QueueHelper.getMessage(config.app.passwordRecovery.queueName)
        expect(JSON.parse(message.toString())).toEqual({
          to: givenEmail,
          subject: expect.any(String),
          body: expect.stringContaining(givenName),
        })

        done()
      })
  })

})
