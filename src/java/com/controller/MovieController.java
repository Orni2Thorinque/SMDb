package com.smdb.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import com.smdb.model.*;
import com.smdb.dao.MovieDaoImpl;

@RestController
public class MovieController{
	private MovieDaoImpl movieDaoImpl;
	
	@Autowired
	public void setMovieDaoImpl(MovieDaoImpl movieDaoImpl){
		this.movieDaoImpl = movieDaoImpl;
	}
	
	@RequestMapping(value="/test", method = RequestMethod.GET)
	public ResponseEntity<List<Movie>> test(){
		System.out.println("!----- You Arrived in : test() -----!");		
		List<Movie> movieList = null;
		if(movieDaoImpl == null){
			return new ResponseEntity<List<Movie>>(movieList, HttpStatus.NO_CONTENT);			    
		}
		else
		{
			movieDaoImpl.getClass();
			movieList = movieDaoImpl.test();         
		}	
		return new ResponseEntity<List<Movie>>(movieList, HttpStatus.OK);	
	}
	
	
	/* Retrieve all movie titles */
	@RequestMapping(value="/getMovies", method= RequestMethod.GET)
	public ResponseEntity<List<Movie>> getMovies(){
		System.out.println("!----- You Arrived in : getMovies() -----!");		
		List<Movie> allMovies = movieDaoImpl.getMovies();
		if(allMovies.isEmpty())
		{
			return new ResponseEntity<List<Movie>>(allMovies, HttpStatus.NO_CONTENT);
		}
		else
		{
			return new ResponseEntity<List<Movie>>(allMovies, HttpStatus.OK);			
		}
	}

	@RequestMapping(value={"/getMovie/{id}"}, method= RequestMethod.GET)
	public ResponseEntity<Movie> getMovie(@PathVariable("id") int  id){
		System.out.println("!----- You Arrived in : getMovie() -----!");		
		Movie movie = movieDaoImpl.getMovie(id);
		if(movie == null)
		{
			return new ResponseEntity<Movie>(movie, HttpStatus.NO_CONTENT);
		}
		else
		{
			return new ResponseEntity<Movie>(movie, HttpStatus.OK);			
		}
	}

	@RequestMapping(value="/editMovie/{id}", method= RequestMethod.PUT)
	public ResponseEntity<Movie> editMovie(@PathVariable("id") int id, @RequestBody Movie oldMovie){
		System.out.println("!----- You Arrived in : editMovie() -----!");		
		Movie newMovie = movieDaoImpl.getMovie(id);
		
		newMovie.setYear(oldMovie.getYear());
		newMovie.setTitle(oldMovie.getTitle());
		newMovie.setDescription(oldMovie.getDescription());
		newMovie.setRating(oldMovie.getRating());
		newMovie.setThumbnailUrl(oldMovie.getThumbnailUrl());
		newMovie.setCast(oldMovie.getCast());
		newMovie.setDirectors(oldMovie.getDirectors());
		
		int updateStatus = movieDaoImpl.updateMovie(id, newMovie);
		if(updateStatus == 0)
		{
			return new ResponseEntity<Movie>(newMovie, HttpStatus.NOT_FOUND);			
		}
		else
		{
			return new ResponseEntity<Movie>(newMovie, HttpStatus.OK);						
		}
	}

	@RequestMapping(value="/deleteMovie/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Movie> deleteMovie(@PathVariable("id") int id){
		System.out.println("!----- You Arrived in : deleteMovie() -----!");		
		Movie movie = movieDaoImpl.getMovie(id);
		if(movie == null)
		{
			return new ResponseEntity<Movie>(HttpStatus.NOT_FOUND);
		}
		else
		{
			return new ResponseEntity<Movie>(HttpStatus.OK);
		}
	}

}
