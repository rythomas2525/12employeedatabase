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
                "View all employees by department",
                "View all employees by manager",
                "add employee",
                "remove employee",
                "update employee role",
                "update employee's manager",
                "exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View all employees":
                    viewEmployees();
                    break;

                case "View all employees by department":
                    viewEmployeesByDep();
                    break;

                case "View all employees by manager":
                    viewEmployeesByManager();
                    break;

                case "add employee":
                    addEmployee();
                    break;
                case "remove employee":
                    removeEmployee();
                    break;
                case "update employee role":
                    updateRole();
                    break;
                case "update employee's manager":
                    updateManager();
                    break;

                case "exit":
                    connection.end();
                    break;
            }
        });
}

function viewEmployees() {

    var query = "SELECT id, first_name, last_name FROM employee";
    connection.query(query, function (err, res) {
        console.log("blah")
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].id + " || First Name: " + res[i].first_name + " || Last Name: " + res[i].last_name + "Role ID: " + res[i].role_id);
        }
        runSearch();
    });
}


function viewEmployeesByDep() {
    var query = "SELECT * FROM Employee GROUP BY department";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].artist);
        }
        runSearch();
    });
}

function viewEmployeesByManager() {
    inquirer
        .prompt([
            {
                name: "start",
                type: "input",
                message: "Enter starting position: ",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "end",
                type: "input",
                message: "Enter ending position: ",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            var query = "SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?";
            connection.query(query, [answer.start, answer.end], function (err, res) {
                if (err) throw err;
                for (var i = 0; i < res.length; i++) {

                    console.log("ID: " + res[i].id + " || First Name: " + res[i].first_name + " || Last Name: " + res[i].last_name + "Role ID: " + res[i].role_id);

                }
                runSearch();
            });
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
}]

function addEmployee() {
    inquirer
        .prompt(addEmployeeQuestions)
        .then(function (answer) {
            console.log(answer.first_name);
            console.log(answer.last_name);


            // const empInfo = { first_name: answer.first_name, last_name: answer.last_name }

            connection.query("INSERT INTO  employee (first_name, last_name) VALUES (?, ?)", [answer.first_name, answer.last_name], function (err, res) {
                if (err) throw err;
                console.log("ID: " + res[i].id + " || First Name: " + res[i].first_name + " || Last Name: " + res[i].last_name + "Role ID: " + res[i].role_id);



                runSearch();
            });
        });
}

function removeEmployee() {
    inquirer
        .prompt({
            name: "song",
            type: "input",
            message: "What song would you like to look for?"
        })
        .then(function (answer) {
            console.log(answer.song);
            connection.query("SELECT * FROM top5000 WHERE ?", { song: answer.song }, function (err, res) {
                if (err) throw err;
                console.log(
                    "Position: " +
                    res[0].position +
                    " || Song: " +
                    res[0].song +
                    " || Artist: " +
                    res[0].artist +
                    " || Year: " +
                    res[0].year
                );
                runSearch();
            });
        });
}

function updateRole() {
    inquirer
        .prompt({
            name: "song",
            type: "input",
            message: "What song would you like to look for?"
        })
        .then(function (answer) {
            console.log(answer.song);
            connection.query("SELECT * FROM top5000 WHERE ?", { song: answer.song }, function (err, res) {
                if (err) throw err;
                console.log(
                    "Position: " +
                    res[0].position +
                    " || Song: " +
                    res[0].song +
                    " || Artist: " +
                    res[0].artist +
                    " || Year: " +
                    res[0].year
                );
                runSearch();
            });
        });
}
function updateManager() {
    inquirer
        .prompt({
            name: "song",
            type: "input",
            message: "What song would you like to look for?"
        })
        .then(function (answer) {
            console.log(answer.song);
            connection.query("SELECT * FROM top5000 WHERE ?", { song: answer.song }, function (err, res) {
                if (err) throw err;
                console.log(
                    "Position: " +
                    res[0].position +
                    " || Song: " +
                    res[0].song +
                    " || Artist: " +
                    res[0].artist +
                    " || Year: " +
                    res[0].year
                );
                runSearch();
            });
        });
}