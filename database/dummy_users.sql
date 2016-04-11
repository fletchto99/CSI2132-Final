-- dummy_users.sql

INSERT INTO PROFILE (First_Name, Last_Name, DOB, Gender, Occupation, Device_Used) VALUES
('Jane', 'Fonda', DATE '1937-12-21', F, 'Actress', 'iPhone'),

INSERT INTO Account (Password, Username, Email, Join_Date, Profile_ID ) VALUES 
('jfonda', 'jfonda')