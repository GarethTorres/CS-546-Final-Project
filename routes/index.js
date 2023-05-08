const userRoutes = require("./users");
const showcaseRoutes = require("./showcases");
const commentRoutes = require("./comments");
const reportRoutes = require("./reports");
const homePageRoutes = require("./homePage");
const path = require('path');

const constructorMethod = app => {
    app.use("/users", userRoutes);
    app.use("/showcases", showcaseRoutes);
    app.use("/comments", commentRoutes);
    app.use("/reports", reportRoutes);
    app.use("/homePage", homePageRoutes);

    app.get('/', (req, res) => {
        res.redirect('http://localhost:3000/homePage');
    });

    app.use("*", (req, res) => {
        res.sendStatus(404);
    });
};

export default constructorMethod;
