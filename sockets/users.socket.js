const User = require("../models/user.model");
const moment = require('moment');

// Function to handle client send data
module.exports = async (res) => {
    _io.once('connection', (socket) => {
        const myId = res.locals.user.id;
     // Send Invitation
        socket.on("CLIENT_ADD_FRIEND", async (userId) => {
                try {
                    await User.updateOne(
                        { _id: myId },
                        { $addToSet: { sentInvitation:{
                            userId: userId,
                        }}}
                    );

                    await User.updateOne({
                        _id: userId
                    },{
                        $addToSet: {
                            friendRequest:{
                                userId: myId,
                            }
                        }
                    });
                    const user = await User.findOne({_id: myId})
                    .select("avatar fullName id");
                    socket.broadcast.emit("SERVER_ADD_FRIEND", user, userId);
                    const userB = await User.findOne({_id: userId}).select("id friendRequest");
                    socket.broadcast.emit("SERVER_UPDATE_LENGTH_FRIEND_REQUEST", userB);
                } catch (err) {
                    console.error('Error sending invitation:', err);
                }
        });

    // Cancel Request
        socket.on("CLIENT_CANCEL_REQUEST", async (userId) => {
                try {
                    await User.updateOne({
                        _id: myId
                    },{
                        $pull: {
                                sentInvitation:{
                                    userId: userId,
                            }
                        }
                    });
                    await User.updateOne({
                        _id: userId
                    },{
                        $pull: {
                            friendRequest:{
                                userId: myId,
                            }
                        }
                    });
                    
                    const user = await User.findOne({_id: myId});
                    socket.broadcast.emit("SERVER_CANCEL_REQUEST", user, userId);
                    const userB = await User.findOne({_id: userId}).select("id friendRequest");
                    socket.broadcast.emit("SERVER_UPDATE_LENGTH_FRIEND_REQUEST", userB);
                } catch (err) {
                    console.error('Error Cancel Request:', err);
                }
        });

    // Accept Request
        socket.on("CLIENT_ACCEPT_REQUEST", async (userId) => {
            try {
                await User.updateOne(
                    { 
                        _id: myId 
                    },
                    
                    {
                        $addToSet:{
                            friendList:{
                            userId: userId,
                            }
                        },

                        $pull:{
                            friendRequest:{
                                userId: userId,
                            }
                        }
                
                    }
                );

                await User.updateOne(
                    {
                        _id: userId
                    },

                    {
                        $addToSet: {
                            friendList:{
                                userId: myId,
                            }
                        },
                        $pull: {
                            sentInvitation:{
                                userId: myId,
                            }
                        }
                    }
                );

                const user = await User.findOne({_id: myId}).select("id avatar fullName friendRequest");
                socket.broadcast.emit("SERVER_ACCEPT_REQUEST", user, userId);


            } catch (err) {
                console.error(err);
            }
        });

    // Delete Request
        socket.on("CLIENT_DELETE_REQUEST", async (userId) => {
            try {
                await User.updateOne(
                    {
                        _id: myId
                    },
                    {
                        $pull:{
                            friendRequest:{
                                userId: userId,
                            }
                        }
                    }
                );

                await User.updateOne(
                    {
                        _id: userId
                    },
                    {
                        $pull:{
                            sentInvitation:{
                                userId: myId,
                            }
                        }
                    }
                );
                
                const user = await User.findOne({_id: myId}).select("id avatar fullName friendRequest");
                socket.broadcast.emit("SERVER_DELETE_REQUEST", user, userId);
                } catch (err) {
                console.error(err);
            }
        });
    
    // Unfriend
        socket.on("CLIENT_UNFRIEND", async (userId) => {
            try {
                await User.updateOne(
                    {
                        _id: myId
                    },
                    {
                        $pull:{
                            friendList:{
                                userId: userId,
                            }
                        }
                    }
                );
                
                await User.updateOne(
                    {
                        _id: userId
                    },
                    {
                        $pull:{
                            friendList:{
                                userId: myId,
                            }
                        }
                    }
                );
                
                const user = await User.findOne({_id: myId});
                socket.broadcast.emit("SERVER_UNFRIEND", user, userId);
            } catch (err) {
                console.error(err);
            };

        });

    });
}