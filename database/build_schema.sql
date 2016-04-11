DO $$ DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;

DROP DOMAIN IF EXISTS GENDER;
DROP DOMAIN IF EXISTS RATING;

CREATE DOMAIN GENDER as VARCHAR CHECK(
  VALUE = 'M' OR VALUE  = 'F'
);

CREATE DOMAIN RATING as DECIMAL(3,1) CHECK(
  VALUE <= 10 AND VALUE >= 0
);

CREATE TABLE Profile (
  Profile_ID SERIAL NOT NULL PRIMARY KEY,
  First_Name VARCHAR(32) DEFAULT NULL,
  Last_Name VARCHAR(32) DEFAULT NULL,
  DOB DATE DEFAULT NULL,
  Gender GENDER DEFAULT NULL,
  Occupation VARCHAR(64) DEFAULT NULL,
  Device_Used VARCHAR(64) DEFAULT NULL
);

CREATE TABLE Account (
  Account_ID SERIAL NOT NULL PRIMARY KEY,
  Password VARCHAR(60) NOT NULL,
  Username VARCHAR(32) NOT NULL,
  Email VARCHAR(255) NOT NULL,
  Join_Date DATE NOT NULL DEFAULT CURRENT_DATE,
  Profile_ID INT NOT NULL REFERENCES Profile(Profile_ID)
);

CREATE TABLE Movie (
  Movie_ID SERIAL NOT NULL PRIMARY KEY,
  Title VARCHAR(128) NOT NULL,
  Release_Date DATE NOT NULL,
  Description TEXT NOT NULL,
  Poster VARCHAR(128) DEFAULT NULL,
  IMDB_ID VARCHAR(9) DEFAULT NULL
);

CREATE TABLE Topic (
  Topic_ID SERIAL NOT NULL PRIMARY KEY,
  Name VARCHAR(128) NOT NULL
);

CREATE TABLE MovieTopic (
  Movie_ID INT NOT NULL REFERENCES Movie(Movie_ID),
  Topic_ID INT NOT NULL REFERENCES Topic(Topic_ID),
  CONSTRAINT pk_Movie_Topic PRIMARY KEY (Movie_ID, Topic_ID)
);

CREATE TABLE Actor (
  Actor_ID SERIAL NOT NULL PRIMARY KEY,
  Name VARCHAR(128) NOT NULL,
  DOB DATE DEFAULT NULL
);

CREATE TABLE MovieActor (
  Movie_ID INT NOT NULL REFERENCES Movie(Movie_ID),
  Actor_ID INT NOT NULL REFERENCES Actor(Actor_ID),
  Role_Name VARCHAR(128) NOT NULL,
  CONSTRAINT pk_Movie_Actor PRIMARY KEY (Movie_ID, Actor_ID, Role_Name)
);

CREATE TABLE Director (
  Director_ID SERIAL NOT NULL PRIMARY KEY,
  Name VARCHAR(128) NOT NULL
);

CREATE TABLE MovieDirector (
  Movie_ID INT NOT NULL REFERENCES Movie(Movie_ID),
  Director_ID INT NOT NULL REFERENCES Director(Director_ID),
  CONSTRAINT pk_Movie_Director PRIMARY KEY (Movie_ID, Director_ID)
);

CREATE TABLE Studio (
  Studio_ID SERIAL NOT NULL PRIMARY KEY,
  Name VARCHAR(128) NOT NULL
);

CREATE TABLE MovieStudio (
  Movie_ID INT NOT NULL REFERENCES Movie(Movie_ID),
  Studio_ID INT NOT NULL REFERENCES Studio(Studio_ID),
  CONSTRAINT pk_Movie_Studio PRIMARY KEY (Movie_ID, Studio_ID)
);

CREATE TABLE ProfileMovie (
  Profile_ID INT NOT NULL REFERENCES Profile(Profile_ID),
  Movie_ID INT NOT NULL REFERENCES Movie(Movie_ID),
  Date DATE DEFAULT NULL,
  Rating RATING DEFAULT NULL,
  Comments TEXT DEFAULT NULL,
  CONSTRAINT pk_Profile_Movie PRIMARY KEY (Profile_ID, Movie_ID)
);