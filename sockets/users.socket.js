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

                    console.log('Invitation sent successfully');
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
            } catch (err) {
                console.error(err);
            }
        });
        

    });
}