import Category from "../models/Category.js";

// Create Category with subcategories
export const addCategory = async (req, res) => {
   try {
    const category = new Category({
      name: req.body.name,
      parent: req.body.parent || null
    });
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all categories
export const getAllCategories = async(req, res) => {
try {
    const categories = await Category.find().populate("parent", "name");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 export const getCategoryById =  async(req, res) => {
    const categoryId = req.params.id;
try {
    const categories = await Category.findById(req.params.id)
      .populate({
        path: "parent",
        populate: { path: "parent" } // recursive populate
      });

    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

