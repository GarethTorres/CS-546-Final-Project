import userRoutes from "./users.js";
import showcaseRoutes from "./showcases.js";
import commentRoutes from "./comments.js";
import reportRoutes from "./reports.js";
import homePageRoutes from "./homePage.js";
import path from 'path';

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
