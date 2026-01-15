require('dotenv').config();  // load your .env

const nodemailer = require("nodemailer");

async function testMail() {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    let info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: "your_email@gmail.com", // can be same as EMAIL
      subject: "Test Email",
      text: "Hello from Nodemailer!"
    });
    console.log("Email sent:", info.response);
  } catch (err) {
    console.error("Email error:", err.message);
  }
}

testMail();
