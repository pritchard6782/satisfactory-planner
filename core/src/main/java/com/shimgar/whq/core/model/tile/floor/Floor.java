package com.shimgar.whq.core.model.tile.floor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Data;


@Data
@Entity
public class Floor {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private int id;
	private boolean[][] floor;
}
