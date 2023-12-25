const express = require("express");
const router = express.Router();
const { userController, userEvents } = require('../controller/userController');
const authorizationJWT = require("../Middleware/authorizeJWT");

const { EventEmitter } = require('events');// modification
const userEvents = new EventEmitter();// modification

userEvents.on('ticketSolved', (userId) => {

    const userSocket = io.sockets.connected[userId];

    // Emit the event to the client
    userSocket.to(userId).emit('ticketSolved', { message: 'Ticket solved!' });
});

userEvents.on('ticketCreated', (userId) => {
    Notification.requestPermission().then(perm => {
        if (perm === "granted") {
            const notification = new Notification("Ticket Created", {
                body: `Ticket is created for user ${userId}`,
                // icon: "../logo.svg",
                tag: "ticketCreated"
            });
        }
    });
});

//TODO make reset password accessible to all users
router.put('/resetPassword', authorizationJWT(['User', 'Manager', 'Agent']), userController.resetPassword);
router.post('/create', authorizationJWT(['User']), userController.createTicket);
router.get('/get', authorizationJWT(['User']), userController.getTicket);
router.get('/getOne/:id', authorizationJWT(['User']), userController.getOneTicket);
router.put('/rate/:id', authorizationJWT(['User']), userController.rateTicket);
router.get('/profile', authorizationJWT(['User', 'Manager', 'Agent', 'Admin']), userController.getProfile);
router.put('/updateProfile', authorizationJWT(['User', 'Manager', 'Agent', 'Admin']), userController.updateProfile);
router.get('/KnowledgeBase', authorizationJWT(['User', 'Manager', 'Agent', 'Admin']), userController.getFAQ);
router.post('/postQuestion', authorizationJWT(['User']), userController.postQuestion);
router.get('/KnowledgeBase/:Category', authorizationJWT(['User', 'Manager', 'Agent', 'Admin']), userController.filterByCategory);
router.get('/KnowledgeBase/:Category/:SubCategory', authorizationJWT(['User', 'Manager', 'Agent', 'Admin']), userController.filterBySubCategory);
router.get('/workflow/:Category/:SubCategory', authorizationJWT(['User']), userController.getAutomationAndWorkflow);
router.post('/openchat/:id', authorizationJWT(['User']), userController.OpenChat);





module.exports = { router, userEvents }