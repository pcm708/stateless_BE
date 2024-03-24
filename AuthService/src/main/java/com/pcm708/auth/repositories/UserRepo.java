package com.pcm708.auth.repositories;

import java.util.List;
import java.util.Optional;

import com.pcm708.auth.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<User, Integer>{
	Optional<User> findByEmail(String email);
}
