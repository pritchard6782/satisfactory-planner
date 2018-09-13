package com.shimgar.whq.lobby.controller;

import org.jboss.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shimgar.whq.core.model.dungeon.Dungeon;
import com.shimgar.whq.core.model.room.Room;
import com.shimgar.whq.core.model.room.dao.RoomDao;
import com.shimgar.whq.core.util.DungeonGenerator;

@CrossOrigin
@RestController
@RequestMapping("/lobby")
public class WhqLobbyController {

	private static final Logger LOG = Logger.getLogger(WhqLobbyController.class);
	
	@Autowired
	private DungeonGenerator dungeonGenerator;
	@Autowired
	private RoomDao roomDao;
	
    @RequestMapping("/list")
    public Iterable<Room> listRooms() {
    	return roomDao.findAll();
    }
	
    @RequestMapping("/new")
    public Room createNewRoom(String roomName) {
    	LOG.debug("Creating new room, name: " + roomName);

    	Dungeon dungeon = dungeonGenerator.generateNewDungeon();
    	Room room = new Room();
    	room.setRoomName(roomName);
    	room.setDungeon(dungeon);
    	roomDao.save(room);

    	LOG.debug("Room created, " + room);
    	return room;
    }
}
