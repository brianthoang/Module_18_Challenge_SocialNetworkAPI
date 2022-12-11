const { User, Thought } = require('../models');

module.exports = {

  getUsers(req, res) {
    User.find({})
      .populate({
        path: "friends",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },

  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
    .populate({
      path: "thoughts",
      select: "-__v",
    })
    .populate({
      path: "friends",
      select: "-__v",
    })
      .select('-__v')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user can be found with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(500).json(err));
  },

  updateUser(req, res) {
    User.findOneAndUpdate({_id: req.params.userId}, {runValidators: true, new: true})
    .then((user) =>
    !user
      ? res.status(404).json({ message: 'No user can be found with that ID' })
      : res.json(user)
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  },

  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user can be found with that ID' })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: 'User and thoughts are now deleted!' }))
      .catch((err) => res.status(500).json(err));
  },

  addNewFriend(req, res) {
    User.findOneAndUpdate({_id: req.params.userId}, {$push: {friends: req.params.friendId} }, {runValidators: true, new: true})
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No friend with this id!' })
          : res.json(user)
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  deleteFriend(req, res) {
    User.findOneAndDelete(
      { _id: req.params.userId}, 
      {$pull: {friends: req.params.friendId} }, 
      {runValidators: true, new: true}
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No friend with this id!' })
          : res.json(user)
      )
      .then((user) =>
        !user
          ? res.status(404).json({
              message: 'No user with this id!',
            })
          : res.json({ message: 'friend successfully deleted!' })
      )
      .catch((err) => res.status(500).json(err));
  },
};