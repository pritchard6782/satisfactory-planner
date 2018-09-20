package com.shimgar.whq.core.model.tile.dao;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.shimgar.whq.core.model.tile.Tile;
import com.shimgar.whq.core.model.tile.TileImmutable;

@Repository
public abstract class TileDao implements CrudRepository<Tile, Integer> {
	
	@Cacheable
	public List<TileImmutable> findAllImmutable() {
		List<TileImmutable> tiles = new ArrayList<>();
		findAll().forEach(t -> tiles.add(new TileImmutable(t)));
		return Collections.unmodifiableList(tiles);
	}
}
