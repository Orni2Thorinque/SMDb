package com.smdb.dao;

import java.util.List;

import com.smdb.model.Movie;

public interface MovieDao {
	public void save(Movie m);
	public List<Movie> getMovies();
	public Movie getMovie(int id);
	public int updateMovie(int id, Movie movie);
}
