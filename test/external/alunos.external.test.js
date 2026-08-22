import request from 'supertest';
import { expect } from 'chai';
import { getToken } from '../helpers/auth.js';


describe('Login', () =>{
    let token
    
    beforeEach(async ()=>{
        token = await getToken('admin@escola.com', 'admin123');
    })

    it('deve cadastrar um aluno quando ele informa dados válidos', async () =>{

        //cadastrar o aluno
        const cadastroAlunoResposta = await request('http://localhost:3000')
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({ 
                nome: 'Bruna Gomes',
                email: 'bruna.gomes@example.com',
                matricula: '2026-0001',
                senha: '123456'
            });


        //validar que ele foi cadastrado
        expect(cadastroAlunoResposta.status).to.be.equal(201);
        expect(cadastroAlunoResposta.body.nome).to.be.equal('Bruna Gomes');
        expect(cadastroAlunoResposta.body.email).to.be.equal('bruna.gomes@example.com');
        expect(cadastroAlunoResposta.body.matricula).to.be.equal('2026-0001');
    });

    it.only('deve negar o cadastro de um aluno quando ele já existe', async () =>{

        //cadastrar o aluno
        const cadastroAlunoResposta = await request('http://localhost:3000')
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({ 
                nome: 'Ana Souza', 
                email: 'ana.souza@example.com', 
                matricula: '2024001',
                senha: '123456' 
            });


        //validar que ele foi cadastrado
        expect(cadastroAlunoResposta.status).to.be.equal(409);
        expect(cadastroAlunoResposta.body.error).to.equal('Já existe um aluno cadastrado com essa matrícula ou e-mail.')
    });
});
