package com.pcm708.auth.services.impl;

import com.github.javafaker.Faker;
import com.pcm708.auth.entities.User;
import com.pcm708.auth.exceptions.ResourceNotFoundException;
import com.pcm708.auth.payloads.UserDto;
import com.pcm708.auth.repositories.UserRepo;
import com.pcm708.auth.services.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Service
public class UserServiceImpl implements UserService {
	@Autowired
	private UserRepo userRepo;
	@Autowired
	private PasswordEncoder passwordEncoder;
	@Autowired
	private KafkaProducerService kafkaProducerService;
	@Autowired
	private ModelMapper modelMapper;

	public User getUserById(Integer userId) {
		User user = this.userRepo.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User", " Id ", userId));
		return user;
	}

	public User registerNewUser() {
		User user = new User();
		String name= new Faker().name().fullName();
		user.setName(name);
		user.setEmail(name.replaceAll(" ","").toLowerCase()+"@"+new Faker().internet().domainName());
		user.setAge(new Faker().number().numberBetween(18, 60));
		user.setGender(new Faker().options().option("male","female"));
		String pass= new Faker().internet().password();
		user.setPassword(pass);
		user.setCreated_at(new Date().toString());
		user.setLatitude(""+(28.6832091-0.1+Math.random()*(28.6832091+0.1-(28.6832091-0.1))));
		user.setLongitude(""+(77.3177894-0.1+Math.random()*(77.3177894+0.1-(77.3177894-0.1))));

		// encoded the password
		user.setPassword(this.passwordEncoder.encode(user.getPassword()));
		// save the user to db
		User newUser = this.userRepo.save(user);
		newUser.setPassword(pass);

		//send to kafka
		UserDto userDto= this.modelMapper.map(user, UserDto.class);
		userDto.setUser_id(newUser.getUser_id());
		kafkaProducerService.sendMessage(userDto);

		return newUser;
	}
}