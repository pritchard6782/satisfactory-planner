package com.shimgar.whq.core.model.tile;

import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

import javax.annotation.ManagedBean;

import com.shimgar.whq.core.model.tile.door.DoorImmutable;
import com.shimgar.whq.core.model.tile.enums.TileRotationEnum;
import com.shimgar.whq.core.model.tile.floor.FloorImmutable;

@ManagedBean
public class RotatedTileImmutable {
	
	private RotatedTile rotatedTile;
	private Set<DoorImmutable> doors;
	private FloorImmutable floor;
	
	public RotatedTileImmutable(RotatedTile rotatedTile) {
		this.rotatedTile = rotatedTile;
		this.floor = new FloorImmutable(rotatedTile.getFloor());
		this.doors = 
				Collections.unmodifiableSet(
						rotatedTile.getDoors()
								.stream()
								.map(d -> new DoorImmutable(d))
								.collect(Collectors.toSet()));
	}

	public int getId() {
		return rotatedTile.getId();
	}

	public TileRotationEnum getRotation() {
		return rotatedTile.getRotation();
	}
	
	public Set<DoorImmutable> getDoors() {
		return doors;
	}
	
	public FloorImmutable getFloor() {
		return floor;
	}
}
