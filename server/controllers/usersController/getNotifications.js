const User = require("../../models/user");
const Notification = require("../../models/notification");

const getNotifications = async(req,res,next)=>{
    try{
        const notifications = await Notification.find({
            user:req.userData.id
        });
        return res.status(200).json(notifications);

    }catch(err){
        console.log('error in fetching notifications',err);
        return next(new Error("Error in fetching notifications"));
    }

}

module.exports = getNotifications;