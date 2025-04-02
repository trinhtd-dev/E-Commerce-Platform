const Product = require("../../models/product.model");
const addressService = require("../../services/address.service");

// [GET] /order
module.exports.index = async (req, res) => {
  try {
    // Initialize address service
    await addressService.initialize();

    // Kiểm tra dữ liệu session
    let data = req.session.selectedProduct || [];

    if (!data.length) {
      req.flash("error", "Không có sản phẩm nào được chọn để thanh toán");
      return res.redirect("/cart");
    }

    // Xử lý dữ liệu sản phẩm
    const selectedProducts = await Promise.all(
      data.map(async (product) => {
        try {
          // Lấy thông tin sản phẩm
          const productData = await Product.findById(product.productId);

          if (!productData) {
            return {
              ...product,
              product: null,
              variant: null,
            };
          }

          // Tìm variant
          const variant =
            productData.variants && productData.variants.length > 0
              ? productData.variants.find(
                  (v) => v._id.toString() === product.variantId
                )
              : null;

          return {
            ...product,
            product: productData,
            variant: variant,
          };
        } catch (err) {
          console.error(`Error processing product ${product.productId}:`, err);
          return {
            ...product,
            product: null,
            variant: null,
          };
        }
      })
    );

    // Kiểm tra lại xem có sản phẩm hợp lệ không
    const validProducts = selectedProducts.filter((p) => p.product);

    if (validProducts.length === 0) {
      req.flash("error", "Không tìm thấy thông tin sản phẩm hợp lệ");
      return res.redirect("/cart");
    }

    // Render với tên biến đúng (số nhiều)
    res.render("client/pages/order/index", {
      selectedProducts,
      provinces: addressService.provinces,
    });
  } catch (error) {
    console.error("Order page error:", error);
    req.flash("error", "Đã xảy ra lỗi khi xử lý đơn hàng");
    res.redirect("/cart");
  }
};
