package com.shimgar.whq.core.model.dungeon;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import com.shimgar.whq.core.model.tile.Tile;

import lombok.Data;

@Data
@Entity
public class DungeonTile {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;
	private int x;
	private int y;
	@ManyToOne
	private Tile tile;
}
