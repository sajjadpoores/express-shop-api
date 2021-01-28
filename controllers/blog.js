const { model: BlogModel, validate: validateBlog } = require("../models/blog");
const { model: BlogTagModel } = require("../models/blogTag");
const { model: UserModel } = require("../models/user");
const { extractFieldsFromObject } = require("../utilities/helpers");

module.exports = {
  create: async function (req, res) {
    const { error } = validateBlog(
      extractFieldsFromObject(req.body, [
        "title",
        "text",
        "author",
        "date",
        "tags",
      ])
    );
    if (error) return res.status(400).send(error.details[0].message);

    // check tag existance
    for (let tag of req.body.tags) {
      const tagExists = await BlogTagModel.findById(tag);
      if (!tagExists) {
        return res
          .status(404)
          .send("one or more of provided tags couldnt be found...");
      }
    }
    const blog = new BlogModel(
      extractFieldsFromObject(req.body, [
        "title",
        "text",
        "author",
        "date",
        "tags",
      ])
    );
    await blog.save();

    const savedBlog = await BlogModel.findById(blog._id).populate([
      { path: "author", select: "-password", populate: { path: "permission" } },
      { path: "tags" },
    ]);
    return res
      .status(200)
      .send(
        extractFieldsFromObject(savedBlog, [
          "title",
          "text",
          "author",
          "date",
          "tags",
          "_id",
        ])
      );
  },
  detail: async function (req, res) {
    const blog = await BlogModel.findById(req.params.id).populate([
      { path: "author", select: "-password", populate: { path: "permission" } },
      { path: "tags" },
    ]);
    if (!blog) return res.status(404).send("Blog with given ID was not found!");
    return res
      .status(200)
      .send(
        extractFieldsFromObject(blog, [
          "title",
          "text",
          "author",
          "date",
          "tags",
          "_id",
        ])
      );
  },
  getAll: async function (req, res) {
    const blogs = await BlogModel.find().populate([
      { path: "author", select: "-password", populate: { path: "permission" } },
      { path: "tags" },
    ]);
    return res
      .status(200)
      .send(
        blogs.map((item) =>
          extractFieldsFromObject(item, [
            "title",
            "text",
            "author",
            "date",
            "tags",
            "_id",
          ])
        )
      );
  },
  update: async function (req, res) {
    const blog = await BlogModel.findById(req.params.id);
    if (!blog) return res.status(404).send("Blog with given ID was not found!");

    const blogObject = extractFieldsFromObject(req.body, [
      "title",
      "text",
      "author",
      "date",
      "tags",
    ]);

    const { error } = validateBlog(blogObject);
    if (error) return res.status(400).send(error.details[0].message);

    // check tag existance
    for (let tag of req.body.tags) {
      const tagExists = await BlogTagModel.findById(tag);
      if (!tagExists) {
        return res
          .status(404)
          .send("one or more of provided tags couldnt be found...");
      }
    }

    await BlogModel.findByIdAndUpdate(req.params.id, blogObject);
    const updatedBlog = await BlogModel.findById(req.params.id).populate([
      { path: "author", select: "-password", populate: { path: "permission" } },
      { path: "tags" },
    ]);
    res.status(200).send(updatedBlog);
  },
  delete: async function (req, res) {
    const blog = await BlogModel.findById(req.params.id).populate([
      { path: "author", select: "-password", populate: { path: "permission" } },
      { path: "tags" },
    ]);
    if (!blog) return res.status(404).send("Blog with given ID was not found!");
    await BlogModel.deleteOne({ _id: req.params.id });
    return res
      .status(200)
      .send(
        extractFieldsFromObject(blog, [
          "title",
          "text",
          "author",
          "date",
          "tags",
          "_id",
        ])
      );
  },
  like: async function (req, res) {
    const blog = await BlogModel.findById(req.params.id).populate([
      { path: "author", select: "-password", populate: { path: "permission" } },
      { path: "tags" },
    ]);
    if (!blog) return res.status(404).send("Blog with given ID was not found!");

    await UserModel.findByIdAndUpdate(req.user, {
      $addToSet: { favoriteBlogs: blog._id },
    });
    const user = await UserModel.findById(req.user).populate([
      { path: "favoriteProducts" },
      { path: "favoriteBlogs" },
      { path: "favoriteBlogs" },
    ]);
    return res
      .status(200)
      .send(extractFieldsFromObject(user, ["_id", "favoriteBlogs"]));
  },
  unlike: async function (req, res) {
    const blog = await BlogModel.findById(req.params.id).populate([
      { path: "author", select: "-password", populate: { path: "permission" } },
      { path: "tags" },
    ]);
    if (!blog) return res.status(404).send("Blog with given ID was not found!");

    await UserModel.findByIdAndUpdate(req.user, {
      $pull: { favoriteBlogs: blog._id },
    });
    const user = await UserModel.findById(req.user).populate([
      { path: "favoriteProducts" },
      { path: "favoriteBlogs" },
      { path: "favoriteBlogs" },
    ]);
    return res
      .status(200)
      .send(extractFieldsFromObject(user, ["_id", "favoriteBlogs"]));
  },
};
module.exports = router;
