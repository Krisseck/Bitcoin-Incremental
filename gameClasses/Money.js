var Money = {

	amount: 0,

	currency: "$",

	add: function(amount) {

		if(!isNaN(amount)) {

			this.amount += parseFloat(amount);

			this.updateAmount();

			return true;

		} else {

			return false;

		}

		

	},

	substract: function(amount) {

		if(!isNaN(amount)) {

			this.amount -= parseFloat(amount);

			ige.client.uiMoney.text(this.amount.toString()+this.currency);

			ige.client.uiMoneySubstract.text("-"+amount+this.currency)._translate.tween().properties({y: 50}).duration(500).afterChange(function (cb) {

				if(ige.client.uiMoneySubstract.opacity()>0.04) {

					ige.client.uiMoneySubstract.opacity(ige.client.uiMoneySubstract.opacity()-0.04);

				} else {

					ige.client.uiMoneySubstract.opacity(0);

				}

				

			}).beforeTween(function (cb) {

				ige.client.uiMoneySubstract.opacity(1).top(20);

			}).afterTween(function (cb) {

				ige.client.uiMoneySubstract.opacity(0).top(20);

			}).start();

			return true;

		} else {

			return false;

		}

	},

	updateAmount: function() {

		ige.client.uiMoney.text(this.amount.toString()+this.currency);

	}

};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Money; }