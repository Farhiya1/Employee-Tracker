USE employee_db;

INSERT INTO department (full_name)
VALUES 
('Engineering'),
('Finance'),
('Sales'),
('Human Resources'),
('Legal');

INSERT INTO role (title, salary, department_id)
VALUES
('Web Developer', 60000, 1),
('Accountant', 70000, 2),
('Customer Representative', 50000, 3),
('Manager', 40000, 4),
('Software Engineer', 90000, 5),
('Sales Rep', 30000, 6),
('lawyer', 70000, 7),
('HR', 35000, 8);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Christian', 'Bale', 1, 22),
('Veronica', 'Simmonds', 2, 33),
('Rohan', 'Josh', 3, 44),
('Maria', 'Sandoval', 4, 55 ),
('Rose', 'Martinez', 5, 66),
('Ahmed', 'Yusuf', 6, 77),
('Nathan', 'Miles', 7, 88),
('Fatima', 'Noor', 8, 99);