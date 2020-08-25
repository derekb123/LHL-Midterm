require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNum = process.env.TWILIO_PHONE_NUMBER;

const twilio =require ('twilio');

const sendSms = (phone, message) => {
  const client = twilio.(accountSid, authToken);
  client.messages
    .create({
      body: message,
      from: twilioNum,
      to: phone  // need 3 funcs that send msg to client,  send msg to restaurant, and receive msd from restaurant
    })
    .then(message => console.log(message.sid));
}

module.exports = sendSms;
