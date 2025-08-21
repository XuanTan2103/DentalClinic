const express = require('express');
const router = express.Router();
const upload = require("../middlewares/upload");
const serviceController = require('../controllers/serviceController');

router.post("/create-service",upload.single("image"), serviceController.createService);
router.get("/all-services", serviceController.getAllServices);
router.delete("/delete-service/:id", serviceController.deleteService);
router.get("/service/:id", serviceController.getServiceById);
router.put("/update-service/:id", upload.single("image"), serviceController.updateService);

module.exports = router;