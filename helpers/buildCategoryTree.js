// Helper function to build category tree
const buildCategoryTree = (categories, parentId = "") => {
  const categoryTree = [];

  categories.forEach((category) => {
    // Convert MongoDB document to plain JavaScript object
    const categoryObj = category.toObject
      ? category.toObject()
      : { ...category };

    // Compare parent with parentId (both should be string for empty case or ObjectId for valid parent)
    if (String(categoryObj.parent) === String(parentId)) {
      // Find children by using current category's _id as parent
      const children = buildCategoryTree(categories, categoryObj._id);

      if (children.length > 0) {
        categoryObj.children = children;
      }

      categoryTree.push(categoryObj);
    }
  });

  return categoryTree;
};

module.exports = buildCategoryTree;
