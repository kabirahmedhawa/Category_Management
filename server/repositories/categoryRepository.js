const { default: mongoose } = require("mongoose");
const Category = require("../models/Category");

const populateChildren = async (category) => {
  const children = await Category.find({ parent: category._id });
  const childrenWithSub = await Promise.all(children.map(populateChildren));
  return {
    _id: category._id,
    name: category.name,
    isDisabled: category.isDisabled,
    parent: category.parent,
    children: childrenWithSub,
  };
};

const getCategoriesWithChildren = async () => {
  const topCategories = await Category.find({ parent: null });
  const result = await Promise.all(topCategories.map(populateChildren));
  return result;
};

const getAllCategories = async () => {
  try {
    const allCategories = await Category.find({});
    return allCategories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Could not fetch categories");
  }
};

// Create a new category
const createCategory = async (name, parentId) => {
  const category = new Category({ name, parent: parentId });
  if (parentId) {
    // Add category to the parent's children array
    await Category.findByIdAndUpdate(parentId, {
      $push: { children: category._id },
    });
  }
  return await category.save();
};

// Update a category
const updateCategory = async (categoryId, name, isDisabled) => {
  return await Category.findByIdAndUpdate(
    categoryId,
    {
      name,
      isDisabled,
    },
    { new: true }
  );
};

// Delete a category and reassign its children
const deleteCategory = async (categoryId) => {
  const category = await Category.findById(categoryId).populate("children");

  if (category.isDisabled) {
    throw new Error("Cannot delete a disabled category");
  }

  const parentCategory = category.parent;

  // If the category has children, we need to reassign them to the parent
  if (category.children.length > 0) {
    const parent = parentCategory
      ? await Category.findById(parentCategory)
      : null;
    const newParent = parent || (await Category.findOne({ parent: null })); // Find the next parent if no parent exists
    await Category.updateMany(
      { _id: { $in: category.children } },
      { $set: { parent: newParent._id } }
    );
  }

  // Remove the category from its parent's children array
  await Category.updateOne(
    { _id: parentCategory },
    { $pull: { children: categoryId } }
  );

  return await Category.findByIdAndDelete(categoryId);
};

// Disable a category and its children
const disableCategoryAndChildren = async (categoryId) => {
  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new Error("Invalid category ID");
  }

  // Find the category
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new Error("Category not found");
  }

  // Collect all category IDs to disable (parent + descendants)
  let categoryIdsToDisable = [category._id, category?.children];

  // Recursive function to collect child IDs
  const collectChildIds = async (catIds) => {
    let collectedData = [...catIds];
    for (const child of catIds) {
      const childrenData = await Category.findById(child);
      if (childrenData?.children?.length > 0) {
        collectedData = [
          ...collectedData,
          collectChildIds(childrenData?.children),
        ];
      }
    }
    return collectedData;
  };

  // Start collecting children from the main category
  if (category?.children?.length > 0)
    categoryIdsToDisable = [
      ...categoryIdsToDisable,
      ...(await collectChildIds(category?.children)),
    ];

  // Bulk update to disable all collected categories
  const result = await Category.updateMany(
    { _id: { $in: categoryIdsToDisable } },
    { $set: { isDisabled: !category?.isDisabled } }
  );

  // Optional: Log the number of updated documents for debugging
  console.log(`Disabled ${result.modifiedCount} categories`);

  return category;
};

const getSingleCategory = async (categoryId) => {
  try {
    return await Category.findById(categoryId).populate("children");
  } catch (error) {
    throw new Error("Failed to fetch category");
  }
};

module.exports = {
  getCategoriesWithChildren,
  createCategory,
  updateCategory,
  deleteCategory,
  disableCategoryAndChildren,
  getAllCategories,
  getSingleCategory,
};
