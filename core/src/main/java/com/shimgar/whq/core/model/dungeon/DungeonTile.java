package com.shimgar.whq.core.model.dungeon;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import com.shimgar.whq.core.model.tile.RotatedTileImmutable;
import com.shimgar.whq.core.model.tile.TileImmutable;

import lombok.Data;

@Data
@Entity
public class DungeonTile {
	@Id
	@GeneratedValue
	private int id;
	private int x;
	private int y;
	@ManyToOne
	private TileImmutable tile;
	@ManyToOne
	private RotatedTileImmutable rotatedTile;
	@OneToOne
	private DungeonDoor entranceDoor;
	@OneToMany
	private List<DungeonDoor> exitDoors;
}
