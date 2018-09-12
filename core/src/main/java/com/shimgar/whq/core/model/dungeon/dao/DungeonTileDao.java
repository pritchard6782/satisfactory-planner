package com.shimgar.whq.core.model.dungeon.dao;

import org.springframework.data.repository.CrudRepository;

import com.shimgar.whq.core.model.dungeon.DungeonTile;

public interface DungeonTileDao extends CrudRepository<DungeonTile, Integer> {
	
}
