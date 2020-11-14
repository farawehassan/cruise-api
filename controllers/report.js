const Report = require('../models/Report');
const { validationResult } = require('express-validator');

exports.create = async (req, res, next) => {
  const abuserFullName = req.body.abuserFullName;
  const abuserEmail = req.body.abuserEmail;
  const abuserPhone = req.body.abuserPhone;
  const abuserFacebook = req.body.abuserFacebook;
  const abuserTwitter = req.body.abuserTwitter;
  const abuserInstagram = req.body.abuserInstagram;
  const anonymous = req.body.anonymous;
  const evidence = req.body.evidence;
  const personName = req.body.personName;
  const personPhone = req.body.personPhone;
  const personEmail = req.body.personEmail;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ error: true, message: errors.array()[0].msg });
  }

  await Report.create({
    abuserFullName: abuserFullName,
    abuserEmail: abuserEmail,
    abuserPhone: abuserPhone,
    abuserFacebook: abuserFacebook,
    abuserTwitter: abuserTwitter,
    abuserInstagram: abuserInstagram,
    anonymous: anonymous,
    evidence: evidence,
    personName: personName,
    personPhone: personPhone,
    personEmail: personEmail,
  }).then((report) => {
    return res.status(201).send({ error: false, message: "Successfully saved reports", data: report });
  }).catch((err) => {
    console.log(err);
    return res.status(500).send({ error: true, message: "Error in saving report" });
  });
};

exports.getAll = async (req, res, next) => {
  try {
    const reports = await Report.find().sort('created_at');
    return res.status(200).send({ error: false, message: "Sucessfully fetched all reports", data: reports });
  } catch (error) {
    return res.status(500).send({ error: true, message: "Database operation failed" });
  }
}

exports.getOne = async (req, res, next) => {
  const reportId = req.params.id;
  try {
    const reports = await Report.findById(reportId);
    return res.status(200).send({ error: false, message: "Sucessfully fetched report", data: reports });
  } catch (error) {
    return res.status(500).send({ error: true, message: "Report not found" });
  }
}

exports.deleteOne = async (req, res, next) => {
  const reportId = req.params.id;

  await Report.deleteOne({ _id: reportId }
  ).then((message) => {
    return res.status(200).send({ error: false, message: 'Successfully deleted report' });
  }).catch((err) => {
    return res.status(404).send({ error: true, message: 'Report not found' });
  });
}