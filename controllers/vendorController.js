const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotEnv = require('dotenv');

dotEnv.config();
const secretKey = process.env.whatIsMyName;

const vendorRegister = async (req, res) => {

    const { username, email, password } = req.body;
    try {
        const vendorEmail = await Vendor.findOne({ email });
        if (vendorEmail) {
            return res.status(400).json("Email already Exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword
        });
        await newVendor.save();
        return res.status(201).json({ message: "Vendor Registered Successfully." });
        console.log("Vendor Registered");

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const vendorLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const vendor = await Vendor.findOne({ email });
        if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
            return res.status(401).json({ message: "Invalid Username or Password" });
        }
        const token =jwt.sign({vendorId : vendor._id}, secretKey, {expiresIn : "1h"});
        res.status(200).json({ success: "Login successful" , token });
        console.log(email , "This is Token : ", token);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getAllVendors = async(req,res) =>{
    try{
    const vendors = await Vendor.find().populate('firm');
    res.json({vendors});
    }
    catch(error){
        console.error(error);
        res.status(500).json({error : "Internal server error"});
    }
}

const getVendorById = async (req,res)=>{

    const vendorId = req.params.id;
    try {
        const vendor = await Vendor.findById(vendorId).populate('firm');
        if(!vendor){
            return res.status(401).json({error : "Vendor not found"})
        }
        res.status(200).json({vendor});
        
    } catch (error) {
        console.error(error);
        res.status(500).json({error : "Internal server error"});        
    }
}


module.exports = { vendorRegister , vendorLogin, getAllVendors,getVendorById}