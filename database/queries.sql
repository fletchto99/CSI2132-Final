-- sql queries
-- a. Display all the information about a user‐specified movie. That is, the user should select the
-- name of the movie from a list, and the information as contained in the movie table should then
-- be displayed on the screen.

SELECT
  Title,
  Release_Date,
  Description,
  Poster
FROM Movie
WHERE Title
      ILIKE '%Shawshank%'; -- Case insensitive

-- b. Display the full list of actors, and their roles, of a specific movie. That is, the user should select
-- the name of the movie from a list, and all the details of the actors, together with their roles,
-- should be displayed on the screen.

SELECT
  A.Name,
  MA.Role_Name
FROM Actor A, MovieActor MA
WHERE MA.Movie_ID = 1 -- Movie is Whiplash
      AND A.Actor_ID = MA.Actor_ID;

-- c. For each user‐specified category of movie, list the details of the director(s) and studio(s),
-- together with the date that the movie has been released. The user should be able to select the
-- category (e.g. Horror or Nature) from a list.

SELECT
  M.title,
  T.name,
  D.Name,
  S.Name,
  M.Release_Date
FROM Director D, Studio S, Movie M, Topic T, MovieTopic MT, MovieDirector MD, MovieStudio MS
WHERE T.name = 'Action'
      AND T.Topic_ID = MT.Topic_ID
      AND M.Movie_ID = MT.Movie_ID
      AND M.Movie_ID = MD.Movie_ID
      AND M.Movie_ID = MS.Movie_ID
      AND MD.Director_ID = D.Director_ID
      AND MS.Studio_ID = S.Studio_ID;

-- d. Display the information about the actor that appeared the most often in the movies, as
-- contained in your database. Display this information together with the details of the director(s)
-- and the studio(s) that s(he) worked with.


SELECT
  a.actor_id,
  a.name,
  ma.movie_id,
  m.title,
  m.release_date,
  s.name AS studio_name,
  d.name AS director_name
FROM Actor a
  INNER JOIN movieactor ma ON ma.actor_id = a.actor_id
  INNER JOIN movie m ON m.movie_id = ma.movie_id
  INNER JOIN moviestudio ms ON ms.movie_id = m.movie_id
  INNER JOIN moviedirector md ON md.movie_id = m.movie_id
  INNER JOIN studio s ON s.studio_id = ms.studio_id
  INNER JOIN director d ON d.director_id = md.director_id
WHERE a.Actor_ID = (
  SELECT MA.actor_id
  FROM MovieActor MA
  GROUP BY MA.Actor_ID
  ORDER BY COUNT(*) DESC
  LIMIT 1
);

-- e. Display the information about the two actors that appeared the most often together in the
-- movies, as contained in your database.

SELECT
  A1.name,
  A1.dob,
  A2.name,
  A2.dob,
  RS.together
FROM
  (SELECT
     ma1.actor_id                 AS aid1,
     a1.name,
     ma2.actor_id                 AS aid2,
     a2.name,
     count(DISTINCT ma1.movie_id) AS together
   FROM movieactor ma1
     INNER JOIN movieactor ma2 ON ma1.movie_id = ma2.movie_id AND ma1.actor_id < ma2.actor_id
     INNER JOIN actor a1 ON ma1.actor_id = a1.actor_id
     INNER JOIN actor a2 ON ma2.actor_id = a2.actor_id
   GROUP BY ma1.actor_id, ma2.actor_id, a1.name, a2.name
   ORDER BY together DESC
   LIMIT 1) AS RS
  INNER JOIN Actor A1 ON A1.Actor_ID = RS.aid1
  INNER JOIN Actor A2 ON A2.Actor_ID = RS.aid2;

-- f. Find the names of the ten movies with the highest overall ratings in your database.

SELECT
  M.Title,
  (SELECT AVG(PM.Rating)
   FROM ProfileMovie PM
   WHERE PM.Movie_ID = M.Movie_ID) AS Rating
FROM Movie M
ORDER BY Rating DESC
LIMIT 10;

-- g. Find the movie(s) with the highest overall rating in your database. Display all the movie details,
-- together with the topics (tags) associated with it.	

SELECT
  M.Title,
  M.Release_Date,
  M.Description,
  M.Poster,
  A.name,
  D.name,
  S.name,
  T.name,
  (SELECT AVG(PM.Rating)
   FROM ProfileMovie PM
   WHERE PM.Movie_ID = M.Movie_ID) AS Rating
FROM Movie M
  INNER JOIN MovieActor MA ON MA.Movie_ID = M.Movie_ID
  INNER JOIN Actor A ON A.Actor_ID = MA.Actor_ID
  INNER JOIN MovieStudio MS ON MS.Movie_ID = M.Movie_ID
  INNER JOIN Studio S ON S.Studio_ID = MS.Studio_ID
  INNER JOIN MovieDirector MD ON M.Movie_ID = MD.Movie_ID
  INNER JOIN Director D ON D.Director_ID = MD.Director_ID
  INNER JOIN MovieTopic MT ON MT.Movie_ID = M.Movie_ID
  INNER JOIN Topic T ON T.Topic_ID = MT.Topic_ID
ORDER BY Rating DESC;

-- h. Find the total number of rating for each movie, for each user. That is, the data should be
-- grouped by the movie, the specific users and the numeric ratings they have received.

-- Comment: This question's wording is ambiguous and difficult to understand. 
--			We interpreted it as the distribution of ratings in the database (how many 10's, 9's, etc.)

SELECT
  PM.Rating,
  count(PM.Rating)
FROM ProfileMovie PM
GROUP BY PM.Rating;

-- i. Display the details of the movies that have not been rated since January 2016.

SELECT
  M.Title,
  M.Release_Date
FROM Movie M
WHERE M.Movie_ID IN (SELECT M2.Movie_ID
                     FROM Movie M2, ProfileMovie PM2
                     WHERE M2.Movie_ID = PM2.Movie_ID
                           AND '2016-01-01' > PM2.date);

-- j. Find the names, release dates and the names of the directors of the movies that obtained 
-- rating that is lower than any rating given by user X. Order your results by the dates of 
-- the ratings. (Here, X refers to any user of your choice.)

SELECT
  M.Title,
  M.Release_Date,
  D.name
FROM Movie M
  INNER JOIN ProfileMovie PM ON M.Movie_ID = PM.Movie_ID
  INNER JOIN MovieDirector MD ON M.Movie_ID = MD.Movie_ID
  INNER JOIN Director D ON D.Director_ID = MD.Director_ID
WHERE PM.Rating < ALL (SELECT PM1.Rating
                       FROM ProfileMovie PM1
                       WHERE PM1.Profile_ID = 1);

-- k. List the details of the Type Y movie that obtained the highest rating. Display the movie name
-- together with the name(s) of the rater(s) who gave these ratings. (Here, Type Y refers to any
-- movie type of your choice, e.g. Horror or Romance.)

SELECT
  M.Title,
  M.Release_Date,
  M.Description,
  D.name
FROM (SELECT
        AVG(PM.Rating) AS Rating,
        PM.Movie_ID
      FROM ProfileMovie PM
      WHERE PM.Movie_ID IN
            (SELECT M.Movie_ID
             FROM Movie M, MovieTopic MT, Topic T
             WHERE T.name = 'Drama'
                   AND T.Topic_ID = MT.Topic_ID
                   AND MT.Movie_ID = M.Movie_ID)
      GROUP BY PM.Movie_ID
      ORDER BY Rating DESC
      LIMIT 1) AS RS
  INNER JOIN Movie M ON M.movie_ID = RS.Movie_ID
  INNER JOIN MovieDirector MD ON MD.Movie_ID = RS.movie_id
  INNER JOIN Director D ON MD.Director_ID = D.director_id;

-- l. Provide a query to determine whether Type Y movies are “more popular” than other movies.
-- (Here, Type Y refers to any movie type of your choice, e.g. Nature.) Yes, this query is open to
-- your own interpretation!

SELECT
  AVG(PM.Rating) AS Rating,
  MT.Topic_ID,
  T.name
FROM ProfileMovie PM
  INNER JOIN MovieTopic MT ON MT.Movie_ID = PM.Movie_ID
  INNER JOIN Topic T ON T.Topic_ID = MT.Topic_ID
GROUP BY MT.Topic_ID, T.name
ORDER BY Rating DESC;

-- m. Find the names, join‐date and profiling information (age‐range, gender, and so on) of 
-- the users that give the highest overall ratings. Display this information together with 
-- the names of the movies and the dates the ratings were done.

SELECT
  TMP.AvgRating,
  P.First_Name,
  P.Last_Name,
  P.Dob,
  P.Occupation,
  P.Gender
FROM
  (SELECT
     AVG(PM.Rating) AS AvgRating,
     PM.Profile_ID
   FROM ProfileMovie PM
   GROUP BY PM.Profile_ID) AS TMP
INNER JOIN Profile P ON P.Profile_ID = TMP.Profile_ID
WHERE TMP.AvgRating > ((SELECT AVG(PM2.Rating) AS GlobalAverage
                        FROM ProfileMovie PM2)
                       + (0.10) * (SELECT STDDEV(PM1.Rating) AS GlobalDeviation
                                   FROM ProfileMovie PM1))


-- n. Find the names, join‐date and profiling information (age‐range, gender, and so on) of 
-- the users that rated a specific movie (say movie Z) the most frequently.
-- NOTE: In our implementation, you can only ever rate once. 

SELECT
  M.Title,
  PM.Rating,
-- not implemented yet  PM.Comment,
  P.First_Name,
  P.Last_Name,
  P.Dob,
  P.Occupation,
  P.Gender
FROM Profile P
INNER JOIN ProfileMovie PM ON PM.Profile_ID = P.Profile_ID
INNER JOIN Movie M ON PM.Movie_ID = M.Movie_ID
WHERE M.Title ILIKE='Interstellar'

-- o. Find the names and emails of all users who gave ratings that are lower than that of a 
-- rater with a name called John Smith. (Note that there may be more than one rater with this name).

SELECT
  P.First_Name,
  P.Last_Name,
  P.Dob,
  P.Occupation,
  P.Gender,
  A.Email,
  A.Join_date
FROM Profile P
  INNER JOIN ProfileMovie PM ON PM.Profile_ID = P.Profile_ID
  INNER JOIN Account A ON P.Profile_ID = A.Profile_ID
WHERE PM.Rating <
      (SELECT PM1.Rating
       FROM ProfileMovie PM1
         INNER JOIN Profile P1 ON P1.Profile_ID = PM1.Profile_ID
       WHERE P1.First_Name = 'John'
             AND P1.Last_Name = 'Smith'
             AND PM1.Movie_ID = PM.Movie_ID)

-- p. Find the names and emails of the users that provide the most diverse ratings within 
-- a specific genre. Display this information together with the movie names and the ratings. 
-- For example, Jane Doe may have rated terminator 1 as a 1, Terminator 2 as a 10 and 
-- Terminator 3 as a 3. Clearly, she changes her mind quite often!             

SELECT
  TMP.First_Name,
  TMP.Last_Name,
  TMP.TopicName,
  TMP.RatingDistance,
  MAX(RatingDistance)
FROM (SELECT
        P1.First_Name,
        P1.Last_Name,
        @(MAX(PM1.Rating) - MIN(PM1.Rating)) AS RatingDistance,
        T1.Name                              AS TopicName
      FROM ProfileMovie PM1
        INNER JOIN MovieTopic MT1 ON MT1.Movie_ID = PM1.Movie_ID
        INNER JOIN Topic T1 ON T1.Topic_ID = MT1.Topic_ID
        INNER JOIN Profile P1 ON P1.Profile_ID = PM1.Profile_ID
        INNER JOIN Account A1 ON A1.Profile_ID = P1.Profile_ID
      GROUP BY P1.First_Name, P1.Last_Name, T1.Name) AS TMP
GROUP BY TMP.First_Name, TMP.Last_Name, TMP.TopicName, TMP.RatingDistance