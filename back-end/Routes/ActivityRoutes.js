const express = require( "express");
const { getActivity } = require( "../Controllers/ActivityController.js");
const authMiddleware = require("../Middlewares/authMiddleware");
const router = express.Router();

router.get("/", authMiddleware, getActivity);

module.exports =router;
