var Bitcoins = {

	amount: 0,

	perSecond: 0,

	currency: "BTC",

	worth: 2,

	delta: 0,
	previousTime: 0,

	add: function(amount) {

		if(!isNaN(amount)) {

			Bitcoins.amount += amount;

			Bitcoins.updateAmount();

			return true;

		} else {

			return false;

		}

		

	},

	update: function (gameObject) {

		if(Bitcoins.previousTime!=0) {

			var currentTime = new Date().getTime();

			var delta = currentTime-Bitcoins.previousTime;

			if(delta>20) {

				Bitcoins.previousTime = currentTime;

				Bitcoins.add(Bitcoins.perSecond*(delta/1000));

			}

		} else {

			Bitcoins.previousTime = new Date().getTime();

		}

	},

	addPerSecond: function(amount) {

		if(!isNaN(amount)) {

			Bitcoins.perSecond += parseFloat(amount);

			Bitcoins.updatePerSecond();

			return true;

		} else {

			return false;

		}

	},

	sell: function() {

		Money.add(Math.round(Bitcoins.amount*Bitcoins.worth));

		Bitcoins.amount = 0;

	},

	updateAmount: function() {

		var currentBitcoins = Math.round(Bitcoins.amount*100)/100;

		ige.client.uiBitcoins.text(currentBitcoins.toFixed(2)+Bitcoins.currency);

	},

	updatePerSecond: function() {

		ige.client.uiBitcoinsPerSecond.text(Bitcoins.perSecond.toFixed(2)+Bitcoins.currency+"/s");

	}

};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Bitcoins; }