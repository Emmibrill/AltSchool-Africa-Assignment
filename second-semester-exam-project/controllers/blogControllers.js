const Blog = require("../models/blog");

const calculateReadingTime = (text) => {
  const no_of_words = text.split(/\s+/).length;
  const minutes = Math.ceil(no_of_words / 200);
  return `${minutes} mins`;
};

exports.createBlog = async (req, res) => {
  try {
    const { title, description, tags, body } = req.body;

    const reading_time = calculateReadingTime(body);

    const blog = await Blog.create({
      title,
      description,
      tags,
      body,
      reading_time,
      author: req.user.id,
    });

    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Get All Published Blogs (Pagination + Filtering + Search + Order)
exports.getPublishedBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      author,
      title,
      tags,
      sortBy,
    } = req.query;

    const query = { state: "published" };

    if (author) query.author = author;
    if (title) query.title = new RegExp(title, "i");
    if (tags) query.tags = { $in: tags.split(",") };

    // Restrict allowed sorting fields
    const allowedSortFields = ["read_count", "reading_time", "createdAt"];

        let sortOption = { createdAt: -1 };

    if (sortBy && allowedSortFields.includes(sortBy)) {
      sortOption = { [sortBy]: -1 };
    }

    const blogs = await Blog.find(query)
      .populate("author", "first_name last_name email")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Get Single Blog plus Increment read count
exports.getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { _id: req.params.id, state: "published" },
      { $inc: { read_count: 1 } },
      { new: true }
    ).populate("author", "first_name last_name email");

    if (!blog)
      return res.status(404).json({ message: "Blog not found" });

    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Owner-only: get my blogs
exports.getMyBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, state } = req.query;
    const query = { author: req.user.id };
    if (state) query.state = state;

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Owner-only: update blog
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (blog.author.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    const { title, description, body, tags } = req.body;
    if (title) blog.title = title;
    if (description) blog.description = description;
    if (tags) blog.tags = tags;
    if (body) {
      blog.body = body;
      blog.reading_time = calculateReadingTime(body);
    }

    await blog.save();
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Owner-only: delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (blog.author.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    await blog.remove();
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Owner-only: publish blog
exports.publishBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (blog.author.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    blog.state = "published";
    await blog.save();
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

