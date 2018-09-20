package com.shimgar.whq.core.model.tile;

import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

import javax.annotation.ManagedBean;

@ManagedBean
public class TileImmutable {
	private Tile tile;
	private Set<RotatedTileImmutable> rotatedTiles;

	public TileImmutable(Tile tile) {
		this.tile = tile;
		this.rotatedTiles = 
				Collections.unmodifiableSet(
						tile.getRotatedTiles().stream()
							.map(rt -> new RotatedTileImmutable(rt))
							.collect(Collectors.toSet()));
	}

	public Set<RotatedTileImmutable> getRotatedTiles() {
		return rotatedTiles;
	}

	public boolean equals(Object o) {
		return tile.equals(o);
	}

	public int getId() {
		return tile.getId();
	}

	public String getImageUrl() {
		return tile.getImageUrl();
	}

	public int getNumberOfExits() {
		return tile.getNumberOfExits();
	}

	public int hashCode() {
		return tile.hashCode();
	}

	public String toString() {
		return tile.toString();
	}
}
