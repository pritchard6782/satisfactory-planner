package com.shimgar.whq.core.util;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import javax.annotation.ManagedBean;

import com.shimgar.whq.core.model.tile.RotatedTile;
import com.shimgar.whq.core.model.tile.Tile;
import com.shimgar.whq.core.model.tile.TileImmutable;
import com.shimgar.whq.core.model.tile.door.Door;
import com.shimgar.whq.core.model.tile.enums.DoorOpenDirectionEnum;
import com.shimgar.whq.core.model.tile.enums.TileRotationEnum;
import com.shimgar.whq.core.model.tile.floor.Floor;

@ManagedBean
public class DummyDataGenerator {

	List<TileImmutable> createTestDeck() {
		List<TileImmutable> tiles = new ArrayList<>();
		for (int i = 0; i < 6; i++) {
			tiles.add(createSquareTile());
			tiles.add(createCorridorTile());
		}
		tiles.add(createCorridorTile());
		return tiles;
	}
	
	TileImmutable createSquareTile() {
		Tile tile = new Tile();
		tile.setImageUrl("image");
		tile.setNumberOfExits(2);
		
		tile.setRotatedTiles(new HashSet<RotatedTile>() {{
			for (TileRotationEnum rotation: TileRotationEnum.values()) {
				add(new RotatedTile() {{
					setRotation(rotation);
					
					setFloor(new Floor() {{
						setFloor(new boolean[][]{
								{true, true, true, true}, 
								{true, true, true, true}, 
								{true, true, true, true}, 
								{true, true, true, true}
							});
					}});
					
					setDoors(new HashSet<Door>() {{
						add(new Door() {{
							setX(1);
							setY(0);
							setOpenDirection(DoorOpenDirectionEnum.UP);
						}});
						add(new Door() {{
							setX(4);
							setY(1);
							setOpenDirection(DoorOpenDirectionEnum.RIGHT);
						}});
						add(new Door() {{
							setX(1);
							setY(4);
							setOpenDirection(DoorOpenDirectionEnum.DOWN);
						}});
						add(new Door() {{
							setX(0);
							setY(1);
							setOpenDirection(DoorOpenDirectionEnum.LEFT);
						}});
					}});
					
				}});
			}
		}});

		return new TileImmutable(tile);
	}

	TileImmutable createCorridorTile() {
		Tile tile = new Tile();
		tile.setImageUrl("image");
		tile.setNumberOfExits(1);
		
		tile.setRotatedTiles(new HashSet<RotatedTile>() {{
			for (TileRotationEnum rotation: TileRotationEnum.values()) {
				add(new RotatedTile() {{
					setRotation(rotation);
					
					if (rotation == TileRotationEnum.R0 || rotation == TileRotationEnum.R180) {
						setFloor(new Floor() {{
							setFloor(new boolean[][]{
									{true, true}, 
									{true, true}, 
									{true, true}, 
									{true, true}, 
									{true, true}, 
									{true, true}
								});
						}});
						
						setDoors(new HashSet<Door>() {{
							add(new Door() {{
								setX(0);
								setY(0);
								setOpenDirection(DoorOpenDirectionEnum.LEFT);
							}});
							add(new Door() {{
								setX(6);
								setY(0);
								setOpenDirection(DoorOpenDirectionEnum.RIGHT);
							}});
						}});
					} 
					else {
						setFloor(new Floor() {{
							setFloor(new boolean[][]{
									{true, true, true, true, true, true}, 
									{true, true, true, true, true, true}
								});
						}});
						
						setDoors(new HashSet<Door>() {{
							add(new Door() {{
								setX(0);
								setY(0);
								setOpenDirection(DoorOpenDirectionEnum.UP);
							}});
							add(new Door() {{
								setX(0);
								setY(6);
								setOpenDirection(DoorOpenDirectionEnum.DOWN);
							}});
						}});
					}
					
				}});
			}
		}});
		
		return new TileImmutable(tile);
	}

}
