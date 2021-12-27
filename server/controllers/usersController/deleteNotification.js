const User = require("../../models/user");
const Notification = require("../../models/notification");

const deleteNotification = async(req,res,next)=>{
    try{
        await Notification.findByIdAndDelete(req.body.id);
        return res.status(200).json('Notification Deleted');

    }catch(err){
        console.log('error in fetching notifications',err);
        return next(new Error("Error in Deletion of notification"));
    }

}

module.exports = deleteNotification;