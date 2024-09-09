const Product = require('../models/Product');
const Firm = require('../models/Firm');
const multer =  require('multer');


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


const addProduct = async (req,res) =>{

    try {
        const {productName, price,category,bestSeller,description} = req.body;
        const image = req.file?req.file.filename:undefined;
const firmId = req.params.firmId;
const firm = await Firm.findById(firmId);
if(!firm){
    return res.status(400).json({error : "No Firm Found"});
}
const product = new Product({
    productName, price,category,bestSeller,description,firm : firm._id
})
const savedProduct = await product.save();
firm.products.push(savedProduct);
await firm.save();
res.status(200).json({message : "Product added succesfully"}); 
console.log(savedProduct);

 } catch (error) {
    console.error(error);
    res.status(200).json({error : "Internal server error"}); 
        
    }
}

const getProductByFirm = async (req,res)=>{

    try {
       const firmId = req.params.firmId;
       const firm= await Firm.findById(firmId);
       if(!firm){
        return res.status(400).json({error : "Firm not found"});
       } 
      
       const restuarantName = firm.firmname;
        console.log(restuarantName);
       const products =await Product.find({firm : firmId});
       res.status(200).json({restuarantName, products});
    } catch (error) {
        console.error(error);
    res.status(200).json({error : "Internal server error"}); 
    }
}

const deleteProductById = async (req,res) => {
    try{
const productId = req.params.productId;
const  deletedProduct = await Product.findByIdAndDelete(productId);
if(deletedProduct){
    return res.status(400).json({error : "product not found"});
}

}
    catch(error){
console.error(error);
    res.status(200).json({error : "Internal server error"}); 
    }
}

module.exports = {addProduct: [upload.single('image'), addProduct] , getProductByFirm ,deleteProductById };