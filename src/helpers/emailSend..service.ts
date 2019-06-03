import * as nodemailer from 'nodemailer';

export const SendEmailService = {

    mailOption: {
      from: '2930298153@qq.com',
      to: null, // 收件人
      subject: null, // 纯文本
      html: null, // 发送内容
    },

    sendMSg(html, to, subject, code) {
        this.mailOption.to = to;
        this.mailOption.subject = subject;
        this.mailOption.html = `<h1>${html}</h1>`;

        return new Promise((resolve) => {
            const res = {retCode: '', retMsg: '', content: ''};

            nodemailer.createTransport({ // 邮件传输
                service: 'qq',
                port: 456,
                secure: false,
                auth: {
                    user: '2930298153@qq.com',
                    pass: 'lsekqawgktufddab',
                },
            }).sendMail(this.mailOption, (error) => {
                if (error) {
                    res.retCode = 'fail';
                    res.retMsg = '发送失败，请重新发送';
                    res.content = null;
                } else {
                    res.retCode = 'success';
                    res.content = code;
                    res.retMsg = '发送成功';
                }
                resolve(res);
            });
        });
    },
};