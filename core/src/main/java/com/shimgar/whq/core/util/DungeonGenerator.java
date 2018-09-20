package com.shimgar.whq.core.util;

import java.awt.Point;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.shimgar.whq.core.model.dungeon.Dungeon;
import com.shimgar.whq.core.model.dungeon.DungeonDoor;
import com.shimgar.whq.core.model.dungeon.DungeonTile;
import com.shimgar.whq.core.model.tile.RotatedTileImmutable;
import com.shimgar.whq.core.model.tile.TileImmutable;
import com.shimgar.whq.core.model.tile.dao.TileDao;
import com.shimgar.whq.core.model.tile.door.DoorImmutable;
import com.shimgar.whq.core.model.tile.enums.DoorOpenDirectionEnum;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class DungeonGenerator {

	@Autowired
	private TileDao tileDao;
	@Autowired
	private TileUtil tileUtil;
	
	/**
	 * Generate a new dungeon
	 */
	public Dungeon generateNewDungeon() {
		List<DungeonTile> dungeonTiles = createDungeonTiles(createNewTileDeck());
		setDungeonTileCoordsAndRotation(dungeonTiles);
		
		Dungeon dungeon = new Dungeon();
		dungeon.setDungeonTileList(dungeonTiles);
		return dungeon;
	}

	/**
	 * Create new deck
	 */
	List<TileImmutable> createNewTileDeck() {
		List<TileImmutable> tileList = new ArrayList<>(tileDao.findAllImmutable());
		Collections.shuffle(tileList);
		return tileList;
	}
	
	/**
	 * Create dungeon tiles and dungeon doors, 
	 * set up which doors are connected to which tiles and vice versa
	 */
	List<DungeonTile> createDungeonTiles(List<TileImmutable> tiles) {
		Queue<DungeonDoor> doorQueue = new LinkedList<>();
		doorQueue.add(new DungeonDoor());
		
		List<DungeonTile> dungeonTiles = new ArrayList<>();
		
		for (TileImmutable tile: tiles) {
			if (doorQueue.isEmpty()) {
				log.error("No more doors to place tiles next to after tile " + tiles.indexOf(tile));
			}
			DungeonDoor entranceDoor = doorQueue.poll();
			
			DungeonTile dungeonTile = new DungeonTile();
			dungeonTile.setTile(tile);
			dungeonTile.setEntranceDoor(entranceDoor);
			entranceDoor.setChildTile(dungeonTile);
			
			List<DungeonDoor> exitDoors = new ArrayList<>();
			for (int i = 0; i < tile.getNumberOfExits(); i++) {
				DungeonDoor exitDoor = new DungeonDoor();
				exitDoor.setParentTile(dungeonTile);
				exitDoors.add(exitDoor);
				doorQueue.add(exitDoor);
			}
			dungeonTile.setExitDoors(exitDoors);
			dungeonTiles.add(dungeonTile);
		}
		
		// remove any leftover doors in the queue
		for (DungeonDoor door: doorQueue) {
			door.getParentTile().getExitDoors().remove(door);
		}
		
		return dungeonTiles;
	}
	
	/**
	 * @param tiles 
	 * 
	 */
	void setDungeonTileCoordsAndRotation(List<DungeonTile> dungeonTiles) {
		DungeonDoor mainEntranceDoor = dungeonTiles.get(0).getEntranceDoor();
		mainEntranceDoor.setOpened(true);
		mainEntranceDoor.setX(0);
		mainEntranceDoor.setY(0);
		mainEntranceDoor.setDoorOpenDirection(tileUtil.getRandomDoorOpenDirection());
		
		arrangeDungeonTile(mainEntranceDoor,new HashSet<>());
		refactorDungeonTileCoords(dungeonTiles);
	}

	/**
	 * 
	 */
	private boolean arrangeDungeonTile(DungeonDoor entranceDoor, Set<Point> coords) {
		DungeonTile dungeonTile = entranceDoor.getChildTile();
		DoorOpenDirectionEnum openDirection = entranceDoor.getDoorOpenDirection().opposite();
		List<RotatedTileImmutable> allowedTileRotations = tileUtil.getAllowedTileRotations(dungeonTile.getTile(), openDirection);
		
		for (RotatedTileImmutable rotatedTile: allowedTileRotations) {
			Set<Point> coordsCopy = new HashSet<>(coords);
			
			DoorImmutable entranceDoorIm = tileUtil.getDoorOnTileFacingSpecificDirection(rotatedTile, openDirection);
			int tilex = entranceDoor.getX() - entranceDoorIm.getX();
			int tiley = entranceDoor.getY() - entranceDoorIm.getY();
			boolean[][] floor = rotatedTile.getFloor().getFloor();
			boolean rotationValid = true;
			
			// add coords to coords copy, check for overlaps
			for (int x = 0; x < floor.length && !rotationValid; x++) {
				for (int y = 0; y < floor[0].length && !rotationValid; y++) {
					if (floor[x][y]) {
						Point point = new Point(tilex + x, tiley + y);
						if (coordsCopy.contains(point)) {
							rotationValid = false;
						}
						else {
							coordsCopy.add(point);
						}
					}
				}
			}
			
			// floorpiece has been placed without overlapping
			if (rotationValid) {
				List<DoorImmutable> possibleExits = rotatedTile.getDoors()
						.stream()
						.filter(d -> d != entranceDoorIm)
						.collect(Collectors.toList());
				Collections.shuffle(possibleExits);
				Iterator<DoorImmutable> exitsIterator = possibleExits.iterator();
				
				// set up exit doors and do a recursive call to place the other tiles
				for (DungeonDoor exitDoor: dungeonTile.getExitDoors()) {
					boolean success = false;
					while (exitsIterator.hasNext() && !success) {
						DoorImmutable exitDoorIm = exitsIterator.next();
						exitDoor.setX(exitDoorIm.getX() + tilex);
						exitDoor.setY(exitDoorIm.getY() + tiley);
						exitDoor.setDoorOpenDirection(exitDoorIm.getOpenDirection());
						
						// recursive call
						success = arrangeDungeonTile(exitDoor, coordsCopy);
					}
					if (!success) {
						rotationValid = false;
					}
				}
			}
			
			if (rotationValid) {
				dungeonTile.setRotatedTile(rotatedTile);
				dungeonTile.setX(tilex);
				dungeonTile.setY(tiley);
				return true;
			}
		}
		
		return false;
	}
	
	/**
	 * 
	 */
	private void refactorDungeonTileCoords(List<DungeonTile> dungeonTiles) {
		int lowestx = 9999;
		int lowesty = 9999;
		for (DungeonTile dungeonTile: dungeonTiles) {
			lowestx = Math.min(lowestx, dungeonTile.getX());
			lowesty = Math.min(lowesty, dungeonTile.getY());
		}
		for (DungeonTile dungeonTile: dungeonTiles) {
			dungeonTile.setX(dungeonTile.getX() - lowestx);
			dungeonTile.setY(dungeonTile.getY() - lowesty);
		}
	}

	/**
	 * 
	 */
	public boolean[][] createDungeonFloor(List<DungeonTile> dungeonTiles) {
		int highestx = -9999;
		int highesty = -9999;
		for (DungeonTile dungeonTile: dungeonTiles) {
			highestx = Math.max(highestx, dungeonTile.getX() + dungeonTile.getRotatedTile().getFloor().getFloor().length);
			highesty = Math.max(highesty, dungeonTile.getY() + dungeonTile.getRotatedTile().getFloor().getFloor()[0].length);
		}
		
		boolean[][] dungeonFloor = new boolean[highestx][highesty];
		for (DungeonTile dungeonTile: dungeonTiles) {
			int startx = dungeonTile.getX();
			int starty = dungeonTile.getY();
			boolean[][] roomFloor = dungeonTile.getRotatedTile().getFloor().getFloor();
			for (int x = 0; x < roomFloor.length; x++) {
				for (int y = 0; y < roomFloor[0].length; y++) {
					if (roomFloor[x][y]) {
						dungeonFloor[startx + x][starty + y] = true;
					}
				}
			}
		}
		
		return dungeonFloor;
	}
}
