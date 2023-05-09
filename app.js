import express, { static as _static, json, urlencoded } from "express";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

global.__filename = __filename;
global.__dirname = __dirname;

const app = express();
const a = _static(__dirname + "/public");

import session from 'express-session';
import cookieParser from 'cookie-parser';

import configRoutes from "./routes/index.js";
import exphbs from "express-handlebars";

app.use("/public", a);
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(json());
app.use(
	session({
        name: 'AuthCookie',
        secret: 'some secret string!',
        resave: false,
        saveUninitialized: true,
        cookie: { 
        
    },
    })
);

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});
