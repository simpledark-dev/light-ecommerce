const express = require("express");
const router = express.Router();
const { Product } = require("../models/");
const { imageExists, deleteImage } = require("../utility");
const { getProducts, getProductById, getSearchedProducts } = require("./commonFunctions");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
   try {
      const accessToken = req.headers["authorization"].split(" ")[1];
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN);
      next();
   } catch (e) {
      res.sendStatus(403);
   }
};

// Need to add protected middleware here
router.get("/products_admin", authMiddleware, getProducts);

// Need to add protected middleware here
router.get("/products_admin/:id", authMiddleware, getProductById);

router.post("/search_admin", authMiddleware, getSearchedProducts);

// Need to add protected middleware here
router.post("/products_admin", authMiddleware, async (req, res) => {
   // Insert product to DB
   const product = req.body;
   const newProduct = new Product(product);
   try {
      const addedProduct = await newProduct.save();
      console.log("Saved to DB successfully");
      res.status(201).json(addedProduct);
   } catch (error) {
      console.log(error);
      res.sendStatus(500);
   }
});

// Need to add protected middleware here
router.delete("/products_admin/:id", authMiddleware, async (req, res) => {
   try {
      // Remove image file
      const removedProduct = await Product.findById(req.params.id);
      const images = removedProduct.images;
      removedProduct.remove();
      res.status(200).json(removedProduct);
      console.log("Delete from DB successfully");
      if (!images.length > 0) return;
      for (const image of images) {
         deleteImage(image.path);
      }
      console.log("Images successfully deleted");
   } catch (error) {
      console.log(error);
      res.sendStatus(500);
   }
});

// Need to add protected middleware here
router.put("/products_admin/:id", authMiddleware, async (req, res) => {
   // Update product in DB
   try {
      const productFields = req.body;
      const productToUpdate = await Product.findById(req.params.id);

      if (productToUpdate) {
         // Delete old images
         for (const imageObj of productToUpdate.images) {
            if (productFields.images.some((image) => image.path === imageObj.path)) continue;
            if (!imageExists(imageObj.path)) continue;
            deleteImage(imageObj.path);
            console.log("Image deleted");
         }
         // Update all fields
         Object.entries(productFields).forEach(([key, value]) => {
            productToUpdate[key] = value;
         });
      }
      await productToUpdate.save();
      res.status(200).json(productToUpdate);
      console.log("Updated product in DB successfully");
   } catch (error) {
      console.log(error);
      res.sendStatus(500);
   }
});

module.exports = router;
