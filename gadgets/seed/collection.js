const product = require('../models/product');
var Product=require('../models/product');
var mongoose=require('mongoose');

mongoose.connect('mongodb://localhost:27017/gadgets');

var products=[
    new Product({
        imagePath:"https://ey6ff3dp8en.exactdn.com/wp-content/uploads/2021/01/Refurbished-MacBook-2015-A1466-5.jpg?strip=all&lossy=0&ssl=1",
        title:"MacBook pro",
        price:50000
    }),
    new Product({
        imagePath:"https://www.jo-cell.com/cdn/shop/products/MME73_800x_6da587dc-a02a-4aca-8903-c22080d20fe2_1024x.webp?v=1669381321",
        title:"Airpods pro",
        price:24900
    }),
    // new Product({
    //     imagePath:"https://i0.wp.com/iot.do/wp-content/uploads/sites/2/2016/07/61WzbpVKIdL._SL1500_.jpg?fit=600%2C508&ssl=1",
    //     title:"Apple SmartWatch Series 9",
    //     price:41900
    // }),
    // new Product({
    //     imagePath:"https://i0.wp.com/cellbuddy.in/buddy/wp-content/uploads/2022/09/13promax-blue-2.png?fit=800%2C800&ssl=1",
    //     title:"iPhone 13 pro max",
    //     price:130000
    // }),
    // new Product({
    //     imagePath:"https://images.indianexpress.com/2023/12/apple-ipad-pro.jpg",
    //     title:"iPad Air 11",
    //     price:60000
    // }),
    // new Product({
    //     imagePath:"https://stockopedia.pk/wp-content/uploads/2023/08/apple_magsafe_battery_pack_for_iphone_5000mah__master_clone___5000mah__20w_fast_charging1668145578.jpg",
    //     title:"Apple MagSafe Battery Pack",
    //     price:11000
    // }),
];
var done=0;

async function saveProduct(product){
    try{
        await product.save();
        done++;
        if(done==products.length){
            exit();
        }
    }
    catch(err){
        console.log(err);
    }
}

products.forEach(async (product)=>{
    await saveProduct(product);
});

function exit(){
    mongoose.disconnect();
}

mongoose.connect('mongodb://localhost:27017/gadgets',{useNewUrlParser:true,useUnifiedTopology:true}).then(
    ()=>{
        console.log("Database connected");
    }
)
.catch(err =>{
    console.log("database connection error: " + ErrorEvent);
})

module.exports=Product; 