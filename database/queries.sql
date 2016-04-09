-- sql queries
--Display all the information about a user‐specified movie. That is, the user should select the
-- name of the movie from a list, and the information as contained in the movie table should then
-- be displayed on the screen.

SELECT Title, Date_Released, Description, Poster, Rating 
	FROM Movie 
	WHERE Title 
	ILIKE '%var%'; -- Case insensitive

-- Display the full list of actors, and their roles, of a specific movie. That is, the user should select
-- the name of the movie from a list, and all the details of the actors, together with their roles,
-- should be displayed on the screen.

SELECT A.Name, MA.Role_Name 
	FROM Actor A, MovieActor MA 
	WHERE MA.Movie_ID = 'var'
		AND A.Actor_ID = MA.Actor_ID

-- c. For each user‐specified category of movie, list the details of the director(s) and studio(s),
-- together with the date that the movie has been released. The user should be able to select the
-- category (e.g. Horror or Nature) from a list.

SELECT D.Name, S.Name, M.Date_Released
	FROM Director D, Studio S, Movie M, Topic T, MovieTopic MT, MovieDirector MD, MovieStudio MS
	WHERE T.Topic_ID='var'
		AND M.Movie_ID = MT.Movie_ID
		AND M.Movie_ID = MD.Movie_ID
		AND M.Movie_ID = MS.Movie_ID
		AND MD.Director_ID = D.Director_ID
		AND MS.Studio_ID = S.Studio_ID

-- d. Display the information about the actor that appeared the most often in the movies, as
-- contained in your database. Display this information together with the details of the director(s)
-- and the studio(s) that s(he) worked with.

SELECT COUNT(*) FROM MovieActor MA WHERE MA.Actor_ID = ()

SELECT A.Name, M.Name, MA.Role_Name, D.Name, S.Name 
	FROM Actor A, Director D, Studio S, Movie M, MovieActor MA, MovieDirector MD, MovieStudio MS
	WHERE A.Actor_ID = 
		AND A.Actor_ID = MA.Actor_ID
		AND M.Movie_ID = MA.Movie_ID
		AND M.Movie_ID = MD.Movie_ID
		AND M.Movie_ID = MS.Movie_ID
		AND D.Director_ID = MD.Director_ID
		AND S.Studio_ID = MS.Studio_ID

-- e. Display the information about the two actors that appeared the most often together in the
-- movies, as contained in your database.

