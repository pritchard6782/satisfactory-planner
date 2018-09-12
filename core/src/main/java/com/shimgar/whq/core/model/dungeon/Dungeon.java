package com.shimgar.whq.core.model.dungeon;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

@Entity
public class Dungeon {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private int id;
	@OneToMany(cascade = {CascadeType.ALL})
	private List<DungeonTile> dungeonTileList;
	
	public Dungeon() {
		
	}
	
	public Dungeon(List<DungeonTile> dungeonTileList) {
		this.dungeonTileList = dungeonTileList;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<DungeonTile> getDungeonTileList() {
		return dungeonTileList;
	}

	public void setDungeonTileList(List<DungeonTile> dungeonTileList) {
		this.dungeonTileList = dungeonTileList;
	}
}
