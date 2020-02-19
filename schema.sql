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


INSERT INTO department (name)
VALUES ("hr", );

INSERT INTO  employee (first_name, last_name)
VALUES ("ryan", "thomas");

SELECT  * from department
JOIN role on role.department_id = department.id ;

select * from role
JOIN employee on employee.role_id = role.id;

DELETE FROM employee WHERE first_name = ""
