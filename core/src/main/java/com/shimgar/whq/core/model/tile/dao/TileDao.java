package com.shimgar.whq.core.model.tile.dao;

import org.springframework.data.repository.CrudRepository;

import com.shimgar.whq.core.model.tile.Tile;

public interface TileDao extends CrudRepository<Tile, Integer> {
	
}
