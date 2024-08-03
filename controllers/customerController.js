const bcrypt = require('bcrypt');
const Customer = require('../models/customerSchema.js');
// const { createNewToken } = require('../utils/token.js'); Error
const createNewToken = require('../utils/token.js');

const customerRegister = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const customer = new Customer({
            ...req.body,
            password: hashedPass
        });

        const existingcustomerByEmail = await Customer.findOne({ email: req.body.email });

        if (existingcustomerByEmail) {
            res.send({ message: 'Email already exists' });
        }
        else {
            // let result = await customer.save(); Error
            let result = await Customer.create(customer);
            result.password = undefined;
            
            const token = createNewToken(result._id)

            result = {
                ...result._doc,
                token: token
            };

            // res.send(result);
            return res.status(201).json({ status: 'success', message: 'Customer registered successfully', data: result }); // Should use 201 status code creating a Customer Registeration
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const customerLogIn = async (req, res) => {
    if (req.body.email && req.body.password) {
        let customer = await Customer.findOne({ email: req.body.email });
        // if (!customer) Error
          if (customer) {
            const validated = await bcrypt.compare(req.body.password, customer.password);
            // if (!validated) Error
                if (validated){
                customer.password = undefined;

                const token = createNewToken(customer._id)

                customer = {
                    ...customer._doc,
                    token: token
                };

                res.send(customer);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "User not found" });
        }
    } else {
        res.send({ message: "Email and password are required" });
    }
};

const getCartDetail = async (req, res) => {
    try {
        let customer = await Customer.findBy(req.params.id)
        if (customer) {

            //     res.get(customer.cartDetails);
        // }
        // else {
        //     res.send({ message: "No customer found" });

            return res.status(200).json({ status: 'success', message: 'Cart details fetched successfully', data: customer.cartDetails }); // Corrected method name to json instead of get
        } else {
            return res.status(404).json({ status: 'fail', message: 'No customer found', data: null }); // Use 404 status code for not found
        
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const cartUpdate = async (req, res) => {
    try {

        let customer = await Customer.findByIdAndUpdate(req.params.id, req.body,
        //     { new: false })

        // return res.send(customer.cartDetails);

        { new: true})
        if (customer) { // **Check if customer exists**
            return res.status(200).json({ status: 'success', message: 'Cart updated successfully', data: customer.cartDetails }); // Use 200 status code for successful update
        } else {
            return res.status(404).json({ status: 'fail', message: 'No customer found', data: null }); // Use 404 status code for not found
        }

    } catch (err) {
        // res.status(500).json(err);
        return res.status(500).json({ status: 'error', message: 'Internal server error', error: err.message }); // Did proper error handling with error message
    }
}

module.exports = {
    customerRegister,
    customerLogIn,
    getCartDetail,
    cartUpdate,
};
