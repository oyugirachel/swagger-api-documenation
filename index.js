import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { Low, JSONFileSync } from 'lowdb'
import bodyParser from "body-parser";
import * as productsRouter from "routes/products.js"
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

const PORT = process.env.PORT || 4000;


// const adapter = new Low(new JSONFileSync('db.json'));
// const db = new Low(adapter);




const app = express();
const adapter = new Low(new JSONFileSync('db.json'));
const db = new Low(adapter);

app.use(bodyParser.json());

app.use((req, res, next) => {
    const adapter = new Low(new JSONFileSync('db.json'));

    Low(adapter)
        .then((db) => {
            db.defaults({ products: [] }).write();
            return db;
        })
        .then((db) => {
            res.locals.db = db;
            next();
        });
});

app.db = db;

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Library API",
			version: "1.0.0",
			description: "A simple Express Library API",
		},
		servers: [
			{
				url: "http://localhost:4000",
			},
		],
	},
	apis: ["./routes/*.js"],
};
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use("/products", productsRouter);

app.listen(PORT, () => console.log('The server is running on port ${PORT}'));