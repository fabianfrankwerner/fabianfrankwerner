const { Router } = require("express");
const categoriesController = require("../controllers/categoriesController");
const router = Router();

router.get("/", categoriesController.categoriesListGet);
router.get("/create", categoriesController.categoriesCreateGet);
router.post("/create", categoriesController.categoriesCreatePost);
router.get("/:id", categoriesController.categoryDetailGet);
router.get("/:id/update", categoriesController.categoriesUpdateGet);
router.post("/:id/update", categoriesController.categoriesUpdatePost);
router.post("/:id/delete", categoriesController.categoriesDeletePost);

module.exports = router;
