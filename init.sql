CREATE USER 'movie_user' @'%' IDENTIFIED WITH mysql_native_password BY 'movie_password';
GRANT ALL PRIVILEGES ON share_movies.* TO 'movie_user' @'%';