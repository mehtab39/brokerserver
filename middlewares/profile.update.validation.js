const Validator = require('validatorjs');
const updateRule = {
    "email": "email",
    "mobile": "min:10|max:10",
    "bankdetails": "min:10|max:20"

}
const profileUpdateValidation = (req, res, next) => {
    try {
        const data = req.body.data;
        let validation = new Validator(data, updateRule);
        if (validation.fails()) {
            return res.status(412)
                .send({
                    status: "error",
                    message: 'Validation failed'
                });
        }
       else  next()
    } catch (e) {
        res.status(500).send({
            status: "error",
            message: e
        })

    }

}
module.exports = {
    profileUpdateValidation
}