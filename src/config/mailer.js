const nodemailer = require("nodemailer");
exports.transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: 'notificacionesservidoremail@gmail.com',
      pass: 'pvkmiubkqwmwpesm'
    }
});
exports.bodyEmail = function (username, code) {
    return `<table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tbody>
                    <tr>
                        <td>
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tbody>
                                    <tr>
                                        <td style="font-size:36px;line-height:42px;font-family:Arial,sans-serif,'Motiva Sans';text-align:left;padding-bottom:30px;color:#bfbfbf;font-weight:bold">
                                            <span style="color:#77b9ee">` + username + `</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tbody>
                                <tr>
                                    <td style="font-size:18px;line-height:25px;font-family:Arial,sans-serif,'Motiva Sans';text-align:left;color:#030303;padding-bottom:30px">Parece que estás intentando recuperar tu contraseña. Aquí tienes el código que necesitas para restablecer tu contraseña :</td>
                                </tr>
                                </tbody>
                            </table>
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tbody>
                                    <tr>
                                        <td class="m_-8522262024239693025mpb-50" style="padding-bottom:70px">
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#17191c">
                                                <tbody>
                                                    <tr>
                                                        <td style="padding-top:30px;padding-bottom:30px;padding-left:56px;padding-right:56px">
                                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                <tbody>
                                                                    <tr>
                                                                        <td style="padding-bottom:16px"></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="font-size:48px;line-height:52px;font-family:Arial,sans-serif,'Motiva Sans';color:#3a9aed;font-weight:bold;text-align:center">` + code + `</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>`;
};
  
