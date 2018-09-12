package com.shimgar.whq.core.model.room;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import com.shimgar.whq.core.model.dungeon.Dungeon;

@Entity
public class Room {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;
	private String roomName;
	private Dungeon dungeon;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getRoomName() {
		return roomName;
	}

	public void setRoomName(String roomName) {
		this.roomName = roomName;
	}

	public Dungeon getDungeon() {
		return dungeon;
	}

	public void setDungeon(Dungeon dungeon) {
		this.dungeon = dungeon;
	}
}
