const functions = require('@google-cloud/functions-framework');
const mysql = require('promise-mysql');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

const createTcpPool = async config => {
  const dbConfig = {
    host: process.env.host,
    port: process.env.port,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    ...config,
  };
  return mysql.createPool(dbConfig);
};

async function getAllUserData() { 
  try {
    const pool = await createTcpPool();
    console.log("Pool", pool);
    const rows = await pool.query('SELECT * FROM Users');
    console.log("Users:", rows);
    pool.end();
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

async function getUserDetails(username) { 
  try {
    const pool = await createTcpPool();
    console.log("Pool", pool);
    const rows = await pool.query(`SELECT * FROM Users  WHERE username = '${username}'`);
    console.log("Users:", rows);
    pool.end();
    return rows;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}


async function updateUser(username) {
  try {
    const pool = await createTcpPool();
    const token = Math.random().toString(36).slice(-10);
    const emailExpiry = new Date(Date.now() + 2 * 60 * 1000); 
    console.log(username);
    const updateQuery = `
      UPDATE Users
      SET token = '${token}',
          email_expiry = '${emailExpiry.toISOString().slice(0, 19).replace('T', ' ')}'
      WHERE username = '${username}'
    `;
    const result = await pool.query(updateQuery);
    console.log("User updated successfully:", result);
    
    pool.end();
  } catch (error) {
    console.error('Error updating user:', error);
  }
}

functions.cloudEvent('helloPubSub', async cloudEvent => {
  const base64name = cloudEvent.data.message.data;
  const name = base64name ? Buffer.from(base64name, 'base64').toString() : 'World';
  const jsonData = JSON.parse(name);

  await updateUser(jsonData.username);

  let userDetails = await getUserDetails(jsonData.username);

  // let verificationLink = 'http://' + process.env.domain + ':' + process.env.portapp + '/v1/user/email?token=' + userDetails[0].token;

  let verificationLink = 'https://' + process.env.domain + '/v1/user/email?token=' + userDetails[0].token;

  const htmlBody = `
        <p>Hello ${userDetails[0].first_name} ${userDetails[0].last_name},</p>
        <br>
        <p>Thank you for creating your account at CSYE 6225 - Network Structure and Cloud Computing.<p>
        <p>Please verify your account by clicking on the link here: <a href="${verificationLink}">${verificationLink}</a>.</p>
        <br>
        <p>If you no longer wish to receive these emails, you can <a href="omsolanki.me/unsubscribe">unsubscribe here</a>.</p>
        <p><br>Best regards,<br>${process.env.sender}<br>Network Structure and Cloud Computing</p>
    `;

  mg.messages.create(process.env.domain, {
      from: process.env.sender,
      to: [jsonData.username],
      subject: process.env.subject,
      html: htmlBody
    })
    .then(msg => console.log("Email sent:", msg))
    .catch(err => console.error("Error sending email:", err));

  console.log(`Mail Sent to , ${name}!`);
});
