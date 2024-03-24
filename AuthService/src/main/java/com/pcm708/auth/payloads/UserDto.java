package com.pcm708.auth.payloads;

import lombok.Data;

@Data
public class UserDto {
	private int user_id;
	private String name;
	private String email;
	private int age;
	private String gender;
	private String latitude;
	private String longitude;
}