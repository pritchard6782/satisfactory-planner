package com.shimgar.whq.core.util;

import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.shimgar.whq.core.model.dungeon.Dungeon;
import com.shimgar.whq.core.model.dungeon.DungeonTile;
import com.shimgar.whq.core.model.tile.dao.TileDao;

import lombok.extern.slf4j.Slf4j;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes=DungeonGenerator.class)
@Slf4j
public class DungeonGeneratorTest {

	@Autowired
	private DungeonGenerator dungeonGenerator;
	
	@MockBean
	private TileDao tileDao;
	
	@SpyBean
	private TileUtil tileUtil;
	
	@SpyBean
	DummyDataGenerator dummyData;
	
	@Test
	public void testGenerateNewDungeon() {
		Mockito.doReturn(dummyData.createTestDeck()).when(tileDao).findAllImmutable();
		Dungeon dungeon = dungeonGenerator.generateNewDungeon();
		boolean[][] floor = dungeonGenerator.createDungeonFloor(dungeon.getDungeonTileList());
		printFloor(floor);
	}

	@Test
	public void testArrangeFloorTiles() {
		List<DungeonTile> dungeonTiles = dungeonGenerator.createDungeonTiles(dummyData.createTestDeck());
		dungeonGenerator.setDungeonTileCoordsAndRotation(dungeonTiles);
		boolean[][] floor = dungeonGenerator.createDungeonFloor(dungeonTiles);
		
		printFloor(floor);
	}
	
	private void printFloor(boolean[][] floor) {
		for (int x = 0; x < floor.length; x++) {
			for (int y = 0; y < floor[0].length; y++) {
				System.out.print(floor[x][y] ? " @" : "  ");
			}
			System.out.println("");
		}
	}
}
