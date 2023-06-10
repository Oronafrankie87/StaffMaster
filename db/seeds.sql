USE staffMaster_db;

INSERT INTO department (name)

VALUES
    ('Sales'),
    ('Customer Service'),
    ('Manager'),
    ('Marketing'),
    ('Director'),
    ('CFO');

INSERT INTO role (title, salary, department_id)

VALUES
    ('Sales Rep', 35000, 001),
    ('Customer Service Rep', 50000, 002),
    ('Manager', 60000, 003),
    ('Marketing Coordinator', 90000, 004),
    ('Director', 100000, 005),
    ('CFO', 120000, 006);
 
INSERT INTO employee (first_name, last_name, role_id, manager_id)

VALUES
    ('Jimmothy', 'Jimmerson', 1, NULL),
    ('Crystal', 'Crystalson', 2, NULL),
    ('John', 'Johnman', 3, NULL),
    ('Richard', 'Von Richardson', 4, NULL),
    ('Thaddeous', 'McThatterson', 5, NULL),
    ('Tulula', 'Tartarsauce', 6, NULL);


-- UPDATE employee SET manager_id = 2 WHERE id = 1;
-- UPDATE employee SET manager_id = 2 WHERE id = 3;
-- UPDATE employee SET manager_id = 2 WHERE id = 4;