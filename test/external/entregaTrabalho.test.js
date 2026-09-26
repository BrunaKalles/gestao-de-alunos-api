import { expect } from 'chai';
import { api } from '../helpers/api.js';
import { comTokenDeAdmin, getToken } from '../helpers/auth.js';
import testData from '../fixtures/testData.json' with { type: 'json' };
import matriculas from '../fixtures/matriculas.json' with { type: 'json' };

describe('Fluxo de cadastro e entrega de trabalho', () => {
	it('deve cadastrar um aluno e registrar uma entrega como aluno', async () => {
		const identificador = Date.now();
		const entregaBase = testData.entregas[0];
		const dadosAluno = {
			...matriculas[0].dadosAluno,
			nome: `Aluno-Teste-${identificador}`,
			email: `aluno.${identificador}@example.com`,
			matricula: `MAT-${identificador}`,
		};
		const disciplinaId = entregaBase.disciplinaId;
		const adminToken = await comTokenDeAdmin();

		const loginAdminResposta = await api()
			.post('/api/auth/login')
			.set('Content-Type', 'application/json')
			.send({
				email: process.env.ADMIN_EMAIL,
				senha: process.env.ADMIN_SENHA,
			});

		expect(loginAdminResposta.status).to.equal(200);
		expect(loginAdminResposta.body.usuario.role).to.equal('admin');

		const disciplinaResposta = await api()
			.get(`/api/admin/disciplinas/${disciplinaId}`)
			.set('Authorization', adminToken);

		expect(disciplinaResposta.status).to.equal(200);
		expect(disciplinaResposta.body.id).to.equal(disciplinaId);

		const cadastroAlunoResposta = await api()
			.post('/api/admin/alunos')
			.set('Authorization', adminToken)
			.send(dadosAluno);

		expect(cadastroAlunoResposta.status).to.equal(201);
		const alunoId = cadastroAlunoResposta.body.id;
		expect(alunoId).to.be.a('string');

		const matriculaResposta = await api()
			.post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
			.set('Authorization', adminToken)
			.send({ alunoId });

		expect(matriculaResposta.status).to.equal(201);
		expect(matriculaResposta.body.alunoId).to.equal(alunoId);
		expect(matriculaResposta.body.disciplinaId).to.equal(disciplinaId);

		const alunoToken = await getToken(dadosAluno.email, dadosAluno.senha);
		expect(alunoToken).to.be.a('string').and.not.empty;

		const entregaResposta = await api()
			.post(`/api/alunos/${alunoId}/trabalhos`)
			.set('Authorization', `Bearer ${alunoToken}`)
			.send({
				disciplinaId,
				titulo: `${entregaBase.titulo} ${identificador}`,
				descricao: entregaBase.descricao,
			});

		expect(entregaResposta.status).to.equal(201);
		expect(entregaResposta.body.alunoId).to.equal(alunoId);
		expect(entregaResposta.body.disciplinaId).to.equal(disciplinaId);
		expect(entregaResposta.body.status).to.equal('entregue');
	});
});
