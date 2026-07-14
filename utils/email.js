const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) Create Transporter
  const port = Number(process.env.EMAIL_PORT);
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.EMAIL_USERNAME.trim(),
      pass: process.env.EMAIL_PASSWORD.trim(),
    },
  });

  // 2) Define mail options
  const mailOptions = {
    from: "Naveen Patibandla <patibandlanaveen99@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Send the mail
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
