package com.shimgar.whq.core.util;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.shimgar.whq.core.model.tile.RotatedTileImmutable;
import com.shimgar.whq.core.model.tile.TileImmutable;
import com.shimgar.whq.core.model.tile.door.DoorImmutable;
import com.shimgar.whq.core.model.tile.enums.DoorOpenDirectionEnum;
import com.shimgar.whq.core.model.tile.enums.TileRotationEnum;

@Component
public class TileUtil {
	
	private final Random random;
	
	public TileUtil() {
		random = new Random();
	}
	
	public TileUtil(Random random) {
		this.random = random;
	}
	
	public TileRotationEnum getRandomTileRotation() {
		return TileRotationEnum.values()[random.nextInt(TileRotationEnum.values().length)];
	}
	
	public DoorOpenDirectionEnum getRandomDoorOpenDirection() {
		return DoorOpenDirectionEnum.values()[random.nextInt(DoorOpenDirectionEnum.values().length)];
	}

	/**
	 * 
	 */
//	public RotatedTileImmutable randomlyRotateTile(TileImmutable tile, DoorOpenDirectionEnum doorOpenDirection) {
//		
//		Assert.notNull(tile, "tile is null");
//		Assert.notNull(doorOpenDirection, "doorOpenDirection is null");
//		
//		DoorOpenDirectionEnum opposite = doorOpenDirection.opposite();
//		List<RotatedTileImmutable> rotatedTiles = tile.getRotatedTiles()
//				.stream()
//				.filter(r -> r.getDoors().stream().anyMatch(d -> d.getOpenDirection() == opposite))
//				.collect(Collectors.toList());
//		
//		return rotatedTiles.get(random.nextInt(rotatedTiles.size()));
//	}

	/**
	 * 
	 */
	public List<RotatedTileImmutable> getAllowedTileRotations(TileImmutable tile, DoorOpenDirectionEnum doorOpenDirection) {
		return tile.getRotatedTiles()
				.stream()
				.filter(rt -> rt.getDoors().stream().anyMatch(d -> d.getOpenDirection() == doorOpenDirection))
				.collect(Collectors.toList());
	}
	
	/**
	 * 
	 */
	public DoorImmutable getDoorOnTileFacingSpecificDirection(RotatedTileImmutable rotatedTile, DoorOpenDirectionEnum doorOpenDirection) {
		List<DoorImmutable> possibleDoors = rotatedTile.getDoors().stream()
				.filter(d -> d.getOpenDirection() == doorOpenDirection)
				.collect(Collectors.toList());
		return possibleDoors.get(random.nextInt(possibleDoors.size()));
	}
}
