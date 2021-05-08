const express = require("express");
const sgMail = require("@sendgrid/mail"); // SENDGRID_API_KEY
const { scheduleJob } = require("node-schedule");
const schedule = require("node-schedule");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const createError = require("http-errors");
const { NotExtended } = require("http-errors");
const User = require("../models/User");
const { verifyAccessToken } = require("../helpers/token");
const router = express.Router();

router.post("/remind",verifyAccessToken ,async (req, res, next) => {
  try {
    const email = "guptasajal6@gmail.com";
    // const someDate = new Date("2021-05-05T17:40:00.458Z")

    const { date, subject, body, userId ,recurrent} = req.body;

    if (!date || !subject || !body ||!recurrent) {
      throw createError.BadRequest("All fields are required");
    }
    if (!userId) {
      throw createError.BadRequest("User Must be Logged In");
    }
    var datetime = new Date(date);

    if (datetime.getTime() < new Date().getTime()) {
      throw createError.BadRequest("Invalid Time");
    }

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,

      subject: subject,
      html: `
                <p>${body}</p>
                
                <hr />
            
            `,
    };
    if(recurrent=="Only Once"){
      await scheduleJob(subject, datetime, () => {
        sgMail.send(emailData).then((sent) => {
          console.log("Message Sent");
        });
        console.log("Job run");
      });
      return res.send({ message: "Reminder has been set" });
    }else if (recurrent=="Daily"){
      await scheduleJob(subject, ` ${datetime.getMinutes()} ${datetime.getHours()} * * * `, () => {
        sgMail.send(emailData).then((sent) => {
          console.log("Message Sent");
        });
        console.log("Job run");
      });
      return res.send({ message: "Reminder has been set" });
    }
    else if (recurrent=="Monthly"){
      await scheduleJob(subject, `${datetime.getMinutes()} ${datetime.getHours()} 1 * *`, () => {
        sgMail.send(emailData).then((sent) => {
          console.log("Message Sent");
        });
        console.log("Job run");
      });
      return res.send({ message: "Reminder has been set" });
    }
    else if (recurrent=="Weekly"){
      await scheduleJob(subject, `${datetime.getMinutes()} ${datetime.getHours()} * * 1-7`, () => {
        sgMail.send(emailData).then((sent) => {
          console.log("Message Sent");
        });
        console.log("Job run");
      });
      return res.send({ message: "Reminder has been set" });
    }
    
  } catch (error) {
    next(error);
  }
});

router.post("/cancel_remind",verifyAccessToken, async (req, res, next) => {
  try {
    const { subject } = req.body;
    schedule.cancelJob(subject);
    res.send({ message: "Reminder deleted Successfully" });
  } catch (error) {
    next(error);
  }
});


module.exports = router;
