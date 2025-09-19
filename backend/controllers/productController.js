import Product from "../models/Product.js";
import Brand from "../models/Brand.js";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

/**
 * Get all products in the database paginated.
 */
export const getAllProducts = async (req, res) => {
    try {
        
        const page = parseInt(req.query.page);// Get page number, default to 1
        const limit = parseInt(req.query.limit); // Get limit per page, default to 10

        let products;

        if (page && limit) {
            const skip = (page - 1) * limit; // Calculate documents to skip

            products = await Product.find({})
                .skip(skip)
                .limit(limit);
        } else {
            products = await Product.find({});
        }

        const totalProducts = await Product.countDocuments(); // Get total count of products

        res.json({
            products,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
            totalProducts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving products' });
    }
}

/**
 * Create a new product.
 */
export const createProduct = async (req, res) => {
    // const imagePaths = req.files.images.map(file => `uploads/${file.filename}`);
//  const images = req.files?.images || req.files; 
    let imagePaths = [];
    if (req.files && req.files.images && req.files.images.length > 0) {
        imagePaths = req.files.images.map(file => file.originalname);
    }
    const productData =  { 
        name: req.body.name, 
        desc: req.body.desc, 
        price: req.body.price,
        oldprice: req.body.oldprice,
        stock: req.body.stock, 
        category: req.body.category,
        brand: req.body.brand, 
        colors: req.body.colors, 
        size: req.body.size,
        images: imagePaths
     };
     console.log(productData);
    try {
        const newProduct = new Product(productData);
        const result = await newProduct.save();
        res.status(201).json({ message: 'Product Added Successfully', product: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating product' });
    }
}

/**
 * Get a product by its ID.
 */
export const getProductById = async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await Product.findOne({ _id: productId });
        res.json(product);
    } catch (error) {
        res.status(404).json({ message: 'Product not found' });
    }

}

/**
 * Update a product.
 */
export const updateProduct = async (req, res) => {
    let oldImages = [];
    if(req.body.oldImages && req.body.oldImages !== undefined )
        oldImages = req.body.oldImages.split(',');
    let imagePaths = [];
    if (req.files && req.files.images && req.files.images.length > 0) {
        imagePaths = req.files.images.map(file => file.originalname);        
    }
    imagePaths = [...oldImages, ...imagePaths];
    console.log("imagePaths ",imagePaths);
    let productData =  { 
        name: req.body.name, 
        desc: req.body.desc, 
        price: req.body.price,
        oldprice: req.body.oldprice,
        stock: req.body.stock,
        brand: req.body.brand, 
        colors: req.body.colors, 
        size: req.body.size,
     };
    if (imagePaths.length > 0) {
         productData.images = imagePaths;
    }
    // ✅ Update category only if not empty
    if (req.body.category && req.body.category.trim() !== "") {
      productData.category = req.body.category;
    }
     console.log(productData);

    const productId = req.params.id;
    // const updates = req.body;
    // console.log("updateProduct data",updates);
    try {
            const updatedProduct = await Product.findOneAndUpdate(
                { _id: new ObjectId(productId)  },
                { $set: productData },
                { new: true } // return updated document instead of old one
            );
            if (!updatedProduct || updatedProduct == null) {
                return res.status(404).json({ message: "Product not found" });
            }
            console.log(updatedProduct);
        res.json({ message: 'Product updated', result: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product' });
    }

}

/**
 * Delete a product.
 */
export const deleteProduct = async (req, res) => {

    const productId = req.params.id;
    try {
        // Delete product from database
        const result = await Product.deleteOne({ _id: productId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting product' });
    }

}

/**
 * Decrease Product Stock
 * @params Array of Object => [{id, quantity}]
 */

export const decreaseProductStock = async (req, res) => {
    try {
        const productsToUpdate = req.body.products;
        console.log(productsToUpdate);

        for (const product of productsToUpdate) {
            const existingProduct = await Product.findOne({ _id: product.id });

            if (!existingProduct) {
                console.log(`Product with ID ${product.id} not found.`);
                continue;
            }

            if (existingProduct.stock < product.quantity) {
                console.log(`Insufficient stock for product with ID ${product.id}.`);
                continue;
            }

            // Decrease the stock
            existingProduct.stock -= product.quantity;

            // Save the updated product
            await existingProduct.save();
            console.log(`Stock decreased for product with ID ${product.id}. New stock: ${existingProduct.stock}`);
        }

        return res.json({ success: true, message: 'Stock updated successfully' });
    } catch (error) {
        // Handle any errors
        console.error('Error decreasing product stock:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while updating stock' });
    }
}

/**
 * Get Products count by brand 
 * @result [{brand: brand-name, count: num of prods}]
 */


export const getProductCountByBrand = async (req, res) => {
    try {
        const result = await Product.aggregate([
            {
                $group: {
                    _id: "$brand",
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    brand: "$_id",
                    count: 1,
                },
            },
        ]);

        console.log('result' + result);

        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};



export const uploadProductImage = async (req, res, next)=> {
  try {
    const productId = req.body.productId;
    const images = req.files?.images || req.files; // depends on multer setup

 
    // validate id
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid or missing product id" });
    }

    // find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // update images if provided
    if (images && images.length > 0) {
      if (!product.images) product.images = [];

    //   for (let i = 0; i < images.length; i++) {
    //     const base64String = images[i].buffer.toString("base64");
    //     product.images[i] = base64String; // overwrite or push
    //   }
    
    //   imageUrl: `/uploads/${req.file.filename}`
      await product.save();
      return res.status(200).json({ message: "Image(s) uploaded successfully" });
    }

    // no images provided
    return res.status(200).json({ message: "No images uploaded" });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Failed to upload" });
  }
}


/**
 * Create a new product.
 */
export const createBrand = async (req, res) => {
    const brand =  { name: req.body.name}
    console.log(brand);
    try {
        const newBrand = new Brand(brand);
        const result = await newBrand.save();
        res.status(201).json({ message: 'Brand Added Successfully', brand: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating brand' });
    }
}

/**
 * Get a product by its ID.
 */
export const getBrands = async (req, res) => {
    try {
        const brand = await Brand.find();
        // res.json(brand);
        res.status(200).json(brand);
    } catch (error) {
        res.status(404).json({ message: 'Brand not found' });
    }
}

/**
 * Update a brand.
 */
export const updateBrand = async (req, res) => {
    console.log("hhh");
    let brand =  { name: req.body.name };
    const brandId = req.params.id;
    try {
            const updatedBrand = await Brand.findOneAndUpdate(
                { _id: new ObjectId(brandId)  },
                { $set: brand },
                { new: true } // return updated document instead of old one
            );
            if (!updatedBrand || updatedBrand == null) {
                return res.status(404).json({ message: "Brand not found" });
            }
            console.log(updatedBrand);
        res.json({ message: 'Brand updated', result: updatedBrand });
    } catch (error) {
        res.status(500).json({ message: 'Error updating brand' });
    }

}

/**
 * Delete a Brand.
 */
export const deleteBrand = async (req, res) => {
    const id = req.params.id;
    console.log('id',id);
    try {
        const result = await Brand.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        res.json({ message: 'Brand deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting brand' });
    }
}
