package com.shimgar.whq.core.model.player.dao;

import org.springframework.data.repository.CrudRepository;

import com.shimgar.whq.core.model.player.Player;

public interface PlayerDao extends CrudRepository<Player, Integer> {
	
}
