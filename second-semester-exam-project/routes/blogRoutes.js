const express = require("express");

const router = express.Router();
const auth = require("../middleware/auth");
const blogController = require("../controllers/blogControllers");
const paginate = require("../middleware/pagination");


// Public routes
router.get('/', (req, res, next) => {
  req.query.state = 'published';
  next();
},
paginate(blogController.getPublishedBlogs), (req, res) => {
  res.status(200).json(res.paginatedResults);
}
);

router.get("/:id", blogController.getSingleBlog);

// Protected routes
router.use(auth);
router.post("/", blogController.createBlog);
router.get("/my-blogs", blogController.getMyBlogs);
router.patch("/:id", blogController.updateBlog);
router.delete("/:id", blogController.deleteBlog);
router.patch("/:id/publish", blogController.publishBlog);


module.exports = router;
