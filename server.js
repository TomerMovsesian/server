const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  })
);
app.disable("x-powered-by");

const port = process.env.PORT || 4000;

console.log("zoho uname: " + process.env.USER);
console.log("zoho password: " + process.env.PASSWORD);

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD,
  },
});

app.get("/sendEmail", (req, res) => {
  res.status(200).send("Server is running and healthy");
});

app.post("/sendEmail", (req, res) => {
  const { to, htmlContent } = req.body;
  console.log("to: " + to);
  console.log("htmp content: " + htmlContent);

  if (!htmlContent || htmlContent.length === 0) {
    return res.status(400).json({ error: "No data received from the client" });
  }

  const mailOptions = {
    from: process.env.EMAIL,
    to: to,
    subject: "Your Order Details",
    replyTo: process.env.USER,
    html: htmlContent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Error sending email. Please try again later." });
    }
    console.log("Email sent: " + info.response);
    res.status(200).json("Email sent successfully");
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
