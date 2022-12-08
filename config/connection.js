const { connect, connection } = require('mongoose');

connection("mongodb://localhost/socialMediaDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = connection; 