package com.shimgar.whq.whq.controller;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.shimgar.whq.core.model.room.Room;
import com.shimgar.whq.core.model.room.dao.RoomDao;
import com.shimgar.whq.whq.model.ChatMessage;

@Controller
public class WhqController {

	Logger log = LoggerFactory.getLogger(WhqController.class);
	
	@Autowired
	private RoomDao roomDao;

    @MessageMapping("/newRoom")
	@SendTo("/topic/public")
    public Optional<Room> newRoom() {
    	
		log.debug("in sendmessage ");
		return roomDao.findById(1);
	}

    @MessageMapping("/getRoom")
	@SendTo("/topic/public")
    public Optional<Room> getRoom(@Payload Integer roomId) {
		log.debug("in sendmessage " + roomId);
		
		return roomDao.findById(roomId);
	}

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    //public ChatMessage addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
    public ChatMessage addUser() {
        // Add username in web socket session
//        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
//        return chatMessage;
		log.debug("in adduser");
		return new ChatMessage();
    }
}
