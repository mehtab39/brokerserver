const express = require("express");
const fs = require('fs');
var jwt = require('jsonwebtoken');
const {
    Parser
} = require('json2csv');
require('dotenv').config()
const Holding = require("../models/holdings.model");
const User = require("../models/user.model");
const {
    signupValidation
} = require("../middlewares/signup.validation");
const {
    validateAmount,
    sufficientMoney,
    validateBank
} = require("../middlewares/fund.validation");
const { profileUpdateValidation } = require("../middlewares/profile.update.validation");

const router = express.Router();


const newToken = (user) => {
    return jwt.sign({
        user: user
    }, process.env.JsonWebToken);
}

//not a good idea will fix it later

//example body
// {
//     "email": "m@gill.com",
//     "mobile": 798555255,
//      "password":"sgyece",
//      "pancard": "QWERTY1234",
//     "yearBorn": 2000
// }

router.post('/createaccount', signupValidation, async function (req, res) {
    let user;
    try {
        user = await User.findOne({
            email: req.body.email
        }).lean().exec()
        if (user) {
            return res.status(400).json({
                status: "failed",
                message: 'email already exists'
            })
        }

        user = await User.create(req.body)
        const token = newToken(user);
        return res.cookie('token', token).json({
            status: "success",
            message: "sign up successfull",
            user
        })
    } catch (e) {
        res.status(500).send({
            status: "error",
            message: e
        })
    }
})

//example
// {
//     "password":"sgyece",
//    "clientId": "C321YTR"
// }
router.post('/login', async function (req, res) {
    try {
        let user = await User.findOne({
            clientId: req.body.clientId
        });
        if (!user) {
            return res.status(400).json({
                status: "failed",
                message: "Client Id dont exists"
            })
        }
        const match = await user.checkPassword(req.body.password);
        if (!match) {
            return res.status(400).json({
                status: "failed",
                message: "Password not correct"
            })
        }
        const token = newToken(user);
        return res.cookie('token', token).json({
            user
        })
    } catch (e) {
        res.status(500).json({
            status: "error",
            message: e
        })
    }

})
router.get('/logout', async function (req, res) {
    try {
        return res.cookie('token', "").json("successful");
    } catch (e) {
        res.status(500).json({
            status: "error",
            message: e
        })
    }
})
router.post("/addwatchlist", async function (req, res) {
    const clientId = req.body.user.clientId;
    const instrument = req.body.instrument;
    try {
        await User.updateOne({
            clientId: clientId
        }, {
            $push: {
                watchlist: instrument
            }
        })
        let user = await User.findOne({
            clientId: clientId
        });

        return res.status(200).json({
            user,
            status: "success",
            message: "added successfully"
        })
    } catch (e) {
        res.status(500).json({
            status: "error",
            message: e
        })
    }

})
router.post("/removewatchlist", async function (req, res) {
    const clientId = req.body.user.clientId;
    const instrument = req.body.instrument;
    try {
        await User.updateOne({
            clientId: clientId
        }, {
            $pull: {
                watchlist: instrument
            }
        })
        let user = await User.findOne({
            clientId: clientId
        });

        return res.status(200).json({
            user,
            status: "success",
            message: "removed successfully"
        })
    } catch (e) {
        res.status(500).json({
            status: "error",
            message: e
        })
    }

})
router.get("/", async function (req, res) {
    const users = await User.find().lean().exec();
    res.send(users)
})
router.get("/holding", async function (req, res) {
    const holding = await Holding.find().lean().exec();
    res.send(holding)
})
router.get("/holding/:id", async function (req, res) {
    const clientId = req.params.id;
    try {
        const holdings = await Holding.find({
            clientId: clientId
        })

    return res.status(200).json({
        holdings,
        status: "success",
        message: "holdings found successfully"
    })
} catch (e) {
    res.status(500).json({
        status: "error",
        message: e
    })
}
})

router.post("/addfunds", validateBank, validateAmount, async function (req, res) {
    const clientId = req.body.user.clientId;
    let availableFunds = +req.body.user.funds
    let value = +req.body.value;
    try {
        const payload = {
            date: new Date().toLocaleDateString("en-US"),
            type: "deposit",
            amount: value,
            availableFunds: availableFunds + value
        }

        await User.updateOne({
            clientId: clientId
        }, {
            $push: {
                "expensesheet": payload
            },
            $inc: {
                "funds": value
            }
        })

        let user = await User.findOne({
            clientId: clientId
        });

        return res.status(200).json({
            user,
            status: "success",
            message: "funds added successfully"
        })
    } catch (e) {
        res.status(500).json({
            status: "error",
            message: e
        })
    }

})
router.post("/withdrawlfunds", validateAmount, sufficientMoney, async function (req, res) {
    let value = +req.body.value;
    let availableFunds = +req.body.user.funds
    const clientId = req.body.user.clientId;
    try {

        const payload = {
            date: new Date().toLocaleDateString("en-US"),
            type: "withdrawl",
            amount: value,
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
        let user = await User.findOne({
            clientId: clientId
        });

        return res.status(200).json({
            user,
            status: "success",
            message: "funds withdrawl successfully"
        })
    } catch (e) {
        res.status(500).json({
            status: "error",
            message: e
        })
    }

})
router.post("/updateProfile", profileUpdateValidation, async function (req, res) {
    const data = req.body.data;
    const clientId = req.body.user.clientId;
    try {
        await User.updateOne({
            clientId: clientId
        }, {
            $set: data,
        })
        let user = await User.findOne({
            clientId: clientId
        });

        return res.status(200).json({
            user,
            status: "success",
            message: "profile updated successfully"
        })
    } catch (e) {
        res.status(500).json({
            status: "error",
            message: e
        })
    }

})



router.get("/expensesheet/:id", async function (req, res) {
    const clientId = req.params.id;
    try {
        const user = await User.findOne({
            clientId: clientId
        })

        let data = user.expensesheet;


        const fields = ['type', 'date', 'amount', 'availableFunds', 'instrument', 'quantity' , 'brockerage', 'tax'];

        const json2csvParser = new Parser({
            fields
        });
        const csv = json2csvParser.parse(data);
        var path = './public/csv/expense' + Date.now() + '.csv';
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