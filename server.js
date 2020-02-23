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
    console.log('\n');
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View all employees",
                "View departments",
                "View role",
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

                case "View role":
                    viewRole();
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

                case "update employee role":
                    updateEmployeeRole();
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
            console.log("ID: " + res[i].id + " || First Name: " + res[i].first_name + " || Last Name: " + res[i].last_name + " || Role ID: " + res[i].role_id + " || Manager ID: " + res[i].manager_id);

        }
        runSearch();
    });
}


function viewDep() {

    var query = "SELECT * FROM department";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].id + " || Department: " + res[i].name);
        }
        runSearch();
    });
}

function viewRole() {

    var query = "SELECT * FROM role";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].id + " || Title: " + res[i].title + " || salary: " + res[i].Salary + " department_id: " + res[i].department_id);
        }
        runSearch();
    });
}



function addEmployee() {


    var roleArray = []
    var roleID = ""

    connection.query("SELECT * FROM role;", function (err, res) {
        if (err) throw err;

        for (let i = 0; i < res.length; i++) {
            roleArray.push(res[i].title);


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
            choices: roleArray
        },
        ]


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
    })
}

function removeEmployee() {


    var employeeArray = []

    connection.query("SELECT * FROM employee;", function (err, res) {
        if (err) throw err;

        for (let i = 0; i < res.length; i++) {
            employeeArray.push(res[i].first_name);


        }

        inquirer
            .prompt({
                name: "remove",
                type: "list",
                message: "What employee would you like to remove?",
                choices: employeeArray
            })
            .then(function (answer) {

                connection.query("DELETE FROM employee WHERE first_name = ?", answer.remove, function (err, res) {
                    if (err) throw err;
                    for (var i = 0; i < res.length; i++) {
                        console.log("deleted " + answer.remove + " ID: " + res[i].id + " || First Name: " + res[i].first_name + " || Last Name: " + res[i].last_name + " || Role ID: " + res[i].role_id);
                    }
                    runSearch();
                });
            })
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


        for (let i = 0; i < res.length; i++) {
            depArray.push(res[i].name);


        }
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




        inquirer
            .prompt(addRoleQuestions)
            .then(function (answer) {

                var depID = "";

                for (let i = 0; i < depArray.length; i++) {
                    if (res[i].name === answer.department) {
                        depID = res[i].id;
                    }
                };

                connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [answer.role, answer.salary, depID], function (err, res) {
                    if (err) throw err;
                    console.log(answer.role + " added!")


                    runSearch();

                })


            });
    })
}

// function updateEmployeeRole() {


//     var employeeArray = []

//     var roleArray = []

//     connection.query("SELECT * FROM employee;", function (err, res) {
//         if (err) throw err;

//         for (let i = 0; i < res.length; i++) {
//             employeeArray.push(res[i].id + " " + res[i].first_name + " " + res[i].last_name + " " + res[i].title);



//         }
//         connection.query("SELECT * FROM role;", function (err, res) {
//             if (err) throw err;

//             for (let i = 0; i < res.length; i++) {
//                 roleArray.push(res[i].id + " " + res[i].title);



//             }

//             inquirer
//                 .prompt({
//                     name: "updateRole",
//                     type: "list",
//                     message: "Which employee role would you like to change?",
//                     choices: employeeArray
//                 })
//                 .then(function (answer) {

//                     connection.query("ALTER FROM employee WHERE first_name = ?", answer.remove, function (err, res) {
//                         if (err) throw err;
//                         for (var i = 0; i < res.length; i++) {
//                             console.log("altered " + answer.remove + " ID: " + res[i].id + " || First Name: " + res[i].first_name + " || Last Name: " + res[i].last_name + " || Role ID: " + res[i].role_id);
//                         }
//                         runSearch();
//                     });
//                 })
//         })
//     })
// }



function updateEmployeeRole() {
    var query = "SELECT employee.id, first_name, last_name, title FROM employee " +
        "LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id";

    connection.query(query, function (err, res) {
        if (err) throw err;

        var employeeArray = [];
        var employeeId = "";
        var newRole = ""

        for (let i = 0; i < res.length; i++) {
            employeeArray.push(res[i].id + " " + res[i].first_name + " " + res[i].last_name + " | " + res[i].title);
        }

        inquirer
            .prompt({
                name: "updateRole",
                type: "list",
                message: "Which role do you want to change?",
                choices: employeeArray
            })
            .then(function (answer) {

                var currentId = answer.updateRole.split(" ");
                employeeId = currentId[0];

                connection.query("SELECT * from role;", function (err, res) {
                    if (err) throw err;

                    var roleArray = [];

                    for (let i = 0; i < res.length; i++) {
                        roleArray.push(res[i].id + " " + res[i].title);
                    }

                    inquirer
                        .prompt({
                            name: "role",
                            type: "list",
                            message: "What role do you want to replace it with?",
                            choices: roleArray
                        }).then(function (answer) {

                            role = answer.role.split(" ");

                            var query = "UPDATE employee " +
                                "LEFT JOIN role ON employee.role_id = role.id " +
                                "LEFT JOIN department ON role.department_id = department.id " +
                                "SET role_id = ? " +
                                "WHERE employee.id = ?;"

                            connection.query(query, [role[0], employeeId], function (err, res) {
                                if (err) throw err;

                                console.log(role[1] + " Role changed!");

                                runSearch();
                            });
                        });
                })
            })
    })
};


// foreign key