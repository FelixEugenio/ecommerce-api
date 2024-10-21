const transporter = require('nodemailer').createTestAccount(require('../config/email'));
const {root:link} = require('../config/index');

module.exports = ({user,recovery},cb) => {
    const message = `
    <h1 style="text-align: center">Recuperação de senha"</h1>
    <br />
    <p>
    Aqui esta o link para recuperar a sua senha
    </p>
    <a href="${link}/v1/api/users/password-recovery?token=${recovery.token}">
    ${link}/v1/api/users/password-recovery?token=${recovery.token}
    </a>
    <br /><br /><hr />
    <p>
    OBS: Se voce não solicitou esta alteração de senha, ignore este email
    </p>
    <br />
    <p>
    Este e-mail foi enviado automaticamente, por favor, não responda.
    </p>
    `;

    const mailOptions = {
        from: 'mavila-shop@ecommerce.com',
        to: user.email,
        subject: 'Recuperação de senha',
        html: message
    };

    if(process.env.NODE_ENV !== 'production'){
          transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                  console.log(error);
                  return  cb('Aconteceu um erro',null);
              }else{
                return  cb(null,'Link para recuperar a sua senha enviado com sucesso');
              }
          })
    }else{
        console.log(mailOptions);
        return  cb(null,'Link para recuperar a sua senha enviado com sucesso');
    }
}