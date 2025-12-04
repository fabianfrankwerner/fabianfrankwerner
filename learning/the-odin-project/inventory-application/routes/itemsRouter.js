const { Router } = require("express");
const itemsController = require("../controllers/itemsController");
const router = Router();

router.get("/", itemsController.itemsListGet);
router.get("/create", itemsController.itemsCreateGet);
router.post("/create", itemsController.itemsCreatePost);
router.get("/:id", itemsController.itemDetailGet);
router.get("/:id/update", itemsController.itemsUpdateGet);
router.post("/:id/update", itemsController.itemsUpdatePost);
router.post("/:id/delete", itemsController.itemsDeletePost);

module.exports = router;
