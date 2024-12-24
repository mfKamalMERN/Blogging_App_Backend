const express = require('express');
const uploadAttachment = require('../Multer/Attachments.js');
const { NewMail, GetReceivedMails, GetSentMails, GetMailDetails, UnsendEmail } = require('../Controllers/emailControllers.js');

const emailRouter = express.Router();

emailRouter.post('/newmail/:loggeduserid', uploadAttachment.array('files'), NewMail);

emailRouter.get('/emailsreceived/:loggeduserid', GetReceivedMails);

emailRouter.get('/emailssent/:loggeduserid', GetSentMails);

emailRouter.get('/emaildetails/:emailid/:loggeduserid', GetMailDetails);

emailRouter.delete('/unsendemail/:emailid/:loggeduserid', UnsendEmail);

exports.emailRoute = emailRouter;
