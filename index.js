const inquirer = require('inquirer');
const cTable = require('console.table');

const db = require("./db")

allDepartments = [];
allRoles = [];
allEmps = [];


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
            db.end();
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
        console.table(result);
        executiveQueries();
      }
    })

  };
  function addDept() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'departmentName',
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
        let departmentId = answers.departmentId;
        let departmentName = answers.departmentName;
        let crit = [departmentId, departmentName]
        db.query(`INSERT INTO department (id, name) VALUES (?, ?)`, crit, (err, result) => {
          if (err) {
            console.log(`Error, please check sql/javascript syntax`);
          } else {
            console.table(result);
            viewAllDepts();
          }
        })
      });
  };
  function viewAllRoles() {
    const sql = `SELECT role.id, role.title, department.name AS department
    FROM role
    INNER JOIN department ON role.department_id = department.id`;

    db.query(sql, (err, result) => {
      if (err) {
        console.log(`Error, please check sql/javascript syntax`);
        return;
      } else {
        console.table(result);
        executiveQueries();
      }
    })
  };
  function addRole() {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
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
            name: 'departmentRole',
            message: "What department does the role belong to?",
            choices: result.map((row) => ({
              name: row.name,
              value: row.id
            }))
          }
        ])
        .then((answers) => {
          let roleId = answers.roleId;
          let roleName = answers.roleName;
          let roleSalary = answers.roleSalary;
          let departmentRole = answers.departmentRole
          let crit = [roleId, roleName, roleSalary, departmentRole]
          db.query(`INSERT INTO role (id, title, salary, department_id) VALUES (?, ?, ?, ?)`, crit, (err, result) => {
            if (err) {
              console.log(err);
              return;
            } else {
              console.table(result);
              viewAllRoles();
            }
          })
        })
    });
  }

  function viewAllEmps() {
    const sql = `SELECT * FROM employees`;

    db.query(sql, (err, result) => {
      if (err) {
        console.log(`Error, please check sql/javascript syntax`);
        return;
      } else {
        console.table(result);
        executiveQueries();
      }
    })
  };
  function addEmp() {
    const sql = `SELECT * FROM role`;
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
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
            type: 'input',
            name: 'empId',
            message: "What is the employee's id?",
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
            name: 'roleId',
            message: "What role does the employee have?",
            choices: result.map((row) => ({
              name: row.title,
              value: row.id
            }))
          }
        ])
        .then((answers) => {
          let empId = answers.empId;
          let firstname = answers.employeeFn;
          let lastname = answers.employeeLn;
          let role = answers.roleId;
          let crit = [empId, firstname, lastname, role]
          db.query(`INSERT INTO employees (id, first_name, last_name, role_id) VALUES (?, ?, ?, ?)`, crit, (err, result) => {
            if (err) {
              console.log(err);
              return;
            } else {
              console.table(result);
              viewAllEmps();
              executiveQueries();
            }
          })
        })
    })
  };
  const updateEmpRole = () => {
    let sql = `SELECT employees.id, employees.first_name, employees.last_name, role.id AS "role_id"
                    FROM employees, role, department WHERE department.id = role.department_id AND role.id = employees.role_id`;
    db.query(sql, (error, response) => {
      if (error) throw error;
      let employeeNamesArr = [];
      response.forEach((employees) => { employeeNamesArr.push(`${employees.first_name} ${employees.last_name}`); });

      let sql2 = `SELECT role.id, role.title FROM role`;
      db.query(sql2, (error, response) => {
        if (error) throw error;
        let rolesArr = [];
        response.forEach((role) => { rolesArr.push(role.title); });

        inquirer
          .prompt([
            {
              name: 'chosenEmp',
              type: 'list',
              message: 'Which employee has a new role?',
              choices: employeeNamesArr
            },
            {
              name: 'chosenRole',
              type: 'list',
              message: 'What is their new role?',
              choices: rolesArr
            }
          ])
          .then((answer) => {
            let newRoleId, empId;

            response.forEach((role) => {
              if (answer.chosenRole === role.title) {
                newRoleId = role.id;
              }
            });

            response.forEach((employees) => {
              if (
                answer.chosenEmp ===
                `${employees.first_name} ${employees.last_name}`
              ) {
                empId = employees.id;
              }
            });

            let sqls = `UPDATE employees SET employees.role_id = ? WHERE employees.id = ?`;
            db.query(
              sqls,
              [newRoleId, empId],
              (error) => {
                if (error) throw error;
                viewAllEmps();
                executiveQueries();
              }
            );
          });
      });
    });
  };

  // Update an Employee's Manager
  const updateEmpMgr = () => {
    let sql = `SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id
                    FROM employees`;
    db.query(sql, (error, response) => {
      let empNamesArr = [];
      response.forEach((employee) => { empNamesArr.push(`${employee.first_name} ${employee.last_name}`); });

      inquirer
        .prompt([
          {
            name: 'chosenEmp',
            type: 'list',
            message: 'Which employee has a new manager?',
            choices: empNamesArr
          },
          {
            name: 'newMgr',
            type: 'list',
            message: 'Who is their manager?',
            choices: empNamesArr
          }
        ])
        .then((answer) => {
          let empId, mgrId;
          response.forEach((employee) => {
            if (
              answer.chosenEmp === `${employee.first_name} ${employee.last_name}`
            ) {
              empId = employee.id;
            }

            if (
              answer.newMgr === `${employee.first_name} ${employee.last_name}`
            ) {
              mgrId = employee.id;
            }
          });

          if (answer.chosenEmp === answer.newMgr) {
            console.log(chalk.redBright.bold(`====================================================================================`));
            console.log(chalk.redBright(`Invalid Manager Selection`));
            console.log(chalk.redBright.bold(`====================================================================================`));
            executiveQueries();
          } else {
            let sql = `UPDATE employees SET employees.manager_id = ? WHERE employees.id = ?`;

            db.query(
              sql,
              [mgrId, empId],
              (error) => {
                if (error) throw error;
                viewAllEmps();
                executiveQueries();
              }
            );
          }
        });
    });
  };
};
employeeManagement();