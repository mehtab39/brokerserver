const express = require("express");
const Ticket = require("../models/ticket.model");
const router = express.Router();

router.get("/", async function (req, res) {
    const ticket = await Ticket.find().lean().exec();
    res.send(ticket)
})
router.get("/:id", async function (req, res) {
    const clientId = req.params.id;
    try {
        const ticket = await Ticket.find({
            clientId: clientId
        })

    return res.status(200).json({
        ticket,
        status: "success",
        message: "Tickets found successfully"
    })
} catch (e) {
    res.status(500).json({
        status: "error",
        message: e
    })
}
})


router.post("/raiseticket",   async function (req, res) {
    const clientId = req.body.user.clientId;
    const issue = req.body.issue;
    const issueMessage = req.body.issueMessage;
    try {
        const payload = {
            date: new Date().toLocaleDateString("en-US"),
            clientId,
            issue,
            issueMessage
        }
        const ticket = await Ticket.create(payload);
       
       
        return res.status(200).json({
            ticket, 
            status: "success",
            message: "Ticket raised successfully"
        })
    } catch (e) {
        console.log('e:', e)
        res.status(500).json({
            status: "error",
            message: e
        })
    }
})


module.exports = router;