let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let mysql = require("mysql");
const cors = require("cors");
const models = require("./models/index");
const Sequelize = require("sequelize");
const crypto_orderModel = require("./models/crypto_order.model");
const Op = Sequelize.Op;

// use models
const Products = models.products;
const Stocks = models.stocks;
const CryptoOrders = models.cryptoOrders;
const Customers = models.customers;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// retrieve all products
app.get("/products", async (req, res) => {
  const productData = await Products.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message || "Some error occurred while retrieving product.",
      });
    });

  if (!productData) {
    return res.send({
      error: true,
      message: "no products.",
      written_by: "Mos Kittanat",
    });
  }

  return res.send({
    error: false,
    message: "retrieve all of products",
    written_by: "Mos Kittanat",
  });
});

// retrieve all customer
app.get("/customers", async (req, res) => {
  const customerData = await Customers.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      return res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving customer.",
      });
    });

  if (!customerData) {
    return res.send({
      error: true,
      message: "no customer.",
      written_by: "Mos Kittanat",
    });
  }

  return res.send({
    error: false,
    message: "retrieve all of customers",
    written_by: "Mos Kittanat",
  });
});

// retrieve all stock
app.get("/stocks", async (req, res) => {
  Stocks.belongsTo(Products, { foreignKey: "product_id" });
  const stockData = await Stocks.findAll({
    include: [
      {
        model: Products,
        required: true,
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message || "Some error occurred while retrieving stock.",
      });
    });

  if (!stockData) {
    return res.send({
      error: true,
      message: "no product in stock.",
      written_by: "Mos Kittanat",
    });
  }

  return res.send({
    error: false,
    message: "retrieve all of stock",
    written_by: "Mos Kittanat",
  });
});

// get stock by id
app.get("/stock/:productId", async (req, res) => {
  let productId = req.params.productId;

  const stockData = await Stocks.findOne({
    where: {
      product_id: productId,
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      return res.status(500).send({
        error: true,
        message: err.message || "Some error occurred while retrieving stock.",
      });
    });

  if (!stockData) {
    return res.status(400).send({
      error: true,
      message: "no product in stock.",
      written_by: "Mos Kittanat",
    });
  }

  return res.send({
    error: false,
    message: "retrieve all of stock",
    written_by: "Mos Kittanat",
  });
});

// add stock by id
app.post("/stock/add/:productId", async (req, res) => {
  let productId = req.params.productId;
  let stockCount = req.body.stock;

  if (!productId || !stockCount) {
    return res.status(400).send({
      error: true,
      message: "Please provide amount of product id and stock of amount.",
    });
  }

  const blance = await Stocks.findOne({
    where: {
      product_id: productId,
    },
  })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message || "Some error occurred while retrieving stock.",
      });
    });

  if (!blance) {
    return res.status(400).send({
      error: true,
      message: "product not found",
      written_by: "Mos Kittanat",
    });
  }

  const totalStock = parseInt(stockCount) + blance.stock_count;
  const stockData = await Stocks.update(
    {
      stock_count: totalStock,
    },
    {
      where: {
        product_id: productId,
      },
    }
  )
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return res.status(500).send({
        error: true,
        message: err.message || "Some error occurred while retrieving stock.",
      });
    });

  if (!stockData) {
    return res.status(400).send({
      error: true,
      message: "product not found",
      written_by: "Mos Kittanat",
    });
  }

  return res.send({
    error: false,
    message: "Update stock successfully",
    written_by: "Mos Kittanat",
  });
});

// create order
app.post("/order/new", async (req, res) => {
  let customerId = req.body.customer;
  let productId = req.body.product;
  let amount = req.body.amount;

  const blance = await Stocks.findOne({
    where: {
      product_id: productId,
      stock_count: {
        [Op.gte]: amount,
      },
    },
  })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message || "Some error occurred while retrieving stock.",
      });
    });

  if (!blance) {
    return res.send({
      error: true,
      message: "Out of stock",
    });
  }

  const total = blance.stock_count - amount;
  const updateStatus = await Stocks.update(
    {
      stock_count: total,
    },
    {
      where: {
        product_id: productId,
        stock_count: {
          [Op.gte]: amount,
        },
      },
    }
  )
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message || "Some error occurred while retrieving stock.",
      });
    });

  if (!updateStatus) {
    return res.send({
      error: true,
      message: "Cannot update",
    });
  }

  const orderStatus = await CryptoOrders.create({
    customer_id: customerId,
    product_id: productId,
    cut_stock: amount,
  })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message || "Some error occurred while retrieving Order.",
      });
    });

  if (!orderStatus) {
    return res.send({
      error: true,
      message: "Cannot create order",
    });
  }

  return res.send({
    error: false,
    message: "Buy Crypto successfully",
    customerId: customerId,
  });
});

// cancel order
app.post("/order/cancel", async (req, res) => {
  let orderId = req.body.order;

  if (!orderId) {
    return res.status(400).send({
      error: true,
      message: "Please provide order id for cancel",
    });
  }

  const findOrder = await CryptoOrders.findOne({
    where: {
      id: orderId,
    },
  })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message || "Some error occurred while retrieving stock.",
      });
    });

  const cutStock = findOrder.cut_stock;
  const productId = findOrder.product_id;

  console.log("type:", typeof cutStock, typeof productId);

  const findStock = await Stocks.findOne({
    where: {
      product_id: productId,
    },
  })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message || "Some error occurred while retrieving stock.",
      });
    });

  const oldStock = findStock.stock_count;
  const updateStock = oldStock + cutStock;

  const updateStatus = await Stocks.update(
    {
      stock_count: updateStock,
    },
    {
      where: {
        product_id: productId,
      },
    }
  )
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message || "Some error occurred while retrieving stock.",
      });
    });

  if (!updateStatus) {
    return res.status(400).send({
      error: true,
      message: "Cannot update stock.",
    });
  }

  const deleteOrder = await CryptoOrders.destroy({
    where: {
      id: orderId,
    },
  })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message || "Some error occurred while retrieving order.",
      });
    });

  if (!deleteOrder) {
    return res.status(400).send({
      error: true,
      message: "Cancel order is fail",
    });
  }

  return res.send({
    error: false,
    message: `Cancel order ${orderId} successfully`,
  });
});

// connection to mySql
// let dbConnect = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "root",
//   socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock",
//   database: "crypto_shopping_api",
// });
// dbConnect.connect();

// retrieve all customers
// app.get("/customers", (req, res) => {
//   dbConnect.query("SELECT * FROM customers", (error, results, fields) => {
//     if (error) throw error;

//     let message = "";
//     if (results === undefined || results.length === 0) {
//       message = "Customer does not exist";
//     } else {
//       message = "Successfully retrieve all customers";
//     }

//     return res.send({ error: false, data: results, message: message });
//   });
// });

// // retrieve all products
// app.get("/products", (req, res) => {
//   dbConnect.query("SELECT * FROM products", (error, results, fields) => {
//     if (error) throw error;

//     let message = "";
//     if (results === undefined || results.length === 0) {
//       message = "products does not exist";
//     } else {
//       message = "Successfully retrieve all products";
//     }

//     return res.send({ error: false, data: results, message: message });
//   });
// });

// // retrieve all stocks
// app.get("/stocks", (req, res) => {
//   dbConnect.query(
//     "SELECT * FROM stocks JOIN products ON stocks.product_id = products.id",
//     (error, results, fields) => {
//       if (error) throw error;

//       let message = "";
//       if (results === undefined || results.length === 0) {
//         message = "stocks does not exist";
//       } else {
//         message = "Successfully retrieve all stocks";
//       }

//       return res.send({ error: false, data: results, message: message });
//     }
//   );
// });

// // get stock by id
// app.get("/stock/:id", (req, res) => {
//   let id = req.params.id;

//   if (!id) {
//     return res
//       .status(400)
//       .send({ error: true, message: "Please provide stock id" });
//   } else {
//     dbConnect.query(
//       "SELECT * FROM stocks JOIN products ON stocks.product_id = products.id WHERE stocks.id = ?",
//       id,
//       (error, results, fields) => {
//         if (error) throw error;

//         let message = "";
//         if (results === undefined || results.length === 0) {
//           message = "stocks not found";
//         } else {
//           message = "Successfully retrieve stock data";
//         }

//         return res.send({ error: false, data: results, message: message });
//       }
//     );
//   }
// });

// // add stock
// app.post("/stock/:productid", (req, res) => {
//   let productId = req.params.productid;
//   let stockCount = req.body.stock;

//   // validate
//   if (!productId || !stockCount) {
//     return res.status(400).send({
//       error: true,
//       message: "Please provide amount of stock and stock id.",
//     });
//   } else {
//     dbConnect.query(
//       "UPDATE stocks SET stock_count = ? WHERE id = ?",
//       [stockCount, productId],
//       (error, results, fields) => {
//         if (error) throw error;

//         return res.send({
//           error: false,
//           data: results,
//           message: "Stock amount is updated",
//         });
//       }
//     );
//   }
// });

// // create order
// app.post("/order/new", (req, res) => {
//   let customerId = req.body.customer;
//   let productId = req.body.product;
//   let cutStock = req.body.amount;

//   // validate
//   if (!customerId || !productId || !cutStock) {
//     return res.status(400).send({
//       error: true,
//       message:
//         "Please provide customer ID, product ID and amount of stock to order.",
//     });
//   } else {
//     // check and cut stock (Fiat)
//     const balance = dbConnect.query(
//       `SELECT stock_count  FROM stocks WHERE product_id = ?`,
//       productId,
//       (error, results, fields) => {
//         return results[0];
//       }
//     );
//     console.log("stockBalance", balance);

//     // dbConnect.query(
//     //   `INSERT INTO crypto_order (customer_id, product_id, cut_stock) VALUES () SELECT stock_count FROM stocks WHERE product_id = ?`,
//     //   productId,
//     //   (error, results, fields) => {
//     //     if (error) throw error;

//     //     let message = "";
//     //     if (results === undefined || results.length === 0) {
//     //       message = "stocks not found";
//     //     } else {
//     //       message = "Successfully retrieve stock data";
//     //     }

//     //     return res.send({ error: false, data: results, message: message });
//     //   }
//     // );
//   }
// });

app.listen(3000, () => {
  console.log("Shop is opening on port 3000");
});
