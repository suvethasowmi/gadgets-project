// var express = require('express');
// var router = express.Router();
// var Cart = require('../models/cart');
// var Product = require('../models/product');

// var csurf=require('csurf');
// const passport = require('passport');
// var LocalStrategy=require('passport-local').Strategy;
// var csrfProtection=csurf();
// router.use(csrfProtection);

// router.get('/', async (req, res, next) => {
//   try {
//     const docs = await Product.find({}).lean();  // Use .lean() to convert to plain objects
//     const productChunks = [];
//     const chunkSize = 3;
//     for (var i = 0; i < docs.length; i += chunkSize) {
//       productChunks.push(docs.slice(i, i + chunkSize));
//     }
//     console.log(productChunks);  // Log the data to inspect it
//     res.render('index', { title: 'Shopping-cart', products: productChunks });
//   } catch (err) {
//     console.error(err);
//     next(err);
//   }
// });


// router.get('/user/signup',function(req,res,next){
//   var messages=req.flash('errors');
//   res.render('user/signup',{csrfToken:req.csrfToken(),messages:messages,hasErrors:messages.length > 0})
// });

// router.post('/user/signup',passport.authenticate('local.signup',{
//   successRedirect:'/user/profile',
//   failureRedirect:'/user/signup',
//   failureFlash:true
// })
// );
// router.get('/user/profile',function(req,res,next){
//   res.render('user/profile');
// })

// module.exports = router;

var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Product = require('../models/product');
var stripe = require('stripe')('sk_test_51O687sSHirWlKuMeZtJKnEcuErld5E21ENHvJnt5aZGZnl7CitzoOYFFgikGCkTHCMGMXuZnwQg0WadnkcD00Cp000KpeFceyb');


router.get('/', async (req, res, next) => {
var successMsg=req.flash('success')[0];
 try {
const docs = await Product.find({}).lean();
 const productChunks = [];
const chunkSize = 3;
 for (let i = 0; i < docs.length; i += chunkSize) {
 productChunks.push(docs.slice(i, i + chunkSize));
 }
console.log(productChunks);
 res.render('shop/index', { title: 'shopping-cart', products: productChunks ,successMsg:successMsg,noMessages:!successMsg});
} catch (err) {
    console.error(err);
    next(err);
  }
});


router.get('/add-to-cart/:id', async (req, res, next) => {
  try {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});

    const product = await Product.findById(productId).lean();
    if (!product) {
      return res.redirect('/');
    }

 cart.add(product, product._id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// Display shopping cart
router.get('/shopping-cart', (req, res, next) => {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', { products: null });
  }
  const cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', { products: cart.generateArray(), totalPrice: cart.totatPrice });
});

// Display checkout page
router.get('/checkout', isLoggedIn, (req, res, next) => {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  const cart = new Cart(req.session.cart);
  var errorMsg=req.flash('error')[0];

  res.render('shop/checkout', { total: cart.totalPrice ,errMsg:errorMsg,noError:!errorMsg});
});

//Handle POST request for checkout (payment processing)
router.post('/checkout', isLoggedIn, (req, res, next) => {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  const cart = new Cart(req.session.cart);

  stripe.paymentIntents.create({
    amount: cart.totalPrice * 100, // amount in cents
    currency: 'inr',
    source: req.body.stripeToken, // obtained with Stripe.js on the client side
    description: 'Test Charge',
  
  }, (err, charge) => {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/checkout');
    }
    req.flash('success', 'Successfully bought products!');
    req.session.cart = null;
    res.redirect('/');
  });
});

module.exports = router;

// Middleware function to check if user is authenticated
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}