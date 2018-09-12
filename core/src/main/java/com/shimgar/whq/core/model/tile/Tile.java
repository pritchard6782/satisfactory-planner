package com.shimgar.whq.core.model.tile;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Tile {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private int id;
	private String imageUrl;
	private boolean[][] floor;
	private boolean[][] walls;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public boolean[][] getFloor() {
		return floor;
	}

	public void setFloor(boolean[][] floor) {
		this.floor = floor;
	}

	public boolean[][] getWalls() {
		return walls;
	}

	public void setWalls(boolean[][] walls) {
		this.walls = walls;
	}
}
