DROP DATABASE IF EXISTS employee_trackerDB;
CREATE database employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE department (
  id INT NOT NULL auto_increment,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL auto_increment,
  title VARCHAR(30) NOT NULL,
  Salary DECIMAL(6) NOT NULL,
  department_id INT NOT NUll,
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT Null,
  PRIMARY KEY (id)
);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;




INSERT INTO  employee (first_name, last_name, role_id)
VALUES ("Ryan", "thomas", 3), ("Halee", "Walker", 4);


SELECT  * from department
JOIN role on role.department_id = department.id ;

select * from role
JOIN employee on employee.role_id = role.id;

DELETE FROM employee WHERE first_name = "?"






INSERT INTO department (name)
VALUES ("Accounting"),("Programming"),("Sales");





INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 54.2, 1),
        ("Senior Engineer", 105.3, 1),
        ("Sales Person", 50.1, 2),
        ("Sales Lead", 83.9, 2),
        ("Lead Accountant",120.3, 3),
        ("Accountant", 65.3, 3);