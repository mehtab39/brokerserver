const User = require("../models/user.model");
const validateAmount = (req, res, next) => {
    let value = +req.body.value;
    if (typeof value == "number" && value < 5000000 && value > 0) next();
    else return res.status(300).send({
        status: "failed",
        message: "Invalid amount"
    })
}
async function validateBank(req, res, next) {
    const clientId = req.body.user.clientId;
    try{
        const user = await User.findOne({clientId: clientId});
        if(user.bankdetails) return next();
        return res.status(405).send({status: "failed",
        message:"Please update bank details"}) 

    }
    catch(err){
        return res.status(405).send({status: "failed",
        message:"User invalid"})   
    }    
}

async function sufficientMoney(req, res, next) {
    const value= +req.body.value;
    const clientId = req.body.user.clientId;
    try{
        const user = await User.findOne({clientId: clientId});
        if(user.funds-value>=0) next();
        else return res.status(300).send({status: "failed",
                       message:"Insufficient Money"})
    }
    catch(err){
        return res.status(405).send({status: "failed",
        message:"User invalid"})   
    }    
}

module.exports = {
    validateAmount,
    sufficientMoney,
    validateBank
}