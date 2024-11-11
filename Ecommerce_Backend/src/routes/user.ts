import express from "express";
import { newUser,getAllUsers,getUser,deleteUser} from "../controllers/user.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();

// /api/1v / user/new;
app.post("/new",newUser);

//api/v1/user/all
app.get("/all",adminOnly,getAllUsers);

//api/v1/user/:id

app.route("/:id").get(adminOnly,getUser).delete(adminOnly,deleteUser);
// app.get("/:id",getUser);
// app.delete("/:id",deleteUser)

export default app;
