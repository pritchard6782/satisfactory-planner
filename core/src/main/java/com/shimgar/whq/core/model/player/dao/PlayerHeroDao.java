package com.shimgar.whq.core.model.player.dao;

import org.springframework.data.repository.CrudRepository;

import com.shimgar.whq.core.model.player.PlayerHero;

public interface PlayerHeroDao extends CrudRepository<PlayerHero, Integer> {
	
}
