const User = require("../models/user.model");
const Holding = require("../models/holdings.model");
const Order = require("../models/order.model");


async function sufficientMoneyForOrder(req, res, next) {
    const clientId = req.body.user.clientId;
    const {
        price,
        quantity, 
        instrument
    } = req.body.instrumentData;
    const value = +price * +quantity
    if(value <= 0 || value == NaN || quantity<= 0 || instrument == undefined) {
        return res.status(300).send({
            e: "failed",
            message: "Invalid order"
        })
    }
    try {
        const user = await User.findOne({
            clientId: clientId
        });
        if (user.funds - value >= 0) next();
        else {
            const payload = {
                date: new Date().toLocaleDateString("en-US"),
                type: "buy",
                message: "Insufficient Money",
                status:"failed",
                instrument: instrument,
                quantity: quantity,
                clientId: clientId,
                price: +price
            }
        await Order.create(payload);
        return res.status(300).send({
            e: "failed",
            message: "Insufficient Money"
        })

        }
    } catch (e) {
        return res.status(405).send({
            status: "failed",
            message: e
        })
    }
}

async function holdingsValidation(req, res, next) {
    const clientId = req.body.user.clientId;
    const {
        instrument,
        quantity, 
        price
    } = req.body.instrumentData;
 
  
    try {
        if(+quantity <= 0 || +price <= 0){
            const payload = {
                date: new Date().toLocaleDateString("en-US"),
                type: "sell",
                message: "Invalid order",
                status:"failed",
                instrument: instrument,
                quantity: quantity,
                clientId: clientId,
                price: +price
            }
            await Order.create(payload);
            return res.status(300).send({
                e: "failed",
                message: "Invalid order"
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
        if (holding.length && holding[0].quantity>=quantity) next();
        else {
        const payload = {
            date: new Date().toLocaleDateString("en-US"),
            type: "sell",
            message: "Insufficient Holdings",
            status:"failed",
            instrument: instrument,
            quantity: quantity,
            clientId: clientId,
            price: +price
        }
        await Order.create(payload);
        return res.status(300).send({
            e: "failed",
            message: "You have less or no holdings"
        })
    }
    } catch (e) {
        return res.status(405).send({
            status: "failed",
            message: e
        })
    }
}

module.exports = {
    sufficientMoneyForOrder,
    holdingsValidation
}