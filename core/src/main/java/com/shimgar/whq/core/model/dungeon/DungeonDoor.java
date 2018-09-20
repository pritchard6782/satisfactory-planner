package com.shimgar.whq.core.model.dungeon;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import com.shimgar.whq.core.model.tile.enums.DoorOpenDirectionEnum;

import lombok.Data;

@Data
@Entity
public class DungeonDoor {
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private int id;
	private boolean opened;
	private int x;
	private int y;
	private DoorOpenDirectionEnum doorOpenDirection;
	@ManyToOne
	private DungeonTile parentTile;
	@ManyToOne
	private DungeonTile childTile;
}
