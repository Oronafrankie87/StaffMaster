//Variables
const inquirer = require("inquirer");
const table = require("console.table");
const connection = require("./db/connection");

connection.connect(function (error) {
  if (error) {
    throw error;
  }
  console.log("connection success");
  mainPrompt();
});

//This function prompts the user for a choice, executes a corresponding action based on the selected choice and then repeats the process until the user decides to exit the program
function mainPrompt() {
  inquirer
    .prompt([
      {
        name: "do",
        type: "list",
        message: "What do you want to do?",
        choices: [
          "View departments",
          "View roles",
          "View employees",
          "Add Department",
          "Add Role",
          "Add Employee",
          "Update Employee Role",
        ],
      },
    ])
    .then((answers) => {
      // console.log(answers)
      // switch case runs functions depending on user selection
      switch (answers.do) {
        case "View departments":
          viewDepartments();
          break;
        case "View roles":
          viewRoles();
          break;
        case "View employees":
          viewEmployees();
          break;
        case "Add Department":
          addDepartmentPrompt();
          break;
        case "Add Role":
          addRolePrompt();
          break;
        case "Add Employee":
          addEmployeePrompt();
          break;
        case "Update Employee Role":
          updateEmployeePrompt();
          break;
      }
      return;
    })
    .catch((error) => {
      console.error(error);
    });

  //     .then(() => {
  //       //The function starts over again returning to first prompts
  //       return mainPrompt();
  //     });
}

function viewDepartments() {
  // console.log("View Dept")
  connection.query("SELECT * FROM department", function (error, results) {
    if (error) {
      throw error;
    }

    console.table(results);
    mainPrompt();
  });
}

function viewRoles() {
  connection.query("SELECT * FROM role", function (error, results) {
    if (error) {
      throw error;
    }

    console.table(results);
    mainPrompt();
  });
}

function viewEmployees() {
  connection.query("SELECT * FROM employee", function (error, results) {
    if (error) {
      throw error;
    }

    console.table(results);
    mainPrompt();
  });
}

//addDepartmentPrompt
function addDepartmentPrompt() {
  inquirer
    .prompt({
      type: "input",
      name: "dept_name",
      message: "Enter the name of the new department:",
    })
    .then((answer) => {
      const request = `INSERT INTO department (name) VALUES ("${answer.dept_name}");`;
      connection.query(request, (err, res) => {
        if (err) throw err;
        console.log(
          `Department'${answer.dept_name}' has been added to the database`
        );
        mainPrompt();
      });
    });
}

function addRolePrompt() {
  connection.query("SELECT * FROM department", function (error, results) {
    if (error) {
      throw error;
    }

    // console.table(results);
    //console.log(results);
    const listOfDept = results.map((department) => {
      return {
        name: department.name,
        value: department.id,
      };
    });
    console.log(listOfDept);

    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "Please enter the title of the new role:",
        },
        {
          type: "input",
          name: "salary",
          message: "Please enter the salary of the new role in $:",
        },
        {
          type: "list",
          name: "dept",
          message: "Please choose the the department for this role",
          choices: listOfDept,
        },
      ])
      .then((answers) => {
        const request = "INSERT INTO role SET ?";
        connection.query(
          request,
          {
            title: answers.title,
            salary: answers.salary,
            department_id: answers.dept,
          },
          (err, res) => {
            if (err) throw err;
            console.log(
              `the role of '${answers.title}' has been added to the database`
            );
            mainPrompt();
          }
        );
      });
  });
}

//
function addEmployeePrompt() {
  const sql = "SELECT id, title FROM role";
  connection.query(sql, (err, res) => {
    if (err) throw err;

    const role = res.map(({ id, title }) => ({
      name: title,
      value: id,
    }));

    const sql2 =
      'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee';

    connection.query(sql2, (err, res) => {
      if (err) throw err;
      const managers = res.map(({ id, name }) => ({
        name,
        value: id,
      }));
      inquirer
        .prompt([
          {
            type: "input",
            name: "firstName",
            message: "Please enter the first name of the new employee:",
          },
          {
            type: "input",
            name: "lastName",
            message: "Please enter the last name of the new employee:",
          },
          {
            type: "list",
            name: "roleID",
            message: "Please choose the role for this ",
            choices: role,
          },
          {
            type: "list",
            name: "managerID",
            message: "Please choose a manager for this employee",
            choices: [{ name: "none", value: null }, ...managers],
          },
        ])
        .then((answers) => {
          const request = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;

          const values = [
            answers.firstName,
            answers.lastName,
            answers.roleID,
            answers.managerID,
          ];

          connection.query(request, values, (err, res) => {
            if (err) throw err;
            console.log(
              `the employee '${
                answers.firstName + " " + answers.lastName
              }' has been added to the database`
            );
            mainPrompt();
          });
        });
    });
  });
}

//
function updateEmployeePrompt() {
  const sql = "SELECT * FROM employee";
  const sql2 = "SELECT * FROM role";
  const sql3 =
    'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee';

  connection.query(sql, (err, res1) => {
    if (err) throw err;
    connection.query(sql2, (err, res2) => {
      if (err) throw err;
      connection.query(sql3, (err, res3) => {
        if (err) throw err;
        const managers = res3.map(({ id, name }) => ({
          name,
          value: id,
        }));

        inquirer
          .prompt([
            {
              type: "list",
              name: "employee",
              message: "Select the employee you'd like to update:",
              choices: res1.map(
                (person) => `${person.first_name} ${person.last_name}`
              ),
            },
            {
              type: "list",
              name: "newRole",
              message: "Select role:",
              choices: res2.map((role) => role.title),
            },
            {
              type: "list",
              name: "managerID",
              message: "Please choose a manager for this employee",
              choices: [{ name: "none", value: null }, ...managers],
            },
          ])
          .then((answers) => {
            const employee = res1.find(
              (person) =>
                `${person.first_name} ${person.last_name}` === answers.employee
            );

            const newRole = res2.find((role) => role.title === answers.newRole);

            const request =
              "UPDATE employee SET role_id = ?, manager_id = ? WHERE id = ?";
            connection.query(
              request,
              [newRole.id, answers.managerID, employee.id],
              (err, res) => {
                if (err) throw err;
                console.log(
                  `Updated ${employee.first_name} ${employee.last_name} with the role of ${newRole.title}`
                );
                mainPrompt();
              }
            );
          });
      });
    });
  });
}
