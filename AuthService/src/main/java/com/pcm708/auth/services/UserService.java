package com.pcm708.auth.services;

import com.pcm708.auth.entities.User;

public interface UserService {

	User registerNewUser();
	User getUserById(Integer userId);

}
