package com.shimgar.whq.core.model.dungeon.dao;

import org.springframework.data.repository.CrudRepository;

import com.shimgar.whq.core.model.dungeon.Dungeon;

public interface DungeonDao extends CrudRepository<Dungeon, Integer> {
	
}
