const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { userOneId, userOne, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

test("sould signup new user", async () => {
	const response = await request(app)
		.post("/users")
		.send({
			name: "Rachhen",
			email: "rachhen@example.com",
			password: "MyPass@#@#"
		})
		.expect(201);

	const user = await User.findById(response.body.user._id);
	expect(user).not.toBeNull();

	expect(user.password).not.toBe("MyPass@#@#");
});

test("should login existing user", async () => {
	const response = await request(app)
		.post("/users/login")
		.send({
			email: userOne.email,
			password: userOne.password
		})
		.expect(200);

	const user = await User.findById(userOneId);
	expect(response.body.token).toBe(user.tokens[1].token);
});

test("should not login nonexistent user", async () => {
	await request(app)
		.post("/users/login")
		.send({
			email: "notuser@example.com",
			password: "notpasswes@##"
		})
		.expect(400);
});

test("should get profile for authentication user", async () => {
	await request(app)
		.get("/users/me")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200);
});

test("should not get profile for unauthentication user", async () => {
	await request(app)
		.get("/users/me")
		.send()
		.expect(401);
});

test("should delete account for user", async () => {
	await request(app)
		.delete("/users/me")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200);

	const user = await User.findById(userOneId);
	expect(user).toBeNull();
});

test("should not delete account for unauthenticated user", async () => {
	await request(app)
		.delete("/users/me")
		.send()
		.expect(401);
});

test("should upload a user avatar", async () => {
	await request(app)
		.post("/users/me/avatar")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.attach("avatar", "test/fixtures/profile-pic.jpg")
		.expect(200);
	const user = await User.findById(userOneId);
	expect(user.avatar).toEqual(expect.any(Buffer));
});

test("should update valid user fields", async () => {
	await request(app)
		.patch("/users/me")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.send({ name: "Koko" })
		.expect(200);

	const user = await User.findById(userOneId);
	expect(user.name).toBe("Koko");
});

test("should not update invalid user fields", async () => {
	await request(app)
		.patch("/users/me")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.send({ location: "Siem Reap" })
		.expect(400);
});
