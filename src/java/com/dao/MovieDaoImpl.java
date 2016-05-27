package com.smdb.dao;
import java.util.ArrayList;
import java.util.List;

import javax.transaction.HeuristicMixedException;
import javax.transaction.HeuristicRollbackException;
import javax.transaction.RollbackException;
import javax.transaction.SystemException;

import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import com.smdb.dao.MovieDao;
import com.smdb.model.Movie;

@Component
public class MovieDaoImpl implements MovieDao{
	private SessionFactory sessionFactory;
	
	public SessionFactory getSessionFactory(){
		return sessionFactory;
	}

	@Autowired
    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

	public List<Movie> test(){
		Session session = this.sessionFactory.openSession();
		Transaction tx = session.beginTransaction();
		
		System.out.println("!----- All RIGHT ! -----!");
		List<Movie> movieList = new ArrayList<Movie>();
		Query getMoviesQuery = session.createQuery("from Movie");
		movieList.addAll(getMoviesQuery.list());
		
		Movie movie = movieList.get(0);
		System.out.println("----- info"+movie.getTitle());
		
		tx.commit();
		session.close();
		
		return movieList;
	}

	public void save(Movie m) {
		Session session = this.sessionFactory.openSession();
		Transaction tx = session.beginTransaction();
		
		session.persist(m);
		
		tx.commit();
		session.close();			
	}

	public List<Movie> getMovies() {
		Session session = this.sessionFactory.openSession();
		Transaction tx = session.beginTransaction();
		/*
		List<Movie> movieList = new ArrayList<Movie>();
		Query getMoviesQuery = session.createQuery("from Movie");
		movieList.addAll(getMoviesQuery.list());
		*/
		
		Query getMoviesQuery = session.createQuery("from Movie");
		List<Movie> movieList = getMoviesQuery.list();
		
		tx.commit();
		session.close();
		return movieList;
	}

	public Movie getMovie(int id) {
		Session session = this.sessionFactory.openSession();
		Transaction tx = session.beginTransaction();
		
		Query getMovieQuery = session.createQuery("from Movie WHERE id= :id");
		getMovieQuery.setParameter("id", id);
		Movie movie = (Movie)getMovieQuery.uniqueResult();
		
		tx.commit();
		session.close();
		return movie;	}

	public int updateMovie(int id, Movie movie){
		Session session = this.sessionFactory.openSession();
		Transaction tx = session.beginTransaction();
		
		Query updateMovie = session.createQuery(
			"UPDATE Movie SET "
			+ " title = :title"
			+ " description = :description"
			+ " year = :year"
			+ " rating = :rating"
			+ " thumbnailUrl = :thumbnailUrl"
			+ " cast = :cast"
			+ " directors = :directors"	
			+ "WHERE id = :id"
		);
		
		updateMovie.setParameter("title", movie.getTitle());
		updateMovie.setParameter("description", movie.getDescription());
		updateMovie.setParameter("year", movie.getYear());
		updateMovie.setParameter("rating", movie.getRating());
		updateMovie.setParameter("thumbnailUrl", movie.getThumbnailUrl());
		updateMovie.setParameter("cast", movie.getCast());
		updateMovie.setParameter("directors", movie.getDirectors());
		updateMovie.setParameter("id", id);
		
		int updateStatus = updateMovie.executeUpdate();
		tx.commit();
		session.close();
		return updateStatus;
	}
	
	public int deleteMovie(int id){
		Session session = sessionFactory.openSession();
		Transaction tx = session.beginTransaction();
		
		Query deleteQuery = session.createQuery("DELETE Movie WHERE id = :id");
		deleteQuery.setParameter("id", id);
		
		int deleteStatus = deleteQuery.executeUpdate();
		tx.commit();
		session.close();
		return deleteStatus;
	}
}


