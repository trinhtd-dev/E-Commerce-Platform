const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

const addNewPrice = require("../../helpers/addNewPrice");

// [GET] /cart
module.exports.index = async (req, res) => {
  try {
    const cart = res.locals.cart;
    // Exit early if cart is empty
    if (!cart || !cart.products || cart.products.length === 0) {
      return res.render("client/pages/cart/index", {
        title: "Shopping Cart",
        products: [],
        cart: { totalCart: 0 },
        isEmpty: true,
      });
    }

    // Get all products in cart
    const products = cart.products;

    // Fetch complete product information
    for (let product of products) {
      // Get product info
      product.productInfo = await Product.findOne({
        _id: product.productId,
        deleted: false,
      });

      if (!product.productInfo) {
        continue; // Skip if product not found (might have been deleted)
      }

      // Find matching variant
      if (product.variantId) {
        product.variantInfo = product.productInfo.variants.find(
          (variant) => variant._id.toString() === product.variantId
        );
      }

      // If no specific variant or variant not found, use first variant or main product
      if (!product.variantInfo && product.productInfo.variants.length > 0) {
        product.variantInfo = product.productInfo.variants[0];
      } else if (!product.variantInfo) {
        // Use main product as fallback if no variants exist
        product.variantInfo = {
          _id: product.productInfo._id,
          price: product.productInfo.price,
          discountPercentage: product.productInfo.discountPercentage || 0,
          stock: product.productInfo.stock,
          attributes: [],
        };
      }

      // Apply any discounts to the variant price
      product.originalPrice = product.variantInfo.price;
      product.discountPercentage = product.variantInfo.discountPercentage || 0;
      product.finalPrice =
        product.originalPrice * (1 - product.discountPercentage / 100);

      // Calculate total price for this product
      product.totalPrice = product.finalPrice * product.quantity;
    }

    // Filter out invalid products
    const validProducts = products.filter((product) => product.productInfo);

    // Calculate cart totals
    const subtotal = validProducts.reduce(
      (total, product) => total + product.totalPrice,
      0
    );
    const discount = 0; // You can implement coupon/discount logic here
    const shipping = 0; // You can implement shipping calculation here
    const totalCart = subtotal - discount + shipping;

    // Enhance cart object with summary data
    cart.subtotal = parseFloat(subtotal.toFixed(2));
    cart.discount = parseFloat(discount.toFixed(2));
    cart.shipping = parseFloat(shipping.toFixed(2));
    cart.totalCart = parseFloat(totalCart.toFixed(2));
    cart.itemCount = validProducts.length;

    // Check if any product is out of stock or has insufficient quantity
    const stockWarnings = validProducts.filter(
      (product) => product.quantity > product.variantInfo.stock
    );

    res.render("client/pages/cart/index", {
      title: "Shopping Cart",
      products: validProducts,
      cart: cart,
      isEmpty: false,
      stockWarnings: stockWarnings.length > 0,
    });
  } catch (error) {
    console.error("Error loading cart:", error);
    req.flash("error", "Could not load your shopping cart. Please try again.");
    res.redirect("/");
  }
};

// [POST] /cart/add
module.exports.addPost = async (req, res) => {
  try {
    const cart = await Cart.findOne({ _id: req.cookies.cartId });
    const productId = req.body.productId;
    const variantId = req.body.variantId;
    const quantity = parseInt(req.body.quantity);

    // Validate product exists and has stock
    const product = await Product.findOne({ _id: productId, deleted: false });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Find the variant
    let variant;
    if (variantId) {
      variant = product.variants.find((v) => v._id.toString() === variantId);
    } else if (product.variants.length > 0) {
      variant = product.variants[0]; // Default to first variant if none specified
    } else {
      variant = {
        _id: product._id,
        stock: product.stock,
      };
    }

    // Check if variant exists and has stock
    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Product variant not found",
      });
    }

    if (variant.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${variant.stock} items available in stock`,
      });
    }

    // Find existing product in cart
    const cartProduct = cart.products.find(
      (item) => item.productId === productId && item.variantId === variantId
    );

    // Update or add to cart
    if (cartProduct) {
      // Check if new quantity exceeds stock
      if (cartProduct.quantity + quantity > variant.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add ${quantity} more. You already have ${cartProduct.quantity} in your cart and only ${variant.stock} are available.`,
        });
      }

      cartProduct.quantity += quantity;
    } else {
      cart.products.push({
        productId: productId,
        variantId: variantId,
        quantity: quantity,
      });
    }

    await cart.save();

    // Return updated cart info
    const cartCount = cart.products.length;
    const cartTotal = await calculateCartTotal(cart);

    res.status(200).json({
      success: true,
      cartCount: cartCount,
      cartTotal: cartTotal,
      message: "Product added to cart successfully",
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add product to cart. Please try again.",
    });
  }
};

// Helper function to calculate cart total
async function calculateCartTotal(cart) {
  let total = 0;

  for (const item of cart.products) {
    const product = await Product.findOne({ _id: item.productId });
    if (!product) continue;

    let price = product.price;
    let discount = product.discountPercentage || 0;

    // If variant exists, use its price and discount
    if (item.variantId) {
      const variant = product.variants.find(
        (v) => v._id.toString() === item.variantId
      );
      if (variant) {
        price = variant.price;
        discount = variant.discountPercentage || 0;
      }
    }

    const finalPrice = price * (1 - discount / 100);
    total += finalPrice * item.quantity;
  }

  return parseFloat(total.toFixed(2));
}

// [GET] /cart/update/:productId
module.exports.update = async (req, res) => {
  try {
    const cart = await Cart.findOne({ _id: req.cookies.cartId });
    const productId = req.params.productId;
    const variantId = req.query.variantId || "";
    const quantity = parseInt(req.query.quantity);

    if (isNaN(quantity) || quantity < 1) {
      req.flash("error", "Invalid quantity value");
      return res.redirect("/cart");
    }

    // Find the product to verify stock
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      req.flash("error", "Product not found");
      return res.redirect("/cart");
    }

    // Find the variant to check stock
    let variant;
    if (variantId) {
      variant = product.variants.find((v) => v._id.toString() === variantId);
    } else {
      variant = { stock: product.stock };
    }

    // Check if quantity exceeds stock
    if (!variant || quantity > variant.stock) {
      req.flash(
        "error",
        `Only ${variant ? variant.stock : 0} items available in stock`
      );
      return res.redirect("/cart");
    }

    // Find and update the product in cart
    const cartProduct = cart.products.find(
      (item) =>
        item.productId === productId &&
        (variantId ? item.variantId === variantId : !item.variantId)
    );

    if (cartProduct) {
      cartProduct.quantity = quantity;
      await cart.save();
      req.flash("success", "Cart updated successfully");
    } else {
      req.flash("error", "Product not found in cart");
    }

    res.redirect("/cart");
  } catch (error) {
    console.error("Error updating cart:", error);
    req.flash("error", "Failed to update cart");
    res.redirect("/cart");
  }
};

// [GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const variantId = req.query.variantId || "";

    // Find products matching productId and variantId if provided
    const updateQuery = variantId
      ? { $pull: { products: { productId: productId, variantId: variantId } } }
      : { $pull: { products: { productId: productId } } };

    await Cart.updateOne({ _id: cartId }, updateQuery);

    req.flash("success", "Product removed from cart successfully");
    res.redirect("/cart");
  } catch (error) {
    console.error("Error removing from cart:", error);
    req.flash("error", "Failed to remove product from cart");
    res.status(500).redirect("/cart");
  }
};

// [POST] /cart/pre-order
module.exports.preOrder = async (req, res) => {
  try {
    const selectedProduct = req.body;

    // Validate products and quantities
    for (const item of selectedProduct) {
      const product = await Product.findOne({ _id: item.productId });
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "One or more products not found",
        });
      }

      // Validate variant and stock
      let variant;
      if (item.variantId) {
        variant = product.variants.find(
          (v) => v._id.toString() === item.variantId
        );
      } else {
        variant = { stock: product.stock };
      }

      if (!variant || variant.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.title}`,
        });
      }
    }

    // Store selected products in session
    req.session.selectedProduct = selectedProduct;

    res.json({ success: true, selectedProduct });
  } catch (error) {
    console.error("Error processing pre-order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process your order. Please try again.",
    });
  }
};

// [POST] /cart/clear
module.exports.clear = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;

    // Update the cart to have an empty products array
    await Cart.updateOne({ _id: cartId }, { $set: { products: [] } });

    req.flash("success", "Your cart has been cleared");
    res.redirect("/cart");
  } catch (error) {
    console.error("Error clearing cart:", error);
    req.flash("error", "Failed to clear your cart");
    res.status(500).redirect("/cart");
  }
};
