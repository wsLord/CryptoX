// Functions for different conversions

const amountToRupeesPaise = (amt) => {
	amt = amt.padStart(3, "0");

	return {
		Rupees: amt.slice(0, -2),
		Paise: amt.slice(-2),
	};
};

const marketPriceToRupeesPaise = (price) => {
	price = parseFloat(price).toFixed(2) * 100;
	price = price.toString();

	return {
		Rupees: price.slice(0, -2),
		Paise: price.slice(-2),
	};
};

const quantityToDecimalString = (quantity) => {
	quantity = quantity.padStart(8, "0");

	return quantity.slice(0, -7) + "." + quantity.slice(-7);
};

module.exports.amountToRupeesPaise = amountToRupeesPaise;
module.exports.marketPriceToRupeesPaise = marketPriceToRupeesPaise;
module.exports.quantityToDecimalString = quantityToDecimalString;
