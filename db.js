const mysql = require('mysql2');

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // TODO: Add MySQL password here
      password: 'GameD232447!$',
      database: 'employeetracker_db'
    },
    console.log(`Connected to the employeetracker_db database.`)
  ); db.connect(err => {
    if (err) {console.log(err)};
  })

  module.exports = db