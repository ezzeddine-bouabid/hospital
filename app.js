const express = require('express');
const mysql = require('mysql');
const notifier = require('node-notifier');
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;

// Connexion à la base de données MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pfe'
});

connection.connect((error) => {
  if (error) {
    console.error('Error connecting to database:', error);
    return;
  }
  console.log('Connected to database');
});

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: 'pfe.isimg@outlook.fr',
    pass: 'pfeisimg123'
  }
});

// Route pour la page principale
app.get('/', (req, res) => {
  res.render('accuiel');
});

// Route pour la page de connexion patient
app.get('/logP', (req, res) => {
  res.render('loginPatient');
});

// Route pour la page de connexion docteur
app.get('/log', (req, res) => {
  res.render('loginDoctor');
});

// Route pour afficher le formulaire de récupération de mot de passe
app.get('/verify-user', (req, res) => {
  res.render('forgetPassword');
});
app.get('/forgetPassword', (req, res) => {
  res.render('forgetP');

});
app.get('/signupP', (req, res) => {
  res.render('loginPatient');
});
app.get('/signinP', (req, res) => {
  res.render('loginPatient');
});

// Route pour gérer la demande de réinitialisation de mot de passe
app.post('/verify-user', (req, res) => {
  const { email } = req.body;

  // Generate a reset token
  const resetToken = generateResetToken();

  // Update the user's record in the database with the reset token
  const query = 'UPDATE doctor SET reset_token = ? WHERE email = ?';
  connection.query(query, [resetToken, email], (error, results) => {
    if (error) {
      console.error('Error updating reset token:', error);
      return res.status(500).send('Internal server error');
    }

    // Send the password reset email
    sendResetEmail(email, resetToken);
    showMessage('Password reset email has been sent', res);
    
  });
});

// Route pour afficher le formulaire de changement de mot de passe
app.get('/reset', (req, res) => {
  const token = req.query.token;
  res.render('reset', { token: token });
});

// Route pour gérer la réinitialisation de mot de passe via le lien
app.post('/reset', (req, res) => {
  const { token, password } = req.body;

  // Update the user's password in the database
  const query = 'UPDATE doctor SET password = ?, reset_token = NULL WHERE reset_token = ?';
  connection.query(query, [password, token], (error, results) => {
    if (error) {
      console.error('Error resetting password:', error);
      return res.status(500).send('Internal server error');
    }
    if (results.affectedRows === 0) {
      console.error('Invalid reset token or user not found');
      showMessage('user not found or invalid link', res);
    }
    showMessage('password update successfully', res);
  });
});

// Function to generate a random reset token
function generateResetToken() {
  return Math.random().toString(36).substr(2, 10);
}

// Function to send the password reset email
function sendResetEmail(email, token) {
  const mailOptions = {
    from: 'pfe.isimg@outlook.fr',
    to: email,
    subject: 'Password Reset',
    html: `<p>To reset your password, <a href="http://localhost:3000/reset?token=${token}">click here</a>.</p>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

// Route pour gérer l'inscription d'un utilisateur
app.post('/signup', (req, res) => {
  const { name, email, tlfn, cin, psw, Code, gender, birth } = req.body;

  // Insert new user into the database
  const query = `INSERT INTO doctor (name, email, phone, cin, password, code, gender, birth,reset_token,created_at,updated_at)  VALUES (?, ?, ?, ?, ?, ?, ?, ?,NULL,NOW(),NOW())`;
  connection.query(query, [name, email, tlfn, cin, psw, Code, gender, birth], (error, results) => {
    if (error) {
      console.error('Error signing up:', error);
      return res.status(500).send('Internal server error');
    }
    showMessage('User signed up successfully', res);
    res.redirect('/');
  });
});

// Route pour gérer l'authentification d'un utilisateur
app.post('/signin', (req, res) => {
  const { email, psw } = req.body;
  const query = `SELECT * FROM doctor WHERE email = ? AND password = ?`;
  connection.query(query, [email, psw], (error, results) => {
    if (error) {
      console.error('Error signing in:', error);
      return res.status(500).send('Internal server error');
    }
    if (results.length > 0) {
      showMessage('User signed in successfully', res);
      res.redirect('/');
    } else {
      showMessage('Incorrect email or password', res);
    }
  });
});
app.post('/forgetPassword', (req, res) => {
  const { email } = req.body;

  // Generate a reset token
  const resetToken = generateResetToken();

  // Update the user's record in the database with the reset token
  const query = 'UPDATE patient SET reset_token = ? WHERE email = ?';
  connection.query(query, [resetToken, email], (error, results) => {
    if (error) {
      console.error('Error updating reset token:', error);
      return res.status(500).send('Internal server error');
    }

    // Send the password reset email
    sendResetEmail(email, resetToken);
    showMessage('Password reset email has been sent', res);
    
  });
});

// Route pour afficher le formulaire de changement de mot de passe
app.get('/resetP', (req, res) => {
  const token = req.query.token;
  res.render('resetP', { token: token });
});

// Route pour gérer la réinitialisation de mot de passe via le lien
app.post('/resetP', (req, res) => {
  const { token, password } = req.body;

  // Update the user's password in the database
  const query = 'UPDATE patient SET password = ?, reset_token = NULL WHERE reset_token = ?';
  connection.query(query, [password, token], (error, results) => {
    if (error) {
      console.error('Error resetting password:', error);
      return res.status(500).send('Internal server error');
    }
    if (results.affectedRows === 0) {
      console.error('Invalid reset token or user not found');
      showMessage('user not found or invalid link', res);
    }
    showMessage('password update successfully', res);
  });
});

// Function to generate a random reset token
function generateResetToken() {
  return Math.random().toString(36).substr(2, 10);
}

// Function to send the password reset email
function sendResetEmail(email, token) {
  const mailOptions = {
    from: 'pfe.isimg@outlook.fr',
    to: email,
    subject: 'Password Reset',
    html: `<p>To reset your password, <a href="http://localhost:3000/resetP?token=${token}">click here</a>.</p>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

// Route pour gérer l'inscription d'un utilisateur
app.post('/signupP', (req, res) => {
  const { name, email, tlfn, cin, psw, gender, birth } = req.body;

  // Insert new user into the database
  const query = `INSERT INTO patient (name, email, phone, cin, password,  gender, birth,reset_token,created_at,updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?,NULL,NOW(),NOW())`;
  connection.query(query, [name, email, tlfn, cin, psw,  gender, birth], (error, results) => {
    if (error) {
      console.error('Error signing up:', error);
      return res.status(500).send('Internal server error');
    }
    showMessage('User signed up successfully', res);
    res.redirect('/');
  });
});

// Route pour gérer l'authentification d'un utilisateur
app.post('/signinP', (req, res) => {
  const { email, psw } = req.body;
  const query = `SELECT * FROM patient WHERE email = ? AND password = ?`;
  connection.query(query, [email, psw], (error, results) => {
    if (error) {
      console.error('Error signing in:', error);
      return res.status(500).send('Internal server error');
    }
    if (results.length > 0) {
      showMessage('User signed in successfully', res);
      res.redirect('/');
    } else {
      showMessage('Incorrect email or password', res);
    }
  });
});

function showMessage(message, res) {
  notifier.notify({
    title: 'Notification',
    message: message
  });
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
