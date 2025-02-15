import request from "supertest";
import express from 'express'


const app = express();


app.get('/hello', (req, res) =>  res.sendStatus(200).send({}));


describe('hello endpoint', () => {
    it('get /hello and expect 200', async () => {
       const response = await request(app).get('/hello');
       expect(response.statusCode).toBe(200);
       expect(response.body).toEqual({});''
    })
})