package com.shimgar.whq.core.util;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.shimgar.whq.core.model.dungeon.Dungeon;
import com.shimgar.whq.core.model.dungeon.DungeonTile;
import com.shimgar.whq.core.model.tile.dao.TileDao;

@Component
public class DungeonGenerator {
	
	@Autowired
	private TileDao tileDao;
	
	/**
	 * Generate a new dungeon
	 */
	public Dungeon generateNewDungeon() {
		Dungeon dungeon = new Dungeon();
		dungeon.setDungeonTileList(createNewTileDeck());
		arrangeFloorTiles(dungeon);
		return dungeon;
	}

	/**
	 * Create new deck
	 */
	private List<DungeonTile> createNewTileDeck() {
		List<DungeonTile> tileList = new ArrayList<>();
		tileDao.findAll().forEach(tile -> {
			DungeonTile dungeonTile = new DungeonTile();
			dungeonTile.setTile(tile);
			tileList.add(dungeonTile);
		});
		Collections.shuffle(tileList);
		return tileList;
	}
	
	/**
	 * 
	 */
	private void arrangeFloorTiles(Dungeon dungeon) {
		for (DungeonTile dungeonTile: dungeon.getDungeonTileList()) {
			dungeonTile.setX(2);
			dungeonTile.setY(3);
		}
	}
}
