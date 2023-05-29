//Variables
const express = require('express');
const inquirer = require ('inquirer');
const table = require('console.table');

const {
  viewDep,
  viewRoles,
  viewEmp,
  addDep,
  addRole,
  addEmp,
  updateEmp,
  getDep,
  getManagers,
  getRoles,
  getEmp,
  selectEmp,
} = require("./helpers/queries");

//assigned the value of environment. variable PORT
const PORT = process.env.PORT || 3001;
//Express instance
const app = express();
//Middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

//Middleware function sets the respone status code to 404
app.use((req, res) => {;
  res.status(404).end();
});
//Starts the Express server and listen on the specified PORT
app.listen(PORT,() => {});




