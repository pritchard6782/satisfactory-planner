package com.shimgar.whq.core.model.tile.floor;

import javax.annotation.ManagedBean;

@ManagedBean
public class FloorImmutable {
	
	private Floor floor;
	
	public FloorImmutable(Floor floor) {
		this.floor = floor;
	}

	public boolean equals(Object o) {
		return floor.equals(o);
	}

	public boolean[][] getFloor() {
		return floor.getFloor();
	}

	public int getId() {
		return floor.getId();
	}

	public int hashCode() {
		return floor.hashCode();
	}

	public String toString() {
		return floor.toString();
	}
}
