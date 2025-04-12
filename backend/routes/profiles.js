import express from "express";

const router = express.Router();

router.get("/update_PlayerID_from_sub", (req, res) => {
  console.log("✅ /update_PlayerID_from_sub route was hit!");
  res.send("/update_PlayerID_from_sub_response");
});

router.get("/get_my_profile", (req, res) => {
  console.log("✅ /get_my_profile route was hit!");
  res.send("my_profile_response");
});



export default router;
