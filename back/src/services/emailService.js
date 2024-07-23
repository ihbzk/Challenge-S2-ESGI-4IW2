const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
const dotenv = require("dotenv").config({ path: "./.env.local" });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, // true pour le port 465, false pour les autres ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Chemin vers les templates de mails
const viewPath = path.resolve(__dirname, "../mails/templates");

transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extname: ".hbs",
      layoutsDir: viewPath,
      defaultLayout: false,
    },
    viewPath: viewPath,
    extName: ".hbs",
  })
);

async function sendMail({ from, to, subject, text, template, context }) {
  try {
    const mailOptions = {
      from: from,
      to: to,
      subject: subject,
      text: text,
      template: template,
      context: context,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email envoyé : %s", info.messageId);

    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

module.exports = { sendMail };
