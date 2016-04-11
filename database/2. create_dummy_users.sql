-- dummy_users.sql


--Run before populate script
INSERT INTO Profile (First_Name, Last_Name, DOB, Gender, Occupation, Device_Used) VALUES
('Rowan', 'Atkinson', DATE '1955-01-06', 'M', 'Comedian', 'iPad'),
('Jane', 'Fonda', DATE '1937-12-21', 'F', 'Actress', 'iPhone'),
('Isaac', 'Newton', DATE '1642-12-25', 'M', 'Physicist', 'Lenovo Thinkpad II'),
('Montell', 'Jordan', DATE '1968-12-03', 'M', 'Singer', 'Macbook Air'),
('Justin', 'Trudeau', DATE '1971-12-25', 'M', 'Prime Minister of Canada', 'Unknown'),
('Ralph', 'Wiggum', DATE '1988-03-07', 'M', 'Student at Springfield Elementary School', 'Samsung S3'),
('Marie', 'Curie', DATE '1867-11-07', 'F', 'Physicist', 'iPhone 3'),
('Chris', 'Neil', DATE '1979-06-18', 'M', 'Hockey Player, Ottawa Senators', 'iPad 3'),
('Daniel', 'Alfredsson', DATE '1972-12-11', 'M', 'Hockey Player, Ottawa Senators', 'PC'),
('John', 'Smith', DATE '1966-01-11', 'M', 'Chemist', 'iPad');


INSERT INTO Account (Password, Username, Email, Join_Date, Profile_ID ) VALUES
('rowan', 'rowan', 'rowan@atkinson.com', DATE '2011-10-10', 1),
('jfonda', 'jfonda', 'jfonda@gmail.com', DATE '2015-02-01', 2),
('inewton', 'inewton', 'inewton@cambridge.co.uk', DATE '1690-03-22', 3),
('mjordan', 'mjordan', 'montell@thisishowwedoit.com', DATE '2013-09-14', 4),
('jtrudeau', 'jtrudeau', 'jtrudeau@canada.ca', DATE '2015-11-04', 5),
('ralph9443', 'ralph9443', 'ralph9443@hotmail.com', DATE '2006-04-30', 6),
('mcurie', 'mcurie', 'mcurie@universiteparis.fr', DATE '1903-06-15', 7),
('cneil', 'cneil', 'cneil@ottawasenators.ca', DATE '2014-05-09', 8),
('alife', 'alfie', 'alfie@ottawasenators.ca', DATE '2014-04-25', 9),
('jsmith', 'jsmith', 'jsmith@gmail.com', DATE '2016-05-02', 10);