const { transporter }  = require('../config/mailer');

async function sendMailCode(fromTitle, email, body){
	await transporter.sendMail({
		from: fromTitle + ' <notificacionesservidoremail@gmail.com>',
		to: email,
		subject: fromTitle,
		html: body,
	});
}

module.exports = {
  sendMailCode
};