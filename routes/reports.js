import express from "express";
const router = express.Router();
import data from "../data/index.js";
const reportData = data.reports;
const userData = data.users;
const showcaseData = data.showcases;
const commentData = data.comments;

export default router;

router.get("/form", async (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/homePage");
  }
  try {
    const userId = req.session.userId;
    const userLogin = await userData.getUserById(userId);
    const showcaseId = req.query.id;
    const showcase = await showcaseData.getShowcaseById(showcaseId);
    res.render("reports/report-form", {
      userLogin,
      "reported-showcase": showcase.topic,
      showcaseId: showcaseId,
    });
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.post("/form", async (req, res) => {
  const userId = req.session.userId;
  const userLogin = await userData.getUserById(userId);
  const showcaseId = req.body.showcaseId;
  const showcase = await showcaseData.getShowcaseById(showcaseId);
  try {
    let reason = req.body.reason;
    if (typeof reason == "string") {
      reason = [reason];
    }
    await reportData.addReport(userId, showcaseId, reason);
    res.render("reports/report-form", {
      success: "Report successfully submitted!",
      userLogin,
      "reported-showcase": showcase.topic,
      showcaseId: showcaseId,
    });
    return;
  } catch (e) {
    res.render("reports/report-form", {
      message: e,
      userLogin,
      "reported-showcase": showcase.topic,
      showcaseId: showcaseId,
    });
  }
});

router.get("/statistic", async (req, res) => {
  if (req.session && req.session.userId) {
    let userLogin = await userData.getUserById(req.session.userId);
    if (userLogin.Admin) {
      try {
        let allShowcases = await showcaseData.getAllShowcase();
        let allUsers = await userData.getAllUsers();
        let allComments = await commentData.getAllComments();
        res.render("statistics/statistics", {
          allShowcases,
          allUsers,
          allComments,
          userLogin,
        });
      } catch (error) {
        res.status(404).send(error);
      }
    } else res.redirect("/homePage");
  } else res.redirect("/homePage");
});

router.get("/:id", async (req, res) => {
  try {
    const report = await reportData.getReport(req.params.id);
    res.status(200).json(report);
  } catch (e) {
    res.status(404).json({ message: "Report not found" });
  }
});

router.get("/", async (req, res) => {
  if (req.session && req.session.userId) {
    let userLogin = await userData.getUserById(req.session.userId);
    if (userLogin.Admin) {
      try {
        const reportList = await reportData.getAllReports();
        res.render("reports/reportList", { reportList, userLogin });
      } catch (error) {
        res.status(404).send(error);
      }
    } else res.redirect("/homePage");
  } else res.redirect("/homePage");
});

