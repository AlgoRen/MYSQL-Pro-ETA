DROP DATABASE IF EXISTS companyPersonnel_db;
CREATE DATABASE companyPersonnel_db;
USE companyPersonnel_db;

CREATE TABLE departments
(
	id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50), 
    PRIMARY KEY (id)
);

CREATE TABLE roles
(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(50),
    salary DECIMAL(10,2),
    department_id INT NOT NULL,
    PRIMARY KEY (id),
	FOREIGN KEY (department_id) REFERENCES departments(id)
    ON DELETE CASCADE
);

CREATE TABLE employees 
(
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NOT NULL,
    manager_id INT,
    department_id INT,
    PRIMARY KEY (id),
	FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id)

);


SELECT * FROM employees;
SELECT * FROM departments;
SELECT * FROM roles;

