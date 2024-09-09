const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');
const Express = require('express');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');  // Directory where files will be saved
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });


  const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: function (req, file, cb) {
        const fileTypes = /jpeg|jpg|png/;  // Only allow jpg and png files
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images (jpeg, jpg, png) are allowed'));
        }
    }
});


const addFirm = async (req,res) => {
try{
    const {firmname, area, category, region, offer} = req.body;
    const image = req.file?req.file.filename:undefined;
    const vendor = await Vendor.findById(req.vendorId);
    if(!vendor){
        return res.status(404).json({message : "Vendor Not Found"});
    }

    const firm = new Firm ({
        firmname, area, category, region, offer,image,vendor : vendor._id
    })

   const savedFirm = await firm.save();

   vendor.firm.push(savedFirm);
   await vendor.save();

   return res.status(201).json({ message: "Firm Registered Successfully." });
        console.log("Firm Registered");
}
catch(error){
    console.error(error);
    return res.status(500).json("Internal server error");
}

}

const deleteFirmById = async (req,res) => {
    try{
const firmId = req.params.firmId;
const  deletedFirm = await Firm.findByIdAndDelete(firmId);
if(deletedFirm){
    return res.status(400).json({error : "Firm not found"});
}
    }
catch(error){
    console.error(error);
        res.status(200).json({error : "Internal server error"}); 
        }
    }

module.exports = { addFirm: [upload.single('image'), addFirm],deleteFirmById};