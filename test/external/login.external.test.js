import request from 'supertest';
//import app from '../src/app.js';
import { expect } from 'chai';


describe('Login', () =>{
    it('deve retornar 200 quando usuário e senha forem corretos', async () =>{
        const loginResposta = await request('http://localhost:3000')
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                email: 'admin@escola.com',
                senha: 'admin123'});

        expect(loginResposta.status).to.equal(200);
    });

    it('deve retornar 401 quando informado usuário incorreto', async () =>{
        const loginResposta = await request('http://localhost:3000')
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                email: 'admin1@escola.com',
                senha: 'admin123'});

        expect(loginResposta.status).to.equal(401);
        expect(loginResposta.body.error).to.equal('E-mail ou senha inválidos.');
    });

    it('deve retornar 401 quando informada senha incorreta', async () =>{
        const loginResposta = await request('http://localhost:3000')
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                email: 'admin@escola.com',
                senha: 'admin1234'});

        expect(loginResposta.status).to.equal(401);
        expect(loginResposta.body.error).to.equal('E-mail ou senha inválidos.');
    });

    it('deve retornar 400 quando informado nome do campo email incorreto', async () =>{
        const loginResposta = await request('http://localhost:3000')
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                email1: 'admin@escola.com',
                senha: 'admin123'});

        expect(loginResposta.status).to.equal(400);
        expect(loginResposta.body.error).to.equal('Os campos "email" e "senha" são obrigatórios.');
    });
    it('deve retornar 400 quando informado nome do campo senha incorreto', async () =>{
        const loginResposta = await request('http://localhost:3000')
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                email: 'admin@escola.com',
                senha1: 'admin123'});

        expect(loginResposta.status).to.equal(400);
        expect(loginResposta.body.error).to.equal('Os campos "email" e "senha" são obrigatórios.');
    });
})
