var Saving = {

	version: 0.01,

	save: function() {

		var save = {
			version: Saving.version
		};

		save.money = Money.amount;
		save.bitcoins = Bitcoins.amount;
		save.bitcoinsPerSecond = Bitcoins.perSecond;

		var blocks = ige.$$("placeable");

		save.blocks = [];

		for(var i = 0; i < blocks.length; i++) {

			save.blocks.push(blocks[i]._data);

		}

		localStorage.setItem("save",JSON.stringify(save));

		console.log("Saved!");

	},

	load: function() {

		var save = JSON.parse(localStorage.getItem("save"));

		if(save!=null) {

			Money.amount = save.money;
			Money.updateAmount();

			Bitcoins.amount = save.bitcoins;
			Bitcoins.updateAmount();

			Bitcoins.perSecond = save.bitcoinsPerSecond;
			Bitcoins.updatePerSecond();

			var removedBlocks = ige.$$("placeable");

			for(var i = 0; i < removedBlocks.length; i++) {

				removedBlocks[i].unMount().destroy();

			}

			for(var i = 0; i < save.blocks.length; i++) {

				var cube = new IgeEntity()
					.data("name",save.blocks[i].name)
					.data("tileX",save.blocks[i].tileX)
					.data("tileY",save.blocks[i].tileY)
					.isometric(true) // Set the entity to position isometrically instead of in 2d space
					.size3d(blocks[save.blocks[i].name].width, blocks[save.blocks[i].name].height, 40)
					.category("placeable")
					.mount(ige.client.tileMap1)
					.occupyTile(
						save.blocks[i].tileX,
						save.blocks[i].tileY,
						blocks[save.blocks[i].name].width/40,
						blocks[save.blocks[i].name].height/40
					);

				cube.translateToTile(save.blocks[i].tileX, save.blocks[i].tileY, 0)

				var cubeImage = new IgeEntity()
					.texture(ige.client.gameTexture[blocks[save.blocks[i].name].texture])
					.dimensionsFromCell()
					.translate().x(blocks[save.blocks[i].name].imageX).y(blocks[save.blocks[i].name].imageY)
					.mount(cube);

			}

		}

	}, 

	reset: function() {

		var save = {
			version: Saving.version,
			money: 5000,
			bitcoins: 0,
			bitcoinsPerSecond: 0,
			blocks: []
		};

		localStorage.setItem("save",JSON.stringify(save));

		console.log("Reset!");

	},

};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Saving; }