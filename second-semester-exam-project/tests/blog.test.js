const request = require("supertest");
const app = require("../app");

describe("Blog Endpoints", () => {

  let token;
  let blogId;

  beforeAll(async () => {

    // Signup user
    const res = await request(app).post("/api/auth/signup").send({
      first_name: "Jane",
      last_name: "Doe",
      email: "jane@example.com",
      password: "password123",
    });

    token = res.body.token;
  });

  //Create Blog (Draft by default)
  it("should create blog in draft state", async () => {
    const res = await request(app)
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "My First Blog",
        description: "Test description",
        tags: ["node", "api"],
        body: "This is a test blog body content"
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.state).toEqual("draft");

    blogId = res.body._id;
  });

  //Publish Blog
  it("should publish blog", async () => {
    const res = await request(app)
      .patch(`/api/blogs/${blogId}/publish`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.state).toEqual("published");
  });

  //Get Published Blogs (Public)
  it("should get published blogs (public access)", async () => {
    const res = await request(app)
      .get("/api/blogs");

    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toBeDefined();
  });

  //Get Single Blog + increment read_count
  it("should get single published blog", async () => {
    const res = await request(app)
      .get(`/api/blogs/${blogId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.read_count).toBeGreaterThanOrEqual(1);
  });

  //Update Blog
  it("should update blog", async () => {
    const res = await request(app)
      .put(`/api/blogs/${blogId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Blog Title"
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toEqual("Updated Blog Title");
  });

  //Get Owner Blogs
  it("should get owner blogs", async () => {
    const res = await request(app)
      .get("/api/blogs/my-blogs")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
  });

  //Delete Blog
  it("should delete blog", async () => {
    const res = await request(app)
      .delete(`/api/blogs/${blogId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
  });

});
