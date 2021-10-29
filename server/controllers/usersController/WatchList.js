const User = require("../../models/user");

const getWatchList = async (req, res, next) => {
	try {
		let user = await User.findById(req.userData.id);
	} catch (err) {
		return next(new Error("Unable to find userdata!"));
	}

	return res.status(200).json({
		message: "WatchList Data",
		data: ["chicken"], //user.watchList
	});
};

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
			message: "Already in the WatchList."
		});
	}

	user.watchList.push(coinId);
	try {
		await user.save();
	} catch (err) {
		return next(new Error("Unable to save changes!"));
	}
	
	return res.status(200).json({
		message: "Added to the WatchList."
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
			message: "Not present in the WatchList."
		});
	}

	user.watchList.pull(coinId);
	try {
		await user.save();
	} catch (err) {
		return next(new Error("Unable to save changes!"));
	}

	return res.status(200).json({
		message: "Removed from the WatchList."
	});
};

module.exports.getWatchList = getWatchList;
module.exports.addToWatchList = addToWatchList;
module.exports.removeFromWatchList = removeFromWatchList;
