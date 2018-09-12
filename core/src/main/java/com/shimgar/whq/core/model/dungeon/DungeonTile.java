package com.shimgar.whq.core.model.dungeon;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import com.shimgar.whq.core.model.tile.Tile;

@Entity
public class DungeonTile {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;
	private int x;
	private int y;
	@ManyToOne
	private Tile tile;
	
	public DungeonTile() {
		
	}
	
	public DungeonTile(Tile tile) {
		this.tile = tile;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Tile getTile() {
		return tile;
	}

	public void setTile(Tile tile) {
		this.tile = tile;
	}

	public int getX() {
		return x;
	}

	public void setX(int x) {
		this.x = x;
	}

	public int getY() {
		return y;
	}

	public void setY(int y) {
		this.y = y;
	}
}
