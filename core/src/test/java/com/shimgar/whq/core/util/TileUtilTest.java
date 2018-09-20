package com.shimgar.whq.core.util;

import java.util.HashSet;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.shimgar.whq.core.model.tile.RotatedTile;
import com.shimgar.whq.core.model.tile.RotatedTileImmutable;
import com.shimgar.whq.core.model.tile.Tile;
import com.shimgar.whq.core.model.tile.TileImmutable;
import com.shimgar.whq.core.model.tile.door.Door;
import com.shimgar.whq.core.model.tile.enums.DoorOpenDirectionEnum;
import com.shimgar.whq.core.model.tile.enums.TileRotationEnum;
import com.shimgar.whq.core.model.tile.floor.Floor;

@RunWith(SpringRunner.class)
@SpringBootTest(classes=TileUtil.class)
public class TileUtilTest {
	Logger LOG = LoggerFactory.getLogger(TileUtilTest.class);
	
	@Autowired
	TileUtil tileUtil;

	private TileImmutable createSquareTile() {
		Tile tile = new Tile();
		tile.setImageUrl("image");
		
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

	private TileImmutable createCorridorTile() {
		Tile tile = new Tile();
		tile.setImageUrl("image");
		
		tile.setRotatedTiles(new HashSet<RotatedTile>() {{
			for (TileRotationEnum rotation: TileRotationEnum.values()) {
				add(new RotatedTile() {{
					setRotation(rotation);
					
					if (rotation == TileRotationEnum.R0 || rotation == TileRotationEnum.R180) {
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
	
	@Test
	public void testGetRandomTileRotation() {
	}

	@Test
	public void testGetRandomDoorOpenDirection() {
	}
}
