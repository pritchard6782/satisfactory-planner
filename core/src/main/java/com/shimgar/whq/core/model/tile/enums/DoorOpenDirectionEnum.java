package com.shimgar.whq.core.model.tile.enums;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public enum DoorOpenDirectionEnum {
	UP, RIGHT, DOWN, LEFT;
	
	private static final Logger log = LoggerFactory.getLogger(DoorOpenDirectionEnum.class);
	
	public DoorOpenDirectionEnum opposite() {
		switch(this) {
		case DOWN:
			return DoorOpenDirectionEnum.UP;
		case LEFT:
			return DoorOpenDirectionEnum.RIGHT;
		case RIGHT:
			return DoorOpenDirectionEnum.LEFT;
		case UP:
			return DoorOpenDirectionEnum.DOWN;
		default:
			log.error("Cannot find opposite for enum " + name());
			return null;
		}
	}
}
