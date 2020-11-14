const User = require('../models/User');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    return res.status(200).send({ error: false, message: "Sucessfully fetched user", data: user });
  } catch (error) {
    return res.status(500).send({ error: true, message: "Database operation failed" });
  }
}

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort('created_at').select('-__v -password');
    return res.status(200).send({ error: false, message: "Sucessfully fetched all users", data: users });
  } catch (error) {
    return res.status(500).send({ error: true, message: "Database operation failed" });
  }
}

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ error: true, message: errors.array()[0].msg });
  }

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(401).send({ error: true, message: "User does not exist" });
      }
      loadedUser = user;
      bcrypt.compare(password, user.password)
        .then(result => {
          if (result) {
            const token = jwt.sign(
              {
                email: loadedUser.email,
                userId: loadedUser._id.toString(),
              },
              `${process.env.JWT_SECRET}`
            );
            var details = {
              id: loadedUser._id.toString(),
              email: loadedUser.email,
              phone: loadedUser.phone,
              motivation: loadedUser.motivation,
              experience: loadedUser.experience,
              type: loadedUser.type,
              role: loadedUser.role,
              profile: loadedUser.profile,
              certificate: loadedUser.certificate,
              verified: loadedUser.verified,
              createdAt: loadedUser.created_at,
              updatedAt: loadedUser.updated_at,
              token: token
            };
            return res.status(200).send({ error: false, message: "User logged in successfully", data: details });
          } else if (!result) {
            return res.status(401).send({ error: true, message: "Incorrect password" });
          }
        })
        .catch(err => {
          console.log(err);
          return res.status(500).send({ error: true, message: "Database operation failed, please try again" });
        });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send({ error: true, message: "Database operation failed, please try again" });
    });
};

exports.signup = (req, res, next) => {
  const email = req.body.email;
  const phone = req.body.phone;
  const motivation = req.body.motivation;
  const experience = req.body.experience;
  const role = req.body.role;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ error: true, message: errors.array()[0].msg });
  }

  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email: email,
        phone: phone,
        motivation: motivation,
        experience: experience,
        role: role,
        password: hashedPassword,
      });
      return user.save();
    })
    .then(result => {
      return res.status(201).send({ error: false, message: "User created successfully" });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send({ error: true, message: "Database operation failed, please try again" });
    });
};

exports.adminLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ error: true, message: errors.array()[0].msg });
  }

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(401).send({ error: true, message: "User does not exist" });
      }
      if (user.role !== 'admin') {
        return res.status(401).send({ error: true, message: "You do not have access" });
      }
      loadedUser = user;
      bcrypt.compare(password, user.password)
        .then(result => {
          if (result) {
            const token = jwt.sign(
              {
                email: loadedUser.email,
                userId: loadedUser._id.toString(),
              },
              `${process.env.JWT_SECRET}`
            );
            var details = {
              id: loadedUser._id.toString(),
              email: loadedUser.email,
              phone: loadedUser.phone,
              motivation: loadedUser.motivation,
              experience: loadedUser.experience,
              type: loadedUser.type,
              role: loadedUser.role,
              profile: loadedUser.profile,
              certificate: loadedUser.certificate,
              verified: loadedUser.verified,
              createdAt: loadedUser.created_at,
              updatedAt: loadedUser.updated_at,
              token: token
            };
            return res.status(200).send({ error: false, message: "User logged in successfully", data: details });
          } else if (!result) {
            return res.status(401).send({ error: true, message: "Incorrect password" });
          }
        })
        .catch(err => {
          console.log(err);
          return res.status(500).send({ error: true, message: "Database operation failed, please try again" });
        });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send({ error: true, message: "Database operation failed, please try again" });
    });
};

exports.adminSignup = (req, res, next) => {
  const email = req.body.email;
  const phone = req.body.phone;
  const motivation = req.body.motivation;
  const experience = req.body.experience;
  const role = 'admin';
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ error: true, message: errors.array()[0].msg });
  }

  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email: email,
        phone: phone,
        motivation: motivation,
        experience: experience,
        role: role,
        password: hashedPassword,
      });
      return user.save();
    })
    .then(result => {
      return res.status(201).send({ error: false, message: "User created successfully" });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send({ error: true, message: "Database operation failed, please try again" });
    });
};

exports.getAllAdmins = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'admin' }).sort('created_at').select('-__v -password');
    return res.status(200).send({ error: false, message: "Sucessfully fetched all admins", data: users });
  } catch (error) {
    return res.status(500).send({ error: true, message: "Database operation failed" });
  }
}

exports.getAllIndividuals = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'individual' }).sort('created_at').select('-__v -password');
    return res.status(200).send({ error: false, message: "Sucessfully fetched all individuals", data: users });
  } catch (error) {
    return res.status(500).send({ error: true, message: "Database operation failed" });
  }
}

exports.getAllOrganizations = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'organization' }).sort('created_at').select('-__v -password');
    return res.status(200).send({ error: false, message: "Sucessfully fetched all organizations", data: users });
  } catch (error) {
    return res.status(500).send({ error: true, message: "Database operation failed" });
  }
}

exports.forgetPassword = (req, res, next) => {
  if (!req.body.email) return res.status(400).send({ error: true, message: 'Email is required' });

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ error: true, message: "Please try again" });
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(400).send({ error: true, message: 'No account with that email found.' });
        }
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        var transporter = nodemailer.createTransport({
          service: 'SendGrid',
          auth: {
            user: 'apikey',
            pass: config.get('sendgrid'),
          },
        });
        var mailOptions = {
          from: 'reset-password@openrates.com',
          to: user.email,
          subject: 'Password Reset Link',
          text:
            `Hello ${user.name},\n\n` +
            'You requested a password reset. Kindly reset by clicking the link: \nhttp://' +
            'dashboard.openrates.com' +
            '/password-reset/' +
            token +
            '\n',
        };
        transporter.sendMail(mailOptions, function (err) {
          if (err) {
            return res.status(500).send({ msg: err.message });
          }
          return res.status(200).send({
            error: false,
            message: 'A verification email has been sent to ' + user.email + '.',
          });
        });
      })
      .catch(err => {
        return res.status(500).send({ error: true, message: "Resetting password failed" });
      });
  });
}

exports.resetPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.token;

  let resetUser;

  User.findOne({
    passwordResetToken: passwordToken,
    passwordResetExpires: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.passwordChangedAt = Date.now();
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      return res.status(200).send({ error: false, message: "Successfully changed your password." });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send({ error: true, message: "Resetting password failed" });
    });
};

exports.changePassword = async (req, res) => {
  if (!req.body.password)
    return res.status(400).send({ error: true, message: 'Old Password is required' });
  if (!req.body.newPassword)
    return res.status(400).send({ error: true, message: 'New Password is required' });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ error: true, message: errors.array()[0].msg });
  }

  const user = await User.findById(req.userId);
  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword)
    return res.status(400).send({ error: true, message: 'Old password does not match' });

  await bcrypt
    .hash(req.body.newPassword, 12)
    .then(hashedPassword => {
      User.findByIdAndUpdate(
        req.userId,
        {
          $set: {
            password: hashedPassword,
            passwordChangedAt: Date.now(),
          },
        },
        { new: true }
      ).then((updatedUser) => {
        return res.status(200).send({ error: false, message: 'Password Updated Successfully' });
      }).catch((err) => {
        return res.status(404).send({ error: true, message: 'The user with the given ID was not found.' });
      });
    })
}

exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return res.status(404).send({ error: true, message: 'The user with the given ID was not found.' });

  return res.send({ error: false, message: "Success", data: user });
};

exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user)
    return res.status(404).send({ error: true, message: 'The user with the given ID was not found.' });

  return res.send({ error: false, message: "Successfully deleted user" });
};