//Variables
const inquirer = require ('inquirer');
const table = require('console.table');
const connection = require('./db/connection')

// const {
//   viewDep,
//   viewRoles,
//   viewEmp,
//   addDep,
//   addRole,
//   addEmp,
//   updateEmp,
//   getDep,
//   getManagers,
//   getRoles,
//   getEmp,
//   selectEmp,
// } = require("./helpers/queries");

connection.connect(function (error) {
  if (error) {
    throw error;
  }
  console.log("connection success");
  mainPrompt()
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
    .then(answers => {
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
    })
    
    .then(() => {
      //The function starts over again returning to first prompts
      return mainPrompt();
    });
}


function viewDepartments() {
  // console.log("View Dept")
  connection.query("SELECT * FROM department", function(error, results){
    if (error) {
      throw error}
      console.log(results)
      console.table(results)
  })
  
}



//The following function prompts the user to enter a new department name, validates the input to ensure it is not a blank field, and if valid calls the addDepartment() function to handle the process of adding the new department.
function addDepartmentPrompt() {
  return inquirer.createPromptModule([
    {
      name: "department",
      type: "input",
      message: "Please enter the department name."
    }
  ]).then ((answers) => {
    const newDepartment = answers.department;
    if (answers.department.length > 0) {
      return addDepartmentPrompt(newDepartment);
    }else {
      console.log('\nError, you cant enter a blank field.\n');
      return;
    }
  }).catch((error) => {
    console.error(error);
  });
}

//This code difines an async function named addRole Prompt() that retrieves departments, prompts users to enter information for a new role, validates users input and adds the role using the addRole function.  Any errors that occur during the process are caught and logged.
async function addRolePrompt() {
  try {
    const results = await getDepartments();
    console.log("\n");
    const choices = results.map((department) => ({
      value: department.id,
      name: department.name,
    }));
    const answers = await inquirer.prompt([
      {
        name: "name",
        type: "input",
        message: "Enter the name of the new role.",
      },
      {
        name: "salary",
        type: "input",
        message: "Enter the new role's yearly salary. Use only whole numbers.",
        validate: function (value) {
          var valid = !isNaN(parseFloat(value));
          return valid || "Please enter a whole number without commas.";
        },
        filter: Number,
      },
      {
        name: "department_id",
        type: "list",
        message: "Choose a department to add the new role to.",
        choices: choices,
      },
    ]);
    await addRole(answers);
    return;
  } catch (error) {
    console.log(error);
    throw error;
  }
}


//This function also uses an async function that retrieves roles and managers, prompts the user for a new employee info and adds the employee using the addEmployee function.  Any errors that occur during the process are caught and logged.
async function addEmployeePrompt() {
  try {
    const roles = await getRoles();
    console.log("\n");
    const choices = roles.map((item) => item.title);
    const answers = await inquirer.prompt([
      {
        name: "first_name",
        type: "input",
        message: "Enter the first name of the new employee.",
      },
      {
        name: "last_name",
        type: "input",
        message: "Enter the last name of the new employee.",
      },
      {
        name: "title",
        type: "list",
        message: "Select the new employee's role.",
        choices: choices,
      },
    ]);
    if (!answers.title.toLowerCase().includes("manager")) {
      const managers = (await getManagers()).map(
        (employee) => `${employee.first_name} ${employee.last_name}`
      );
      const managerAnswer = await inquirer.prompt([
        {
          name: "manager_name",
          type: "list",
          message: "Select the new employee's manager.",
          choices: managers,
        },
      ]);
      const manager = (await getManagers()).find(
        (employee) =>
          `${employee.first_name} ${employee.last_name}` ===
          managerAnswer.manager_name
      );
      const employee = {
        ...answers,
        role_id: roles.find((role) => role.title === answers.title).id,
        manager_id: manager.id,
      };
      delete employee.title;
      return addEmployee(employee);
    } else {
      const employee = {
        ...answers,
        role_id: roles.find((role) => role.title === answers.title).id,
        manager_id: null,
      };
      delete employee.title;
      return addEmployee(employee);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}



//This code allows the user to select an employee and update their role, potentially modifying the manager associated with the employee and then updates the employees info in the system.
async function updateEmployeePrompt() {
  try {
    const employees = await getEmployees();
    const fullNames = employees.map(
      (employee) =>
        `${employee.id} ${employee.first_name} ${employee.last_name}`
    );
    const { employee_name } = await inquirer.prompt([
      {
        name: "employee_name",
        type: "list",
        message: "Select the employee that you would like to update.",
        choices: fullNames,
      },
    ]);
    const roles = await getRoles();
    const allRoles = roles.map((role) => role.title);
    const { role_name } = await inquirer.prompt([
      {
        name: "role_name",
        type: "list",
        message: `Select the new role for: ${employee_name}.`,
        choices: allRoles,
      },
    ]);
    const employeeId = parseInt(employee_name.split(" ")[0]);
    const roleId = roles.find((role) => role.title === role_name);
    const selectedEmployee = await selectEmployee(employeeId);
    selectedEmployee[0].role_id = roleId.id;
    if (!role_name.toLowerCase().includes("manager")) {
      selectedEmployee[0].manager_id = null;
    }
    await updateEmployee(selectedEmployee[0]);
    return;
  } catch (error) {
    console.log(error);
    throw error;
  }
}




