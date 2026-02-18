require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../../models/Product");

// const base = 'https://api-m.sandbox.paypal.com';

// decrease product quantity after a order created
const handleProductQuantity = async (cart) => {
  try {
    if (!cart || cart.length === 0) return;

    const bulkOps = cart.map((p) => {
      if (p?.isCombination) {
        return {
          updateOne: {
            filter: {
              _id: p._id,
              "variants.productId": p?.variant?.productId || "",
            },
            update: {
              $inc: {
                stock: -p.quantity,
                "variants.$.quantity": -p.quantity,
                sales: p.quantity,
              },
            },
          },
        };
      } else {
        return {
          updateOne: {
            filter: { _id: p._id },
            update: {
              $inc: {
                stock: -p.quantity,
                sales: p.quantity,
              },
            },
          },
        };
      }
    });

    if (bulkOps.length > 0) {
      await Product.bulkWrite(bulkOps);
      console.log(`[Stock] Successfully batch updated ${bulkOps.length} products`);
    }
  } catch (err) {
    console.log("err on handleProductQuantity", err.message);
  }
};

const handleProductAttribute = async (key, value, multi) => {
  try {
    // const products = await Product.find({ 'variants.1': { $exists: true } });
    const products = await Product.find({ isCombination: true });

    // console.log('products', products);

    if (multi) {
      for (const p of products) {
        await Product.updateOne(
          { _id: p._id },
          {
            $pull: {
              variants: { [key]: { $in: value } },
            },
          }
        );
      }
    } else {
      for (const p of products) {
        // console.log('p', p._id);
        await Product.updateOne(
          { _id: p._id },
          {
            $pull: {
              variants: { [key]: value },
            },
          }
        );
      }
    }
  } catch (err) {
    console.log("err, when delete product variants", err.message);
  }
};

module.exports = {
  handleProductQuantity,
  handleProductAttribute,
};
