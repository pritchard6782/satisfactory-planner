package com.shimgar.whq.core.model.player.dao;

import org.springframework.data.repository.CrudRepository;

import com.shimgar.whq.core.model.player.Hero;

public interface HeroDao extends CrudRepository<Hero, Integer> {
	
}
