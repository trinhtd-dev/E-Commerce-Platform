const Product = require("../models/product.model");
const paginationHelper = require("../helpers/pagination");
const searchHelper = require("../helpers/search");

class ProductService {
  /**
   * Lấy danh sách sản phẩm với bộ lọc, tìm kiếm, phân trang và sắp xếp.
   * @param {object} query - Đối tượng query từ request.
   * @returns {Promise<{products: Array, pagination: object, filterStatus: object, keyword: string}>}
   */
  static async getProducts(query) {
    const filterStatus = require("../helpers/filterStatus")(query);

    let find = {
      deleted: false,
    };
    if (query.status) {
      find.status = query.status;
    }

    const objectSearch = searchHelper(query);
    if (query.keyword) {
      find.title = objectSearch.regex;
    }

    const count = await Product.countDocuments(find);
    const objectPagination = paginationHelper(
      { currentPage: 1, limit: 5 },
      query,
      count
    );

    let sort = {};
    if (query.sorting) {
      const [sortKey, sortValue] = query.sorting.split("-");
      sort[sortKey] = sortValue;
    } else {
      sort.position = "asc";
    }

    const products = await Product.find(find)
      .sort(sort)
      .limit(objectPagination.limit)
      .skip(objectPagination.skip)
      .populate("createdBy.accountId", "fullName")
      .lean();

    // Chuyển đổi createdBy.accountId thành createdBy.accountName
    for (const product of products) {
      if (product.createdBy && product.createdBy.accountId) {
        product.createdBy.accountName = product.createdBy.accountId.fullName;
      }
    }

    return {
      products,
      pagination: objectPagination,
      filterStatus,
      keyword: objectSearch.keyword,
    };
  }

  /**
   * Thay đổi trạng thái của một sản phẩm.
   * @param {string} productId - ID của sản phẩm.
   * @param {string} status - Trạng thái mới.
   * @param {string} userId - ID của người dùng thực hiện thay đổi.
   */
  static async changeStatus(productId, status, userId) {
    const updatedBy = { accountId: userId, updatedAt: new Date() };
    await Product.updateOne(
      { _id: productId },
      { status, $push: { updatedBy } }
    );
  }

  /**
   * Thay đổi trạng thái của nhiều sản phẩm.
   * @param {string} type - Loại hành động (active, inactive, delete, change-position).
   * @param {Array<string>} ids - Mảng các ID sản phẩm.
   * @param {string} userId - ID của người dùng thực hiện.
   */
  static async changeMulti(type, ids, userId) {
    const updatedBy = { accountId: userId, updatedAt: new Date() };
    switch (type) {
      case "active":
      case "inactive":
        await Product.updateMany(
          { _id: { $in: ids } },
          { status: type, $push: { updatedBy } }
        );
        break;
      case "delete":
        await Product.updateMany(
          { _id: { $in: ids } },
          {
            deleted: true,
            deletedBy: { accountId: userId, deletedAt: new Date() },
          }
        );
        break;
      case "change-position":
        for (const item of ids) {
          const [id, position] = item.split("-");
          await Product.updateOne(
            { _id: id },
            { position: parseInt(position), $push: { updatedBy } }
          );
        }
        break;
      default:
        throw new Error("Invalid multi-action type");
    }
  }

  /**
   * Xóa mềm một sản phẩm.
   * @param {string} productId - ID của sản phẩm.
   * @param {string} userId - ID của người dùng thực hiện.
   */
  static async deleteProduct(productId, userId) {
    await Product.updateOne(
      { _id: productId },
      {
        deleted: true,
        deletedBy: { accountId: userId, deletedAt: new Date() },
      }
    );
  }

  /**
   * Chuẩn bị dữ liệu sản phẩm từ request body.
   * @param {object} body - Request body.
   * @returns {object} Dữ liệu đã được chuẩn hóa.
   */
  static #prepareProductData(body) {
    const productData = { ...body };
    productData.price = parseFloat(body.price);
    productData.stock = parseInt(body.stock);
    productData.discountPercentage = parseFloat(body.discountPercentage);
    if (body.position) {
      productData.position = parseInt(body.position);
    }
    return productData;
  }

  /**
   * Tạo một sản phẩm mới.
   * @param {object} productData - Dữ liệu sản phẩm từ request.
   * @param {string} userId - ID của người dùng tạo.
   */
  static async createProduct(productData, userId) {
    const data = this.#prepareProductData(productData);
    if (!data.position) {
      data.position = (await Product.countDocuments({})) + 1;
    }
    data.createdBy = { accountId: userId };

    const product = new Product(data);
    await product.save();
  }

  /**
   * Cập nhật một sản phẩm.
   * @param {string} productId - ID sản phẩm.
   * @param {object} productData - Dữ liệu cập nhật.
   * @param {string} userId - ID người dùng cập nhật.
   */
  static async updateProduct(productId, productData, userId) {
    const data = this.#prepareProductData(productData);
    const updatedBy = { accountId: userId, updatedAt: new Date() };

    await Product.updateOne(
      { _id: productId },
      { ...data, $push: { updatedBy } }
    );
  }
}

module.exports = ProductService;
