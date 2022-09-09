INSERT INTO department (id, name)
VALUES (1,"Sales"),
       (2,"Finance"),
       (3,"Customer Service"),
       (4,"Operations"),
       (5,"Marketing"),
       (6,"Service"),
       (7,"Engineering"),
       (8,"Legal");

INSERT INTO role (id, title, salary, department_id)
VALUES (101, "Sales Representative", 60000,1),
       (102, "Sales Lead", 80000,1),
       (201, "Accountant", 75000,2),
       (202, "Risk Analyst", 90000,2),
       (301, "Customer Serivce Rep", 55000,3),
       (302, "Customer Serivce Lead", 70000,3),
       (401, "Project Coordinator", 70000,4),
       (403, "Program Manager", 100000,4),
       (502, "Marketing Analyst", 90000,5),
       (505, "Chief Marketing Officer", 290000,5),
       (603, "Service Manager", 100000,6),
       (701, "Software Engineer",120000,7),
       (702, "Lead Engineer",150000,7),
       (804, "Lead Underwriter",130000,8);

INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES (0456, "Paul","Walker",302,NULL),
       (0978, "Matt","Cage",702,0456),
       (0874, "Duc","Smith",101,NULL),
       (0964, "Rosalia","Valenz",701,NULL),
       (0918, "Toosii","Lucc",804,NULL),
       (0510, "Andrew","Page",505,NULL),
       (0648, "Victoria","Coscarelli",603,NULL);
       