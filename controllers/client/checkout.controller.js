const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");

const addNewPrice = require("../../helpers/addNewPrice");


// [GET] /checkout
module.exports.index = async (req, res) => {
    const cart = res.locals.cart;
    const products = cart.products;
    for(let product of products) {
        product.productInfo = await Product.findOne({_id: product.productId});
        product.totalPrice = product.productInfo.price * product.quantity;
        product.productInfo = addNewPrice.item(product.productInfo);
    }

    cart.totalCart = products.reduce((total, product) => total + product.totalPrice, 0).toFixed(2);

    res.render('client/pages/checkout/index', {
        title: 'Cart',  
        products: products,
    })
};

// [POST] /checkout/orders
module.exports.order = async (req, res) => {
    try {
        const cart = res.locals.cart;
        const products = cart.products;
        for(let product of products) 
            product.productInfo = await Product.findOne({_id: product.productId});
        
        for(let product of products){
            product.totalPrice = product.productInfo.price * product.quantity;
            product.productInfo = addNewPrice.item(product.productInfo);
        }
        
        const objectOrder = {
            cartId: cart._id,
            userInfo: {
                fullName: req.body.fullName,
                phone: req.body.phone,
                email: req.body.email,
                address: req.body.address,
            },
            products: products.map(product => ({
                productId: product.productId,
                price: product.productInfo.price,
                discountPercentage: product.productInfo.discountPercentage,
                quantity: product.quantity
            }))
        };
        const order = new Order(objectOrder);
        await order.save();
        req.flash('success', 'Order successfully');
        res.redirect('/checkout/success');
    } catch (error) {
        console.log(error);
        req.flash('error', 'Add product to cart failed');
    }
};
