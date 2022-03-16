const express = require("express");
const Order = require("../models/order.model");
const User = require("../models/user.model");
const Holding = require("../models/holdings.model");
const fs = require('fs');
const {
    Parser
} = require('json2csv');
const { sufficientMoneyForOrder, holdingsValidation} = require("../middlewares/order.validation");
const router = express.Router();
router.get("/", async function (req, res) {
    const order = await Order.find().lean().exec();
    res.send(order)
})

router.post("/buy", sufficientMoneyForOrder, async function (req, res) {
    const clientId = req.body.user.clientId;
    let availableFunds = req.body.user.funds;
    const {
        price,
        quantity,
        instrument
    } = req.body.instrumentData;
    try {
        const payload = {
            date: new Date().toLocaleDateString("en-US"),
            type: "buy",
            status:"completed",
            instrument: instrument,
            quantity: quantity,
            clientId: clientId,
            price: +price
        }
        await Order.create(payload);
        await addHoldings({...payload, availableFunds });
        let user = await User.findOne({
            clientId: clientId
        });

        return res.status(200).json({
            user,
            status: "success",
            message: "order placed successfully"
        })
    } catch (e) {
        res.status(500).json({
            status: "error",
            message: e
        })
    }
})
const addHoldings = async data => {
    const {
        date,
        type,
        instrument,
        quantity,
        clientId,
        price,
        availableFunds
    } = data

    const value = +quantity * +price;
    try {
        const payload = {
            type: type,
            date: date,
            amount: value,
            instrument: instrument,
            quantity: quantity,
            availableFunds: availableFunds - value
        }
        await User.updateOne({
            clientId: clientId
        }, {
            $push: {
                "expensesheet": payload
            },
            $inc: {
                "funds": value * -1
            }
        })
        await createHolding(data)
    } catch (e) {
        res.status(500).json({
            status: "error",
            message: e
        })

    }

}

const createHolding = async data => {
    const {
        instrument,
        quantity,
        clientId,
        price
    } = data
  

    try {
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
        if (holding.length) {
            await Holding.updateOne({
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
            }, {
                $inc: {
                    "quantity": quantity
                }
            })
        } else {
            const payload = {
                clientId: clientId,
                quantity: quantity,
                instrument: instrument,
                price: price,
            }
          holding =  await Holding.create(payload)
          console.log('holding:', holding)

        }
    } catch (e) {
        res.status(500).json({
            status: "error",
            message: e
        })
    }

}


router.post("/sell", holdingsValidation, async function (req, res) {
    const {clientId,availableFunds}  = req.body.user;
   
    const {
        price,
        quantity,
        instrument
    } = req.body.instrumentData;
    try {
        const payload = {
            date: new Date().toLocaleDateString("en-US"),
            type: "sell",
            status:"completed",
            instrument: instrument,
            quantity: quantity,
            clientId: clientId,
            price: +price
        }
        await Order.create(payload);
        await deleteHoldings({...payload, availableFunds} );
        let user = await User.findOne({
            clientId: clientId
        });

        return res.status(200).json({
            user,
            status: "success",
            message: "order placed successfully",
        })
    } catch (e) {
        res.status(500).json({
            status: "error",
            message: e
        })
    }

})

const deleteHoldings = async data => {
    const {
        date,
        type,
        instrument,
        quantity,
        clientId,
        price, 
        availableFunds
    } = data

    const value = quantity * price;
    const brockerage = 20;
    const tax = 0.01 * value;
    try {
        const payload = {
            type: type,
            date: date,
            amount: value,
            brockerage: brockerage,
            tax: tax,
            instrument: instrument,
            quantity: quantity,
            availableFunds: availableFunds + value - brockerage - tax
        }
        await User.updateOne({
            clientId: clientId
        }, {
            $push: {
                "expensesheet": payload
            },
            $inc: {
                "funds": (value - brockerage - tax)
            }
        })
        await removeHolding(data)
    } catch (e) {
        res.status(500).json({
            status: "error",
            message: e
        })

    }

}
const removeHolding = async data => {
    const {
        instrument,
        quantity,
        clientId,
    } = data
    try {
        await Holding.updateOne({
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
        const order = await Order.find({
            clientId: clientId
        })

    return res.status(200).json({
        order,
        status: "success",
        message: "order found successfully"
    })
} catch (e) {
    res.status(500).json({
        status: "error",
        message: e
    })
}
})

router.get("/ordersheet/:id", async function (req, res) {
    const clientId = req.params.id;
    try {
        const order = await Order.find({
            clientId: clientId
        })
        const data  = order;


   
        const fields = [ 'date', 'instrument', 'type', 'price', 'quantity', 'status', 'message'];

        const json2csvParser = new Parser({
            fields
        });
        const csv = json2csvParser.parse(data);
        var path = './public/csv/order' + Date.now() + '.csv';
        fs.writeFile(path, csv, function (err, data) {
            if (err) {
                throw err;
            } else {
                return res.download(path, function(err) {
                    if (err) {
                      console.log(err); 
                    }
                    fs.unlink(path, function(){
                        console.log("File was deleted") 
                    });
                  });
                
            }
        });
    } catch (e) {
        res.status(500).json({
            status: "error",
            message: e
        })
    }

    

})

module.exports = router;