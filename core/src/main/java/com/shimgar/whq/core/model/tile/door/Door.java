package com.shimgar.whq.core.model.tile.door;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import com.shimgar.whq.core.model.tile.enums.DoorOpenDirectionEnum;

import lombok.Data;

@Data
@Entity
public class Door {
	@Id
	@GeneratedValue
	private int id;
	private int x;
	private int y;
	private DoorOpenDirectionEnum openDirection;
}
