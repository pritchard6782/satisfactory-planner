package com.shimgar.whq.lobby.controller;

import org.jboss.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shimgar.whq.core.model.dungeon.Dungeon;
import com.shimgar.whq.core.model.dungeon.dao.DungeonDao;
import com.shimgar.whq.core.model.tile.Tile;
import com.shimgar.whq.core.model.tile.dao.TileDao;
import com.shimgar.whq.core.util.DungeonGenerator;

@RestController
public class WhqLobbyController {

	private static final Logger LOG = Logger.getLogger(WhqLobbyController.class);
	
	@Autowired
	private DungeonGenerator dungeonGenerator;
	@Autowired
	private TileDao tileDao;
	@Autowired
	private DungeonDao dungeonDao;
	
    @RequestMapping("/newroom")
    public Dungeon createNewRoom() {
    	LOG.debug("Creating new room");
    	
    	for(Tile tile: tileDao.findAll()) {
    		boolean[][] squares = new boolean[][] {
    			{true, true, true, true},
    			{true, true, true, true},
    			{true, true, true, true},
    			{true, true, true, true}
    		};
    		tile.setFloor(squares);
    		tileDao.save(tile);
    	}
    	
    	Dungeon newDungeon = dungeonGenerator.generateNewDungeon();
    	dungeonDao.save(newDungeon);
    	return newDungeon;
    }
	
    @RequestMapping("/join")
    public Dungeon createNewRoom(@RequestParam String name) {
    	LOG.debug("Joining room " + name);
    	return new Dungeon();
    }
}
