var blocks = {
	model1: {
		texture: 1,
		width: 40,
		height: 40,
		depth: 40,
		uiWidth: 39,
		uiHeight: 45,
		name: "Model 1",
		description: "Lorem Ipsum Dolor sit Amet",
		cost: 300,
		imageX: 0,
		imageY: 0,
		bitcoins: 0.05
	},
	model2: {
		texture: 2,
		width: 40,
		height: 40,
		depth: 40,
		uiWidth: 39,
		uiHeight: 45,
		name: "Model 2",
		description: "Lorem Ipsum Dolor sit Amet",
		cost: 500,
		imageX: 0,
		imageY: 0,
		bitcoins: 0.1
	},
	model3: {
		texture: 3,
		width: 40,
		height: 80,
		depth: 40,
		uiWidth: 59,
		uiHeight: 55,
		name: "Model 3",
		description: "Lorem Ipsum Dolor sit Amet",
		cost: 700,
		imageX: -20,
		imageY: 10,
		bitcoins: 0.2
	}
};

var UiIsActive = false;

var Client = IgeClass.extend({
	classId: 'Client',
	init: function () {
		ige.showStats(1);

		// Load our textures
		var self = this;

		this.gameTexture = [];
		this.blocks = {};

		ige.input.debug(false);

		this.gameTexture[1] = new IgeTexture('./img/testcube.png');
		this.gameTexture[2] = new IgeTexture('./img/testcube2.png');
		this.gameTexture[3] = new IgeTexture('./img/testcube3.png');
		this.gameTexture[4] = new IgeTexture('./img/ground_tile.png');

		// Wait for our textures to load before continuing
		ige.on('texturesLoaded', function () {
			// Create the HTML canvas
			ige.createFrontBuffer(true);

			// Start the engine
			ige.start(function (success) {
				// Check if the engine started successfully
				if (success) {
					self.mainScene = new IgeScene2d()
						.backgroundPattern(self.gameTexture[4], 'repeat', true, true)
						.id('mainScene');

					// Create the main viewport
					self.vp1 = new IgeViewport()
						.id('vp1')
						.autoSize(true)
						.scene(self.mainScene)
						.drawMouse(true)
						.drawBounds(false)
						.drawBoundsData(false)
						.mount(ige);

					// Create an isometric tile map
					self.tileMap1 = new IgeTileMap2d()
						.id('tileMap1')
						.isometricMounts(true)
						.tileWidth(40)
						.tileHeight(40)
						.drawGrid(10)
						.mouseOver(Placement._mapOnMouseOver)
						.mouseUp(Placement._mapOnMouseUp)
						.mount(self.mainScene);

					Money.amount = 5000;

					self.uiScene = new IgeScene2d()
						.id('uiScene')
						.ignoreCamera(true)
						.layer(1)
						.mount(self.mainScene);

					// Create an entity
					self.uiMoney = new IgeFontEntity()
						.id('money')
						.depth(1)
						.width(100)
						.height(30)
						.colorOverlay('#ffffff')
						.nativeFont('26pt Arial')
						.nativeStroke(3)
						.nativeStrokeColor('#000')
						.textLineSpacing(0)
						.textAlignX(2)
						.text(Money.amount.toString()+Money.currency)
						.left(10)
						.top(10)
						.mount(self.uiScene);

					self.uiMoneySubstract = new IgeFontEntity()
						.width(100)
						.height(30)
						.colorOverlay('#ff0000')
						.nativeFont('26pt Arial')
						.nativeStroke(3)
						.nativeStrokeColor('#880000')
						.textLineSpacing(0)
						.textAlignX(2)
						.text("-200"+Money.currency)
						.left(0)
						.top(20)
						.mount(self.uiMoney);

					self.uiBitcoins = new IgeFontEntity()
						.id('bitcoins')
						.depth(1)
						.width(200)
						.height(30)
						.colorOverlay('#ffbb00')
						.nativeFont('26pt Arial')
						.textLineSpacing(0)
						.textAlignX(2)
						.text(Bitcoins.amount.toFixed(2)+Bitcoins.currency)
						.left(10)
						.top(100)
						.mount(self.uiScene);
					 
					self.uiBitcoins.addBehaviour('update', Bitcoins.update);

					self.uiBitcoinsPerSecond = new IgeFontEntity()
						.id('bitcoinPerHour')
						.depth(1)
						.width(200)
						.height(30)
						.colorOverlay('#ffbb00')
						.nativeFont('26pt Arial')
						.textLineSpacing(0)
						.textAlignX(2)
						.text(Bitcoins.perSecond.toFixed(2)+Bitcoins.currency+"/s")
						.left(38)
						.top(140)
						.mount(self.uiScene);

					self.uiBitcoinsSellContainer = new IgeUiEntity()
						.top(100)
						.left(270)
						.width(200)
						.height(70)
						.backgroundColor("#ccc")
						.mount(self.uiScene);

					self.uiBitcoinsSellButton = new IgeUiButton()
						.left(10)
						.top(10)
						.width(180)
						.height(50)
						.mouseOver(function () {
							if (!this._uiSelected) {
								this.backgroundColor('#aaa');
							}
							UiIsActive = true;
							ige.input.stopPropagation();
						})
						.mouseOut(function () {
							if (!this._uiSelected) {
								this.backgroundColor('#eee');
							}
							UiIsActive = false;
							ige.input.stopPropagation();
						})
						.mouseDown(function () {
							ige.input.stopPropagation();
						})
						.mouseUp(function () {
							Bitcoins.sell();
							ige.input.stopPropagation();
						})
						.backgroundColor("#eee")
						.mount(self.uiBitcoinsSellContainer);

					self.uiBitcoinsSellText = new IgeFontEntity()
						.width(180)
						.height(50)
						.colorOverlay('#ff0000')
						.nativeFont('26pt Arial')
						.textLineSpacing(0)
						.textAlignX(1)
						.text("SELL")
						.left(0)
						.top(0)
						.mount(self.uiBitcoinsSellButton);

					self.uiBlocksToggle = new IgeUiEntity()
						.right(0)
						.bottom(0)
						.width(100)
						.height(40)
						.backgroundColor("#444")
						.mount(self.uiScene);

					self.uiBlocksToggleText = new IgeFontEntity()
						.width(100)
						.height(40)
						.colorOverlay('#fff')
						.nativeFont('14pt Arial')
						.textLineSpacing(0)
						.textAlignX(1)
						.text("Machines")
						.mouseUp(function () {
							self.uiBlocks.show();
							Placement.isActive = false;
							ige.input.stopPropagation();
						})
						.mouseOver(function () {
							UiIsActive = true;
							ige.input.stopPropagation();
						})
						.mouseOut(function () {
							UiIsActive = false;
							ige.input.stopPropagation();
						})
						.mount(self.uiBlocksToggle);

					self.uiBlocks = new IgeUiEntity()
						.center(0)
						.middle(0)
						.width((Object.keys(blocks).length*230)+(10*(Object.keys(blocks).length+1)))
						.height(250)
						.backgroundColor("#444")
						.mount(self.uiScene)
						.mouseOver(function () {
							UiIsActive = true;
							ige.input.stopPropagation();
						})
						.mouseOut(function () {
							UiIsActive = false;
							ige.input.stopPropagation();
						});

					self.uiBlocks.hide();

					self.uiBlocksClose = new IgeUiEntity()
						.right(-40)
						.top(-40)
						.width(40)
						.height(40)
						.backgroundColor("#f00")
						.mouseDown(function () {
							ige.input.stopPropagation();
						})
						.mouseUp(function () {
							ige.client.uiBlocks.hide();
							Placement.isActive = true;
							UiIsActive = false;
						})
						.mouseOver(function () {
							UiIsActive = true;
							ige.input.stopPropagation();
						})
						.mouseOut(function () {
							UiIsActive = false;
							ige.input.stopPropagation();
						})
						.mount(self.uiBlocks);

					var i = 0;

					for(var key in blocks) {

						self.blocks[key] = new IgeUiRadioButton()
							.data("name",key)
							.left((10*(i+1))+(230*i))
							.top(10)
							.width(230)
							.height(230)
							// Set the radio group so the controls will receive group events
							.radioGroup('uiBlocks')
							.mouseOver(function () {
								if (!this._uiSelected) {
									this.backgroundColor('#555');
								}
								ige.input.stopPropagation();
							})
							.mouseOut(function () {
								if (!this._uiSelected) {
									this.backgroundColor('');
								}
								ige.input.stopPropagation();
							})
							.mouseDown(function () {
								ige.input.stopPropagation();
							})
							.mouseUp(function () {
								// Check if this item is already selected
								//if (!this._uiSelected) {
									// The item is NOT already selected so select it!
									this.select();
								//}
								UiIsActive = false;
								ige.input.stopPropagation();
							})
							.select(function() {
								Placement.create(this, self.tileMap1);
								ige.client.uiBlocks.hide();
								ige.input.stopPropagation();
							})
							// Define the callback when the radio button is de-selected
							.deSelect(function () {
								this.backgroundColor('');

								// If we had a temporary building, kill it
								var item = ige.client.data('ghostItem');
								if (item) {
									item.destroy();
									self.data('ghostItem', false);
								}
								
							})
							.mount(self.uiBlocks);

						self.blocks[key].image = new IgeUiEntity()
							.texture(self.gameTexture[blocks[key].texture])
							.width(blocks[key].uiWidth)
							.height(blocks[key].uiHeight)
							.top(10)
							.center(0)
							.mount(self.blocks[key]);

						self.blocks[key].name = new IgeFontEntity()
							.width(230)
							.height(50)
							.colorOverlay('#fff')
							.nativeFont('20pt Arial')
							.textAlignX(1)
							.text(blocks[key].name)
							.left(0)
							.top(80)
							.mount(self.blocks[key]);

						self.blocks[key].description = new IgeFontEntity()
							.width(230)
							.height(90)
							.colorOverlay('#000')
							.nativeFont('12pt Arial')
							.textAlignX(1)
							.text(blocks[key].description)
							.left(0)
							.top(90)
							.autoWrap(1)
							.mount(self.blocks[key]);

						self.blocks[key].bitcoins = new IgeFontEntity()
							.width(230)
							.height(50)
							.colorOverlay('#ffbb00')
							.nativeFont('12pt Arial')
							.textAlignX(1)
							.text(blocks[key].bitcoins+Bitcoins.currency+"/s")
							.left(0)
							.top(160)
							.autoWrap(1)
							.mount(self.blocks[key]);

						self.blocks[key].cost = new IgeFontEntity()
							.width(230)
							.height(50)
							.colorOverlay('#fff')
							.nativeFont('16pt Arial')
							.textAlignX(1)
							.text(blocks[key].cost+Money.currency)
							.left(0)
							.top(180)
							.autoWrap(1)
							.mount(self.blocks[key]);

						i += 1;

					}

					Saving.load();

					var savingInterval = window.setInterval(Saving.save,60*1000);

				}
			});
		});

	},

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Client; }