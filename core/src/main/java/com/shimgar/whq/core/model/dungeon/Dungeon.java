package com.shimgar.whq.core.model.dungeon;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import lombok.Data;

@Data
@Entity
public class Dungeon {
	
	@Id
	@GeneratedValue
	private int id;
	
	@OneToMany(cascade = {CascadeType.ALL})
	private List<DungeonTile> dungeonTileList;
	//@OneToMany
	//private Set<DungeonDoor> doors;
}
