package com.pcm708.auth.services.impl;

import com.pcm708.auth.payloads.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class KafkaProducerService {

    @Autowired
    private KafkaTemplate<String, UserDto> kafkaTemplate;

    public void sendMessage(UserDto userDto) {
        kafkaTemplate.send(MessageBuilder.withPayload(userDto)
                .setHeader(KafkaHeaders.TOPIC, "userTopic")
                .build());
    }
}