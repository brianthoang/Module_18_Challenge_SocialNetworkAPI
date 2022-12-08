const router = require('express').Router();
const { create } = require('domain');
const {
    getUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser,
    addNewfriend,
    deleteFriend,
} = require('../../controllers/userController');

router.route('/').get(getUsers).post(createUser);

router.route('/:userId').get(getSingleUser).put(updateUser).delete(deleteUser);

router.route('/:userId/friends/:friendId').post(addNewfriend).delete(deleteFriend);

module.exports = router;