package com.shimgar.whq.whq.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import com.shimgar.whq.whq.model.ChatMessage;

@Controller
public class WhqController {

	Logger log = LoggerFactory.getLogger(WhqController.class);

    @MessageMapping("/chat.sendMessage")
	@SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
		log.debug(chatMessage.toString());
		return chatMessage;
	}

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        // Add username in web socket session
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        return chatMessage;
    }
}
