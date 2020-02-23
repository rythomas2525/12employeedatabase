const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table')

const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,


    user: "root",


    password: process.env.MYSQL_PASSWORD,
    database: "employee_trackerDB"
});

connection.connect(function (err) {
    if (err) throw err;
    runSearch();
});

function runSearch() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View all employees",
                "View departments",
                "add employee",
                "remove employee",
                "add role",
                "add department",
                "update employee role",
                "exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View all employees":
                    viewEmployees();
                    break;

                case "View departments":
                    viewDep();
                    break;


                case "add employee":
                    addEmployee();
                    break;
                case "remove employee":
                    removeEmployee();
                    break;
                case "add role":
                    addRole();
                    break;
                case "add department":
                    addDep();
                    break;

                case "exit":
                    connection.end();
                    break;
            }

        });
}

function viewEmployees() {

    var query = "SELECT * FROM employee ";
    connection.query(query, function (err, res) {

        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].id + " || First Name: " + res[i].first_name + " || Last Name: " + res[i].last_name + " || Role ID: " + res[i].role_id);

        }
        runSearch();
    });
}


function viewDep() {
    console.log("blah")
    var query = "SELECT * FROM department";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].id + " || Department: " + res[i].name);
        }
        runSearch();
    });
}



const addEmployeeQuestions = [{
    name: "first_name",
    type: "input",
    message: "What is the Employees First Name?"
}, {
    name: "last_name",
    type: "input",
    message: "What is the Employees Last Name?"
}, {
    name: "role",
    type: "list",
    message: "What role does the employee have",
    choices: [
        "Software Engineer",
        "Senior Engineer",
        "Sales Person",
        "Sales Lead",
        "Lead Accountant",
        "Accountant"
    ]
},
]

function addEmployee() {

    var roleID = ""



    inquirer
        .prompt(addEmployeeQuestions)
        .then(function (answer) {



            connection.query("SELECT id FROM role WHERE title=?", [answer.role], function (err, res) {
                if (err) throw err;



                roleID = res[0].id




                connection.query("INSERT INTO  employee (first_name, last_name, role_id) VALUES (?, ?, ?)", [answer.first_name, answer.last_name, roleID], function (err, res) {

                    if (err) throw err;
                    console.log(answer.first_name + " " + answer.last_name + " added!")

                    runSearch();

                });
            })


        });
}

function removeEmployee() {
    inquirer
        .prompt({
            name: "remove",
            type: "list",
            message: "What employee would you like to remove?",
            choices: [
                "Ryan"

            ]
        })
        .then(function (answer) {

            connection.query("DELETE FROM employee WHERE first_name = ?", answer.remove, function (err, res) {
                if (err) throw err;
                for (var i = 0; i < res.length; i++) {
                    console.log("deleted " + answer.remove + " ID: " + res[i].id + " || First Name: " + res[i].first_name + " || Last Name: " + res[i].last_name + " || Role ID: " + res[i].role_id);
                }
                runSearch();
            });
        });
}

function addDep() {
    inquirer
        .prompt({
            name: "department",
            type: "input",
            message: "What department would you like to add?"
        })
        .then(function (answer) {
            connection.query("INSERT INTO department (name) VALUES (?);", [answer.department], function (err, res) {
                if (err) throw err
                console.log(answer.department + " was added")
                runSearch();
            })
        })
}






function addRole() {


    connection.query("SELECT * from department;", function (err, res) {
        if (err) throw err;

        var depArray = []
        const addRoleQuestions = [{
            name: "role",
            type: "input",
            message: "What role are you adding?"
        }, {
            name: "salary",
            type: "input",
            message: "What is the salary?"
        }, {
            name: "department",
            type: "list",
            message: "What department is this role in?",
            choices: depArray

        }]


        for (let i = 0; i < res.length; i++) {
            depArray.push(res[i].department);
            console.log(res[i].department);

        }

        inquirer
            .prompt(addRoleQuestions)
            .then(function (answer) {

                var depID = "";

                for (let i = 0; i < depArray.length; i++) {
                    if (res[i].department === answer.department) {
                        depID = res[i].id;
                    }
                };

                connection.query("INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)", [answer.role, answer.salary, depID], function (err, res) {
                    if (err) throw err;
                    console.log(res)

                    runSearch();

                })


            });
    })
}


// foreign key