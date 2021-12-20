const User = require("../../models/user");

const addToWatchList = async (req, res, next) => {
	let user;
	try {
		user = await User.findById(req.userData.id);
	} catch (err) {
		return next(new Error("Unable to find userdata!"));
	}

	let coinId = req.params.id;
	let isPresent = await user.watchList.find((element) => element == coinId);
	if (isPresent) {
		// Already present
		return res.status(200).json({
			message: coinId.toUpperCase() + " is already in the WatchList.",
		});
	}

	try {
		user.watchList.push(coinId);
		await user.save();
	} catch (err) {
		return next(new Error("Unable to save changes!"));
	}

	return res.status(200).json({
		message: coinId.toUpperCase() + " added to the WatchList.",
	});
};

const removeFromWatchList = async (req, res, next) => {
	let user;
	try {
		user = await User.findById(req.userData.id);
	} catch (err) {
		return next(new Error("Unable to find userdata!"));
	}

	let coinId = req.params.id;
	let isPresent = await user.watchList.find((element) => element == coinId);
	if (!isPresent) {
		// Already removed
		return res.status(200).json({
			message: "Not present in the WatchList.",
		});
	}

	try {
		user.watchList.pull(coinId);
		await user.save();
	} catch (err) {
		return next(new Error("Unable to save changes!"));
	}

	return res.status(200).json({
		message: "Removed from the WatchList.",
	});
};

module.exports.addToWatchList = addToWatchList;
module.exports.removeFromWatchList = removeFromWatchList;
