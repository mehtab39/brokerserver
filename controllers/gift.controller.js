const express = require("express");
const Order = require("../models/order.model");
const User = require("../models/user.model");
const Holding = require("../models/holdings.model");
const Gift = require("../models/gifts.model");
const { verifyRecipient, sufficientHoldings } = require("../middlewares/gift.validation");
const router = express.Router();
router.get("/", async function (req, res) {
    const gift = await Gift.find().lean().exec();
    res.send(gift)
})

router.post("/sendgift",  verifyRecipient, sufficientHoldings,   async function (req, res) {
    const userClientId = req.body.user.clientId;
    const recipientClientId = req.body.recipient.clientId;
    const {
        price,
        quantity,
        instrument
    } = req.body.instrumentData;
    try {
        const payload = {
            date: new Date().toLocaleDateString("en-US"),
            instrument: instrument,
            quantity: quantity,
            toClientId: recipientClientId,
            fromClientId: userClientId,
            price: +price
        }
        await Gift.create(payload);
        await handleGift(payload);
        let user = await User.findOne({
            clientId: userClientId
        });

        return res.status(200).json({
            user,
            status: "success",
            message: "Gift sent successfully"
        })
    } catch (e) {
        res.status(500).json({
            status: "error",
            message: e
        })
    }
})
const handleGift = async data => {
    const {
        date,
        instrument,
        quantity,
        fromClientId
    } = data
    try {
        const payload = {
            type: "Sent Gift",
            date: date,
            instrument: instrument,
            quantity: quantity
        }
        await User.updateOne({
            clientId: fromClientId
        }, {
            $push: {
                "expensesheet": payload
            }
        })
        await removeHoldingFromUser(data);
        await addHoldingsToRecipient(data);
    } catch (e) {
        res.status(500).json({
            status: "error",
            message: e
        })

    }

}

const addHoldingsToRecipient = async data => {
    const {
        instrument,
        quantity,
        toClientId,
        price
    } = data
  

    try {
        let holding = await Holding.find({
            $and: [{
                    clientId: {
                        $eq: toClientId,
                    }
                },
                {
                    instrument: {
                        $eq: instrument
                    }
                }
            ]
        })
        if (holding.length) {
            await Holding.updateOne({
                $and: [{
                        clientId: {
                            $eq: toClientId
                        }
                    },
                    {
                        instrument: {
                            $eq: instrument
                        }
                    }
                ]
            }, {
                $inc: {
                    "quantity": quantity
                }
            })
        } else {
            const payload = {
                clientId: toClientId,
                quantity: quantity,
                instrument: instrument,
                price: price,
            }
          holding =  await Holding.create(payload);
        }
    } catch (e) {
        res.status(500).json({
            status: "error",
            message: e
        })
    }

}




const removeHoldingFromUser = async data => {
    const {
        instrument,
        quantity,
        fromClientId,
    } = data
    try {
        await Holding.updateOne({
            $and: [{
                    clientId: {
                        $eq: fromClientId
                    }
                },
                {
                    instrument: {
                        $eq: instrument
                    }
                }
            ]
        }, {
            $inc: {
                "quantity": quantity * -1
            }
        })
        await Holding.deleteMany({
            "quantity": {
                $eq: 0
            }
        }, );
    } catch (e) {
        res.status(500).json({
            status: "error",
            message: e
        })
    }

}



router.get("/:id", async function (req, res) {
    const clientId = req.params.id;
    try {
        
        const gift = await Gift.find({
            $or: [ { toClientId: { $eq: clientId } },{ fromClientId: { $eq: clientId } } ]
        })

    return res.status(200).json({
        gift,
        status: "success",
        message: "gifts found successfully"
    })
} catch (e) {
    res.status(500).json({
        status: "error",
        message: e
    })
}
})

module.exports = router;