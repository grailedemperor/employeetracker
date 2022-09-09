const inquirer = require('inquirer');
const cTable = require('console.table');

const db = require("./db")

allDepartments = [];
allRoles = [];
allEmps = [];

// const db = mysql.createConnection(
//     {
//       host: 'localhost',
//       // MySQL username,
//       user: 'root',
//       // TODO: Add MySQL password here
//       password: 'GameD232447!$',
//       database: 'employeetracker_db'
//     },
//     console.log(`Connected to the employeetracker_db database.`)
//   );

function employeeManagement() {
  function executiveQueries() {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'mainList',
          message: "What would you like to do?",
          choices: ["View All Departments",
            "Add Department", "View All Roles",
            "Add Role", "View All Employees", "Add Employee",
            "Update Employee Role", "Update Employee Manager", "Quit"]
        },
      ])
      .then((userChoice) => {
        console.log(userChoice);
        switch (userChoice.mainList) {
          case 'View All Departments':
            viewAllDepts();
            break;
          case 'Add Department':
            addDept();
            break;
          case 'View All Roles':
            viewAllRoles();
            break;
          case 'Add Role':
            addRole();
            break;
          case 'View All Employees':
            viewAllEmps();
            break;
          case 'Add Employee':
            addEmp();
            break;
          case 'Update Employee Role':
            updateEmpRole();
            break;
          case 'Update Employee Manager':
            updateEmpMgr();
            break;
          case 'Quit':
            return;
        }
      });
  }
  executiveQueries();
  function viewAllDepts() {
    const sql = `SELECT * FROM department`;

    db.query(sql, (err, result) => {
      if (err) {
        console.log(`Error, please check sql/javascript syntax`);
      } else {
        console.log(result);
        console.table(result);
      }
    });
  };
  function addDept() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'departnameName',
          message: "What is the name of the department?",
          validate: (answer) => {
            if (answer !== '') {
              return true;
            }
            return 'Please enter at least one character.';
          },
        },
        {
          type: 'input',
          name: 'departmentId',
          message: "What is the department's id?",
          validate: (answer) => {
            const pass = answer.match(/^[1-9]\d*$/)
            if (pass) {
              return true;
            }
            return 'Please enter a number greater than zero';
          },
        }
      ])
      .then((answers) => {
        db.promise().query(`INSERT INTO department set ${answers}`, (err, result) => {
          if (err) {
            console.log(`Error, please check sql/javascript syntax`);
          } else {
            console.table(result);
          }
        })
      })
      .then(() => {
        db.query(`SELECT * FROM department`, (err, result) => {
          if (err) {
            console.log(`Error, please check sql/javascript syntax`);
          } else {
            console.table(result);
          }
        })
      });
    executiveQueries();
  };
  function viewAllRoles() {
    const sql = `SELECT id, title, salary, name
         FROM role FULL JOIN department ON role.department=department.id`;

    db.query(sql, (err, result) => {
      if (err) {
        console.log(`Error, please check sql/javascript syntax`);
      } else {
        console.table(result);
      }
    });
  };
  function addRole() {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, result) => {
      if (err) {
        console.log(`Error, please check sql/javascript syntax`);
        return;
      }

      inquirer
        .prompt([
          {
            type: 'input',
            name: 'roleId',
            message: "What is the role's id?",
            validate: (answer) => {
              const pass = answer.match(/^[1-9]\d*$/)
              if (pass) {
                return true;
              }
              return 'Please enter a number greater than zero';
            },
          },
          {
            type: 'input',
            name: 'roleName',
            message: "What is the name of the role?",
            validate: (answer) => {
              if (answer !== '') {
                return true;
              }
              return 'Please enter at least one character.';
            }
          },
          {
            type: 'input',
            name: 'roleSalary',
            message: "What is the role's salary?",
            validate: (answer) => {
              const pass = answer.match(/^[1-9]\d*$/)
              if (pass) {
                return true;
              }
              return 'Please enter a number greater than zero';
            },
          },
          {
            type: 'list',
            name: 'departmentList',
            message: "What department does the role belong to?",
            choices: result.map((row) => ({ 
              name: row.name,
              value: row.id
            })) 
          }
        ])
        .then((answers) => {
          db.promise().query(`INSERT INTO role set ${answers}`, (err, result) => {
            if (err) {
              console.log(`Error, please check sql/javascript syntax`);
            } else {
              console.table(result);
            }
          })
        })
        .then(() => {
          db.query(`SELECT id, title, salary, name
          FROM role FULL JOIN department ON role.department=department.id`, (err, result) => {
            if (err) {
              console.log(`Error, please check sql/javascript syntax`);
            } else {
              console.table(result);
            }
          })
        });
      // executiveQueries();
    });
  }

  function viewAllEmps() {
    const sql = `SELECT * FROM employees`;

    db.query(sql, (err, result) => {
      if (err) {
        console.log(`Error, please check sql/javascript syntax`);
      } else {
        console.table(result);
      }
    });
  };
  function addEmp() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'employeeFn',
          message: "What is the first name of the employee?",
          validate: (answer) => {
            if (answer !== '') {
              return true;
            }
            return 'Please enter at least one character.';
          }
        },
        {
          type: 'input',
          name: 'employeeLn',
          message: "What is the last name of the employee?",
          validate: (answer) => {
            if (answer !== '') {
              return true;
            }
            return 'Please enter at least one character.';
          }
        },
        {
          type: 'list',
          name: 'roleList',
          message: "What role does the employee have?",
          choices: allRoles

        },
        {
          type: 'list',
          name: 'managerList',
          message: "Who's the employee's manager?",
          choices: allEmps
        }
      ])
      .then((answers) => {
        db.promise().query(`INSERT INTO employee set ${answers}`, (err, result) => {
          if (err) {
            console.log(`Error, please check sql/javascript syntax`);
          } else {
            console.table(result);
          }
        })
      })
      .then(() => {
        db.query(`SELECT name FROM department FULL JOIN role ON role.department=department.id`, (err, result) => {
          if (err) {
            console.log(`Error, please check sql/javascript syntax`);
          } else {
            db.query(`SELECT id, first_name, last_name, manager_id, title, salary, department FROM employees FULL JOIN role ON employees.role=role.id`, (err, result) => {
              if (err) {
                console.log(`Error, please check sql/javascript syntax`);
              } else {

                console.table(result);
              }
            })
          }
        })
      });
    executiveQueries();
  };
  function updateEmpRole() {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'employeeList',
          message: "Who's the employee?",
          choices: allEmps
        },
        {
          type: 'list',
          name: 'roleList',
          message: "What's the employee's new role?",
          choices: allRoles
        }
      ])
      .then((answers) => {
        db.promise().query(`INSERT INTO role set ${answers}`, (err, result) => {
          if (err) {
            console.log(`Error, please check sql/javascript syntax`);
          } else {
            console.table(result);
          }
        })
      })
      .then(() => {
        db.query(`SELECT name FROM department FULL JOIN role ON role.department=department.id`, (err, result) => {
          if (err) {
            console.log(`Error, please check sql/javascript syntax`);
          } else {
            db.query(`SELECT id, first_name, last_name, manager_id, title, salary, department FROM employees FULL JOIN role ON employees.role=role.id`, (err, result) => {
              if (err) {
                console.log(`Error, please check sql/javascript syntax`);
              } else {

                console.table(result);
              }
            })
          }
        })
      });
    executiveQueries();
  };
  function updateEmpMgr() {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'employeeList',
          message: "Who's the employee?",
          choices: allEmps
        },
        {
          type: 'list',
          name: 'managerList',
          message: "Who's the employee's manager?",
          choices: allRoles
        }
      ])
      .then((answers) => {
        db.promise().query(`INSERT INTO employees set ${answers}`, (err, result) => {
          if (err) {
            console.log(`Error, please check sql/javascript syntax`);
          } else {
            console.table(result);
          }
        })
      })
      .then(() => {
        db.query(`SELECT name FROM department FULL JOIN role ON role.department=department.id`, (err, result) => {
          if (err) {
            console.log(`Error, please check sql/javascript syntax`);
          } else {
            db.query(`SELECT id, first_name, last_name, manager_id, title, salary, department FROM employees FULL JOIN role ON employees.role=role.id`, (err, result) => {
              if (err) {
                console.log(`Error, please check sql/javascript syntax`);
              } else {

                console.table(result);
              }
            })
          }
        })
      });
    executiveQueries();
  };
};
employeeManagement();