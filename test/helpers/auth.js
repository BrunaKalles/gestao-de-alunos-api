import { api } from './api.js';
import 'dotenv/config'

export async function getToken(emailUser, passUser) {
        const resposta = await api()
                .post('/api/auth/login')
                .set('Content-Type', 'application/json')
                .send({
                        email: emailUser,
                        senha: passUser
                });

        return resposta.body.token;

}

export async function comTokenDeAdmin() {
        const email = process.env.ADMIN_EMAIL;
        const senha = process.env.ADMIN_SENHA;
        const loginResposta = await api()
                .post('/api/auth/login')
                .set('Content-Type', 'application/json')
                .send({
                        email,
                        senha
                });

        return `Bearer ${loginResposta.body.token}`;

}
