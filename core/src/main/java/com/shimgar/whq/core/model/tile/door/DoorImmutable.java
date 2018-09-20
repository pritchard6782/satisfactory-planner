package com.shimgar.whq.core.model.tile.door;

import javax.annotation.ManagedBean;

import com.shimgar.whq.core.model.tile.enums.DoorOpenDirectionEnum;

@ManagedBean
public final class DoorImmutable {
	
	private Door door;

	public DoorImmutable(Door door) {
		this.door = door;
	}

	public int getId() {
		return door.getId();
	}

	public DoorOpenDirectionEnum getOpenDirection() {
		return door.getOpenDirection();
	}

	public int getX() {
		return door.getX();
	}

	public int getY() {
		return door.getY();
	}

	public int hashCode() {
		return door.hashCode();
	}

	public String toString() {
		return door.toString();
	}
	
	public boolean equals(Object o) {
		return door.equals(o);
	}
}
