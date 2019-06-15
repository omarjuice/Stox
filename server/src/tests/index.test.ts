import expect from 'expect';
import request from 'supertest';
import app from '../'
import db from '../db'

describe('API', () => {
    it('Should return 200', done => {
        request(app)
            .get('/api')
            .expect(200)
            .end(done)
    })
    it('DB should not throw errors', async () => {
        const { rows: [result] } = await db.query('SELECT NOW()');
        expect(result.now instanceof Date).toBe(true)
    })
})