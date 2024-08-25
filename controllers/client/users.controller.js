const User = require("../../models/user.model");

const moment = require('moment');

const usersSocket = require("../../sockets/users.socket");

// [GET] /users/user-list
module.exports.userList = async (req, res) => {
    try {
        await usersSocket(res);
        const myId = res.locals.user.id;
        const friendRequestIds = res.locals.user.friendRequest.map(request => request.userId);
        const sentInvitationIds = res.locals.user.sentInvitation.map(invitation => invitation.userId);
        const friendListIds = res.locals.user.friendList.map(friend => friend.userId);
        const excludeIds = [myId, ...friendRequestIds, ...sentInvitationIds, ...friendListIds];

        const users = await User.find({
            _id: { $nin: excludeIds },
            status: 'active',
        }).select("avatar fullName id");
        res.render('client/pages/users/user-list', {
            title: 'User List',
            users: users
        });
    } catch (error) {
        console.error('Error loading page:', error);
        res.status(500).send('Internal Server Error');
    }
};

// [GET] /users/user-list
module.exports.friendList = async (req, res) => {
    try {
        await usersSocket(res);
        const friendList = res.locals.user.friendList.map(friend => friend.userId);
        const users = await User.find({
            _id: { $in: friendList },
            status: 'active',
        }).select("-password");

        res.render('client/pages/users/friend-list', {
            title: 'Friend List',
            users: users
        });

    } catch (error) {
        console.error('Error loading page:', error);
        res.status(500).send('Internal Server Error');
    }
};

// [GET] /users/sent-invitation
module.exports.sentInvitation = async (req, res) => {
    try {
        await usersSocket(res);
        const sentInvitationsId = res.locals.user.sentInvitation.map(invitation => invitation.userId);
        const users = await User.find({
            _id: { $in: sentInvitationsId },
            status: 'active',
        }).select("-password");

        res.render('client/pages/users/sent-invitation', {
            title: 'Sent Invitation',
            users: users
        });
    }
    catch (error) {
        console.error('Error loading page:', error);
        res.status(500).send('Internal Server Error');
    }
};


// [GET] /users/friend-request
module.exports.friendRequest = async (req, res) => {
    try {
        await usersSocket(res);
        const friendRequestIds = res.locals.user.friendRequest.map(friendRequest => friendRequest.userId);
        const users = await User.find({
            _id: { $in: friendRequestIds },
            status: 'active',
        }).select("avatar fullName id");

        res.render('client/pages/users/friend-request', {
            title: 'Friend Requests',
            users: users
        });
    }
    catch (error) {
        console.error('Error loading page:', error);
        res.status(500).send('Internal Server Error');
    }
};
