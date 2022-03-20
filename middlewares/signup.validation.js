const Validator = require('validatorjs');
const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId({
    dictionary: [
        '0', '1', '2', '3',
        '4', '5', '6', '7',
        '8', '9', 'A', 'B',
        'C', 'D', 'E', 'F',
    ],
    length: 5
});
const generateClientId = $ => "C" + uid().toUpperCase();

const signupRule = {
    "email": "required|email",
    "password": "required|min:6",
    "pancard": "required|min:10|max:10",
    "yearBorn": "min:1900|max:2100"

}
const signupValidation = (req, res, next) => {
    try {
        const data = req.body;
        if(req.body.yearBorn > (new Date).getFullYear() - 18 ){
            return res.status(412)
            .send({
                status: "failed",
                message: 'Minimum age required is 18'
            });
        }
        let validation = new Validator(data, signupRule);
        if (validation.fails()) {
            return res.status(412)
                .send({
                    status: "failed",
                    message: 'Validation failed'
                });
        }
        req.body = {
            ...req.body,
            "clientId": generateClientId()
        }
        next()
    } catch (e) {
        res.status(500).send({
            status: "failed",
            message: e
        })

    }

}
module.exports = {
    signupValidation
}