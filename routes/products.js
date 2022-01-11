import express from "express";
import { nanoid } from "nanoid";
const router = express.Router();
const idLength = 8;


// Getting all the products records
router.get("/", (req, res) => {
    const products = req.app.db.get("products");

    res.send(products);
});

// Getting the products by Id

router.get("/:id", (req, res) => {
    const product = req.app.db.get("products").find({ id: req.params.id }).value();

    if (!product) {
        res.sendStatus(404)
    }

    res.send(product);
});

//Adding Products
router.post("/", (req, res) => {
    try {
        const product = {
            id: nanoid(idLength),
            ...req.body,
        };

        req.app.db.get("products").push(product).write();

        res.send(product)
    } catch (error) {
        return res.status(500).send(error);
    }
});


//Update a product

router.put("/:id", (req, res) => {
    try {
        req.app.db
            .get("products")
            .find({ id: req.params.id })
            .assign(req.body)
            .write();

        res.send(req.app.db.get("products").find({ id: req.params.id }));
    } catch (error) {
        return res.status(500).send(error);
    }
});


// Remove/ Delete a Product
router.delete("/:id", (req, res) => {
    req.app.db.get("products").remove({ id: req.params.id }).write();

    res.sendStatus(200);
});
export default router;