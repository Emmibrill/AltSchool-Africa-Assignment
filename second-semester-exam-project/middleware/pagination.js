const pagination = (model) => async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};

    // Filter by state (draft or published)
    if (req.query.state) {
      filter.state = req.query.state;
    }

    // Search by title or tags
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { tags: { $regex: req.query.search, $options: "i" } }
      ];
    }

    // Ordering
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    const results = await model
      .find(filter)
      .populate("author", "first_name last_name email")
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit);

    const total = await model.countDocuments(filter);

    res.paginatedResults = {
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      data: results
    };

    next();

  } catch (error) {
    next(error);
  }
};

module.exports = pagination;
