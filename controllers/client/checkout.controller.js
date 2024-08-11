const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
const addNewPrice = require("../../helpers/addNewPrice");


// [GET] /checkout
module.exports.index = async (req, res) => {
    const cart = res.locals.cart;
    const products = cart.products;
  
    if(products.length === 0) {
        req.flash('error', 'Cart is empty');
        return res.redirect('/cart');
    }

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


        // Reset cart
        await Cart.findOneAndUpdate({_id: cart._id}, {products: []});


        req.flash('success', 'Order successfully');
        res.redirect(`/checkout/success/${order.id}`);
    } catch (error) {
        console.log(error);
        req.flash('error', 'Add product to cart failed');
    }
};

// [GET] /checkout/success
module.exports.success = async (req, res) => {
    const orderId = req.params.orderId;
    const order = await Order.findOne({_id: orderId});
    if(!order){
        req.flash("error", "Order not found");
        return res.redirect('/cart');
    }

    for(let product of order.products) {
        product.productInfo = await Product.findOne({_id: product.productId});
        product.totalPrice = product.productInfo.price * product.quantity;
        product.productInfo = addNewPrice.item(product.productInfo);
    }
    
    order.totalOrder = order.products.reduce((total, product) => total + product.totalPrice, 0).toFixed(2);


    res.render('client/pages/checkout/success', {
        title: 'Cart',  
        order: order,
    })
};
