const Cart = require("../../models/cart.models");


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