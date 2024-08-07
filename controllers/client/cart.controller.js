const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

const addNewPrice = require("../../helpers/addNewPrice");


// [GET] /cart
module.exports.index = async (req, res) => {
    const cart = res.locals.cart;
    const products = cart.products;
    for(let product of products) 
        product.productInfo = await Product.findOne({_id: product.productId});
    
    for(let product of products){
        product.totalPrice = product.productInfo.price * product.quantity;
        product.productInfo = addNewPrice.item(product.productInfo);
    }

    cart.totalCart = products.reduce((total, product) => total + product.totalPrice, 0);

    res.render('client/pages/cart/index', {
        title: 'Cart',  
        products: products,
    })
};

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
    try {
        const cart = await Cart.findOne({_id: req.cookies.cartId});
        const productId = req.params.productId;
        const quantity = parseInt(req.body.quantity);
        const product = cart.products.find(item => item.productId === productId);
        if(product){
            product.quantity += quantity;
            await cart.save();
        }
        else 
        {
            cart.products.push({
                productId: productId,
                quantity: quantity
            });
            await cart.save();
        }
        req.flash('success', 'Add product to cart successfully');
            res.redirect('back');
    } catch (error) {
        console.log(error);
        req.flash('error', 'Add product to cart failed');
    }
};

// [GET] /cart/update/:productId
module.exports.update = async (req, res) => {
    try {
        const cart = await Cart.findOne({_id: req.cookies.cartId});
        const productId = req.params.productId;
        const quantity = parseInt(req.query.quantity);
        const product = cart.products.find(item => item.productId === productId);
        product.quantity = quantity;
        await cart.save();
        req.flash('success', 'Update product in cart successfully');
        res.redirect('back');
    } catch (error) {
        console.log(error);
    }
};

// [GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
    try {
        const cartId = req.cookies.cartId;
        const productId = req.params.productId;

        await Cart.updateOne(
            { _id: cartId },
            { $pull: { products: { productId: productId } } }
        );
        req.flash('success', 'Delete product in cart successfully');
        res.redirect('/cart');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};