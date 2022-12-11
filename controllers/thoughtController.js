const { Thought, User } = require('../models');

module.exports = {
  getThoughts(req, res) {
    Thought.find({})
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought can be found with this ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => res.json(thought))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought can be found with this ID' })
          : User.deleteMany({ _id: { $in: thought.user } })
      )
      .then(() => res.json({ message: 'This users thoughts have been deleted!' }))
      .catch((err) => res.status(500).json(err));
  },
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought can be found with this ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  createReaction(req, res) {
    Thought.findOneAndUpdate(
          {_id: req.params.thoughtId},
          {$addToSet: {reactions: req.body}},
          {runValidators: true, new: true,})
      .then((thought) =>
      !thought
      ? res.status(404).json({ message: 'The application has been created, but found no user with that ID'})
      : res.json(thought))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
   deleteReaction(req, res) {
    Thought.findOneAndDelete(
      { _id: req.params.thoughtId})
      .then((thought) => {
        if (thought) {
          return res.status(404).json({ message: 'No thoughts found' });
        }
    return Thought.findOneAndUpdate(
      { _id: req.params.thoughtId},
      {$pull: {reactions: {reactionId: req.params.reactionId} }},
      {runValidators: true, new: true,}
    )
      })
    .then((thought) =>
    !thought
      ? res.status(404).json({ message: 'No reaction can be found with this id!' })
      : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
  },
};