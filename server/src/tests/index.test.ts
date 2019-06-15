import expect from 'expect';
import request from 'supertest';
import app from '../'


describe('API', () => {
    it('Should return 200', done => {
        request(app)
            .get('/')
            .expect(200)
            .end(done)
    })
})