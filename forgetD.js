

// MySQL connection configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pfe'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


// Route for rendering the password reset form
app.get('/forgetPassword', (req, res) => {
  res.render('forgetPassword');
});

// Route for handling password reset request
app.post('/forgetPassword', (req, res) => {
  const { email, cin } = req.body;
  
  // Check if the email and cin combination exists in the database
  const query = `SELECT * FROM doctor WHERE email = ? AND cin = ?`;
  connection.query(query, [email, cin], (error, results, fields) => {
    if (error) {
      console.error('Error querying database:', error);
      res.status(500).send('Internal Server Error');
    } else if (results.length === 0) {
      res.status(404).send('User not found');
    } else {
      res.redirect('/changePassword'); 
    }
  });
});

// Route for rendering the password change form
app.get('/changePassword', (req, res) => {
  const email = req.query.email;
  res.render('confirmation');
});

// Route for handling password change request
app.post('/changePassword', (req, res) => {
  const { email, password } = req.body;
  
  // Update the password in the database
  const updateQuery = `UPDATE doctor SET password = ? WHERE email = ?`;
  connection.query(updateQuery, [password, email], (updateError, updateResults, updateFields) => {
    if (updateError) {
      console.error('Error updating password:', updateError);
      res.status(500).send('Internal Server Error');
    } else {
      res.send('Password updated successfully');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
