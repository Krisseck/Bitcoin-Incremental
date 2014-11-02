var Placement = {

	isActive: false,

	/**
	 * Creates and returns a temporary item that can be used
	 * to indicate to the player where their item will be built.
	 * @param type
	 */
	createTemporaryItem: function (name, tilemap) {

		var cube = new IgeEntity()
			.data("name",name)
			.isometric(true) // Set the entity to position isometrically instead of in 2d space
			.size3d(blocks[name].width, blocks[name].height, blocks[name].depth)
			.category("ghost-item")
			.mount(tilemap);

		var cubeImage = new IgeEntity()
			.texture(ige.client.gameTexture[blocks[name].texture])
			.dimensionsFromCell()
			.translate().x(blocks[name].imageX).y(blocks[name].imageY)
			.mount(cube);

		cube.translateToTile(-1000,-1000,0);

		Placement.isActive = true;

		return cube;

	},

	/**
	 * Handles when the mouse over event occurs on our map (tileMap1).
	 * @param x
	 * @param y
	 * @private
	 */
	_mapOnMouseOver: function (x, y) {

		if(Placement.isActive) {
			var item = ige.client.data('ghostItem');
			if (item) {
				// We have a ghost item so move it to where the
				// mouse is!

				// Check the tile is not currently occupied!
				if (!ige.client.tileMap1.isTileOccupied(x,y)) {
					// The tile is not occupied so move to it!
					item.data('tileX', x)
						.data('tileY', y)
						.translateToTile(x, y, 0);
				}

			}
		}

	},

	/**
	 * Handles when the mouse up event occurs on our map (tileMap1).
	 * @param x
	 * @param y
	 * @private
	 */
	_mapOnMouseUp: function (x, y) {

		if(Placement.isActive) {
			if(!UiIsActive) {
				if(ige.client.data('ghostItem')) {

					var item = ige.client.data('ghostItem'),
							tempItem;

					if(Money.amount>=blocks[item.data("name")].cost) {

						if (item && item.data('tileX') !== -1000 && item.data('tileY') !== -1000) {

							if (!ige.client.tileMap1.isTileOccupied(item.data('tileX'),item.data('tileY'),blocks[item.data("name")].width/40,blocks[item.data("name")].height/40)) {
								// TODO: Use the collision map to check that the tile location is allowed for building! At the moment you can basically build anywhere and that sucks!
								// Clear out reference to the ghost item
								ige.client.data('ghostItem', false);

								// Turn the ghost item into a "real" building
								item.opacity(1)
									.occupyTile(
										item.data('tileX'),
										item.data('tileY'),
										blocks[item.data("name")].width/40,
										blocks[item.data("name")].height/40
									)
									.category("placeable");

								Money.substract(blocks[item.data("name")].cost);

								Bitcoins.addPerSecond(blocks[item.data("name")].bitcoins)

								// Now create a new temporary building
								tempItem = Placement.createTemporaryItem(item.data("name"), ige.client.tileMap1) // SkyScraper, Electricals etc
									.opacity(0.7);

								ige.client.data('ghostItem', tempItem);

							}
						}
					}
				}
			}
		}
	},

	create: function(elem, tilemap) {

		elem.backgroundColor('#999');

		var tempItem = this.createTemporaryItem(elem.data("name"), tilemap)
			.opacity(0.7);

		ige.client.data('ghostItem', tempItem);

	}

};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Placement; }