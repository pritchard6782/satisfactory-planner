package com.shimgar.whq.core.model.tile;

import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import com.shimgar.whq.core.model.tile.door.Door;
import com.shimgar.whq.core.model.tile.enums.TileRotationEnum;
import com.shimgar.whq.core.model.tile.floor.Floor;

import lombok.Data;

@Data
@Entity
public class RotatedTile {
	@Id
	@GeneratedValue
	private int id;
	private TileRotationEnum rotation;
	@OneToOne
	private Floor floor;
	@OneToMany
	private Set<Door> doors;
}
