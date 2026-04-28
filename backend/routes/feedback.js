const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

// POST /feedback - Submit new feedback
router.post("/feedback", async (req, res) => {
  try {
    const { studentName, subject, rating, comments } = req.body;

    const feedback = new Feedback({
      studentName,
      subject,
      rating,
      comments,
    });

    const savedFeedback = await feedback.save();
    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: savedFeedback,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: messages,
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// GET /feedbacks - Retrieve all feedbacks with optional pagination
router.get("/feedbacks", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Feedback.countDocuments();
    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: feedbacks,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// GET /feedbacks/:subject - Retrieve feedback by subject with average rating
router.get("/feedbacks/:subject", async (req, res) => {
  try {
    const subject = req.params.subject;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { subject: { $regex: new RegExp(`^${subject}$`, "i") } };

    const total = await Feedback.countDocuments(query);
    const feedbacks = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Calculate average rating for this subject
    const avgResult = await Feedback.aggregate([
      { $match: query },
      { $group: { _id: null, averageRating: { $avg: "$rating" } } },
    ]);

    const averageRating =
      avgResult.length > 0 ? Math.round(avgResult[0].averageRating * 10) / 10 : 0;

    res.status(200).json({
      success: true,
      data: feedbacks,
      averageRating,
      subject,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// DELETE /feedbacks/:id - Delete a feedback entry (admin)
router.delete("/feedbacks/:id", async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;
