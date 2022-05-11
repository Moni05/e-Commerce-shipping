const express = require("express");
const app = express();
const cors = require('cors');

const { searchProduct, searchPostalCode, addToCart, getCartItems, emptyCartItems, totalCharge } = require("./helperFunctions")
const { postal_codes, products, item } = require("./data");
const swaggerUI = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

app.use(express.json());

const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Product API",
        version: "1.0.0",
        description: "Backend API for products",
      },
      servers: [
        {
          url: "http://localhost:3001/",
        },
      ],
    },
    apis: ["./index.js"],
};

const corsOptions = {
    origin: "*",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};
  
const specs = swaggerJsdoc(options);
app.use(cors(corsOptions));
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

/**
 * @swagger
 * components:
 *   schemas:
 *    Product:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: number
 *         name:
 *           type: string
 *           description: The product name
 *         price:
 *           type: number
 *           description: The Product Price
 *         description:
 *           type: string
 *           description: The product description
 *         category:
 *           type: string
 *           description: The product category
 *         image:
 *           type: string
 *           description: The product image
 *         discount_percentage:
 *           type: number
 *           description: The product discount_percentage
 *         weight_in_grams:
 *           type: number
 *           description: The product weight_in_grams
 *       example:
 *         id: 1
 *         name: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops"
 *         price: 109.95
 *         description: Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday
 *         category: men's clothing
 *         image:  https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg,
 *         discount_percentage: 3.2,
 *         weight_in_grams: 670,
 *    Warehouse:
 *        type: object
 *        required:
 *        properties:
 *         postal_code:
 *           type: number
 *         distance_in_kilometers:
 *           type: number
 *        example:
 *             postal_code: 465535
 *             distance_in_kilometers: 200.354
 *    CartSuccess:
 *        type: object
 *        required:
 *        properties:
 *        example:
 *             status: success
 *             message: Item has been added to cart
 *    CartFailure:
 *        type: object
 *        required:
 *        properties:
 *        example:
 *             status: error
 *             message: Invalid product id
 *    Item:
 *        type: object
 *        required:
 *        properties:
 *        example:
 *             product_id: 101
 *             quantity: 10
 *    CartItems:
 *        type: object
 *        required:
 *        properties:
 *        example:
 *             status: success,
 *             message: Item available in the cart,
 *             items: [
 *                        {
 *                          "product_id": 101,
 *                          "description": "Name of Product 1",
 *                          "quantity": 4
 *                        },
 *                        { 
 *                          "product_id":102,
 *                          "description":"Test",
 *                          "quantity":5
 *                        },
 *                        { 
 *                          "product_id":103,
 *                          "description":"Test",
 *                          "quantity":5
 *                        }
 *                    ]                     
 *    Checkout:
 *        type: object
 *        required:
 *        properties:
 *        example:
 *             status: success
 *             message: Total value of your shopping cart is - $12,500.35
 *    CartEmptyAction:
 *        type: object
 *        required:
 *        properties:
 *        example:
 *             action: empty_cart
 *    CartEmptySuccess:
 *        type: object
 *        required:
 *        properties:
 *        example:
 *             status: success
 *             message: All items have been removed from the cart ! 
 *           
 */

/**
 * @swagger
 * /warehouse/distance:
 *   get:
 *     summary: Returns distance from warehouse to delivery address
 *     tags: [Warehouse]
 *     parameters:
 *       - in: query
 *         name: postal_code
 *         schema:
 *           type: number
 *         required: true
 *         description: Delivery address postal code
 *     responses:
 *       200:
 *         description: Distance in KM
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Warehouse'
 *       400:
 *         description: Invalid postal code, valid ones are 465535 to 465545.
 */


app.get("/warehouse/distance", async (req, res) => {
    if (postal_codes.length > 0) {
      const result = searchPostalCode(postal_codes, req.query.postal_code);
      if (result.status === "error") res.status(400).send(result);
      else res.status(200).send(result);
    } else res.status(200).send("Invalid Postal Code");
});

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Returns product info
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product id
 *     responses:
 *       200:
 *         description: Product info
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid product id. Valid product id range is 100 to 110.
 */

app.get("/product/:id", async (req, res) => {
    if (products.length > 0) {
      const result = searchProduct(products, req.params.id);
      if (result.status === "error") res.status(400).send(result);
      else res.status(200).send(result);
    } else res.status(200).send("Product not available");
});


/**
 * @swagger
 * /cart/item:
 *   post:
 *     summary: Add a item in cart
 *     tags: [Cart]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       200:
 *         description: Item Added
 *         content:
 *           application/json:
 *             schema: 
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CartSuccess'
 *       400:
 *         description: Error state.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CartFailure'
 */

app.post("/cart/item", async (req, res) => {
    const result = addToCart(products, req.body.product_id, req.body.quantity);
    if (result.status === "error") res.status(400).send(result);
    else res.status(200).send(result);
});

/**
 * @swagger
 * /cart/items:
 *   get:
 *     summary: Get all the items in cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Product info
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CartItems'
 *       400:
 *         description: Cart is empty.
 */

app.get("/cart/items", async (req, res) => {
    if (item.length > 0){
        const result = getCartItems(item, products);
        if (result.status === "error") res.status(400).send(result);
        else res.status(200).send(result);
    } else res.status(400).send("Cart is empty");

});


/**
 * @swagger
 * /cart/items:
 *   post:
 *     summary: Add a item in cart
 *     tags: [Cart]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartEmptyAction'               
 *     responses:
 *       200:
 *         description: Item Added
 *         content:
 *           application/json:
 *             schema: 
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CartEmptySuccess'
 *       400:
 *         description: Error state. Bad request.
 */

app.post("/cart/items", async (req, res) => {
    if (item.length > 0){
        const result = emptyCartItems(req.body.action);
        if (result.status === "error") res.status(400).send(result.message);
        else res.status(200).send(result);
    } else res.status(400).send("Error state. Bad request.");

});


/**
 * @swagger
 * /cart/checkout-value:
 *   get:
 *     summary: Get total amount
 *     tags: [Cart]
 *     parameters:
 *       - in: query
 *         name: shipping_postal_code
 *         schema:
 *           type: number
 *         required: true
 *         description: Delivery address postal code
 *     responses:
 *       200:
 *         description: Distance in KM
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Checkout'
 *       400:
 *         description: Invalid postal code, valid ones are 465535 to 465545.
 */

app.get("/cart/checkout-value", async (req, res) => {

  if (item.length > 0){
      const solution = searchPostalCode(postal_codes, req.query.shipping_postal_code);
      if(solution.status === "error") res.status(400).send(solution.message);
      else{
        const result = totalCharge(item, products, solution.distance_in_kilometers);
        if (result.status === "error") res.status(400).send(result.message);
        else res.status(200).send(result);
      }

  } else res.status(400).send("Error state. Bad request.");

});

app.listen(process.env.PORT || 3001,()=>console.log("server running at port 3001"));