-- dummy_users.sql

INSERT INTO PROFILE (First_Name, Last_Name, DOB, Gender, Occupation, Device_Used) VALUES
('Jane', 'Fonda', DATE '1937-12-21', F, 'Actress', 'iPhone'),
('John', 'Smith', DATE '1966-01-11', M, 'Chemist', 'iPad'),


INSERT INTO Account (Password, Username, Email, Join_Date, Profile_ID ) VALUES 
('jfonda', 'jfonda', 'jfonda@gmail.com', CURRENT_DATE, 1),
