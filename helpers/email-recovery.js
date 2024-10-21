const nodemailer = require('nodemailer');
const { root: link } = require('../config/index');

module.exports = async ({ user, recovery }, cb) => {
    // Criação de conta de teste do Nodemailer
    let testAccount = await nodemailer.createTestAccount(require('../config/email'));

    // Criação do transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        // true para 465, false para outros
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const message = `
    <h1 style="text-align: center">Recuperação de senha</h1>
    <br />
    <p>Aqui está o link para recuperar a sua senha:</p>
    <a href="${link}/v1/api/users/password-recovery?token=${recovery.token}">
        ${link}/v1/api/users/password-recovery?token=${recovery.token}
    </a>
    <br /><br /><hr />
    <p>OBS: Se você não solicitou esta alteração de senha, ignore este email.</p>
    <br />
    <p>Este e-mail foi enviado automaticamente, por favor, não responda.</p>
    `;

    const mailOptions = {
        from: 'mavila-shop@ecommerce.com',
        to: user.email,
        subject: 'Recuperação de senha',
        html: message,
    };

    try {
        // Enviar e-mail
        await transporter.sendMail(mailOptions);
        cb(null, 'Link para recuperar a sua senha enviado com sucesso');
    } catch (error) {
        console.log(error);
        cb('Aconteceu um erro', null);
    }
};
