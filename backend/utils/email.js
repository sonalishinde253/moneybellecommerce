import Nodemailer from "nodemailer";
import { MailtrapTransport } from"mailtrap";

const TOKEN = "40664e8f9ff94864289acab5751cebe1";

const transport = Nodemailer.createTransport(
  MailtrapTransport({
    token: TOKEN,
  })
);

const sender = {
  address: "hello@demomailtrap.co",
  name: "Password Reset",
};
const recipients = [
  "sonaliaher.77@gmail.com",
];

const sendMail = (options) =>{
  console.log(options);
  transport
  .sendMail({
    from: sender,
    to: recipients,
    subject: options.subject,
    text: options.message,
  })
  .then((res)=>{
    console.log("Email sent ",res);
  })
  .catch((err)=>{
    console.log("Mail not sent ",err);
  })
};

  export default sendMail;


  