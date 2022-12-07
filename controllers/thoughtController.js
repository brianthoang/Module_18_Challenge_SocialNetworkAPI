const Thought = require("../models/Thought");
const User = require("../models/User");

module.exports = {
  getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },

  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .populate("reactions")
      .then((user) =>
        !user
          ? res.status(400).json({ message: "No Thoughts have been found" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  async createThought(req, res) {
    try {
      const data = await Thought.create(req.body);
      await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: data._id } },
        { new: true }
      );
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    ).then((thought) =>
      !thought
        ? res.status(400).json({ message: "No thought can be found with this ID." })
        : res.json(thought)
    );
  },

  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId }).then(
      res.json({ message: "Thought deleted." })
    );
  },

  getReactions(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .populate("reactions")
      .then((reactions) => res.status(200).json(reactions))
      .catch((err) => res.status(500).json(err));
  },

  createReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { new: true }
    )
      .populate("reactions")
      .then((reaction) => res.status(200).json(reaction))
      .catch((err) => res.status(500).json(err));
  },
  
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    )
      .then(res.status(200).json({ message: "Reaction deleted." }))
      .catch((err) => res.status(500).json(err));
  },
};