const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ticketSchema = Schema({
    date: {
        type: String,
        required: true,
    },
    clientId: {
        type: String,
        required: true,
    },
    issue: {
        type: String,
        required: true,
    },
    issueMessage: {
        type: String,
        required: true,
    },
    status: {
        default: "pending",
        type: String
    },
    resolveMessage: {
        type: String
    }

});

module.exports = mongoose.model("Ticket", ticketSchema);