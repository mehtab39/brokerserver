const User = require("../models/user.model");
const Holding = require("../models/holdings.model");
async function verifyRecipient(req, res, next) {
    const recipientemail = req.body.recipient.email;
    try {
        const user = await User.findOne({
            email: recipientemail
        });
        if (user) {
            req.body.recipient = {
                ...req.body.recipient,
                  clientId: user.clientId
                }
                next();
            }
        else {
        return res.status(300).send({
            status: "failed",
            message: "Recipient Don't exists"
        })

        }
    } catch (e) {
        return res.status(405).send({
            status: "failed",
            message: e
        })
    }
}

async function sufficientHoldings(req, res, next) {
    const clientId = req.body.user.clientId;
    const {
        instrument,
        quantity
    } = req.body.instrumentData;
 
  
    try {
        if(+quantity <= 0){
            return res.status(300).send({
                e: "failed",
                message: "Invalid Input"
            })
        }
        let holding = await Holding.find({
            $and: [{
                    clientId: {
                        $eq: clientId
                    }
                },
                {
                    instrument: {
                        $eq: instrument
                    }
                }
            ]
        })
        if (holding?.length && holding[0].quantity>=quantity) next();
        else {
        return res.status(300).send({
            status: "failed",
            message: "You have less or no holdings"
        })
    }
    } catch (e) {
        console.log('e:', e)
        return res.status(405).send({
            status: "failed",
            message: e
        })
    }
}

module.exports = {
    verifyRecipient,
    sufficientHoldings
}