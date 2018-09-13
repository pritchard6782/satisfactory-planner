package com.shimgar.whq.core.model.room;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;

import com.shimgar.whq.core.model.dungeon.Dungeon;

import lombok.Data;

@Data
@Entity
public class Room {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;
	private String roomName;
	@OneToOne(cascade = {CascadeType.ALL})
	private Dungeon dungeon;
}
