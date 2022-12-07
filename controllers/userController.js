const User = require("../models/User");

// Bulk exporting our CRUD operations for Users and friends;

module.exports = {

  // Find all available users in our DB and populate them with their thougths and friends;

  getUsers(req, res) {
    User.find()
      .populate("thoughts")
      .populate("friends")
      .then((users) => res.status(200).json(users))
      .catch((err) => res.status(500).json(err));
  },

  // Return a single user by his/her userId;

  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(400).json({ message: "No user with that id." })
          : res.status(200).json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Create a user with our request body;

  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.status(200).json(user))
      .catch((err) => res.status(500).json(err));
  },

  // Update a user with our request body through userId;

  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(400).json({ message: "No user found with this id." })
          : res.status(200).json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Delete a user through userId;

  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId }).then(
      res.status(200).json({ message: "User Deleted" })
    );
  },

  // Add another user though user 1's id and user 2's id;

  addUserFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then(
        User.findOneAndUpdate( // Update friendlist for user 1;
          { _id: req.params.friendId },
          { $addToSet: { friends: req.params.userId } },
          { runValidators: true, new: true }
        )
      )

      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found this id." })
          : User.findOneAndUpdate( // Update friendlist for user 2;
              { _id: req.params.friendId },
              { $addToSet: { friends: req.params.userId } },
              { runValidators: true, new: true }
            ).then(res.status(200).json(user))
      )
      .catch((err) => res.status(500).json(err));
  },

  removeUserFriend(req, res) {

    // Remove friend from friendlist;  
    
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { runValidoatrs: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(400).json({ message: "No user found with this id" })
          : User.findOneAndUpdate(
              { _id: req.params.friendId },
              { $pull: { friends: req.params.userId } },
              { runValidators: true, new: true }
            ).then(res.status(200).json(user))
      )
      .catch((err) => res.status(500).json(err));
  },
};