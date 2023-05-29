USE employee_db;

INSERT INTO department (name)
VALUES
    ('Sales'),
    ('Customer Service'),
    ('Marketing'),
    ('Manager');

INSERT INTO employee_role (title, salary, department_id)
VALUES
    ('Sales Representative', 40000, 1),
    ('Manager', 55000, 4),
    ('Marketing Coordinator', 80000, 3),
    ('CS Representative', 35000, 2);
 
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Porter', 1, NULL),
    ('Crystal', 'Sutherland', 2, NULL),
    ('Pasqual', 'Bianchi', 3, NULL),
    ('Chantelle', 'King', 4, NULL);

UPDATE employee SET manager_id = 2 WHERE id = 1;
UPDATE employee SET manager_id = 2 WHERE id = 3;
UPDATE employee SET manager_id = 2 WHERE id = 4;