const User = require("../../models/user.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
// [GET] /admin/dashboard
module.exports.index = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalRevenue = 25000; // Giả sử bạn có một cách để tính tổng doanh thu

        res.render('admin/pages/dashboard/index', {
            title: 'Dashboard',
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}