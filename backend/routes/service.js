const express = require('express');
const router = express.Router();
const { upload, handleMulterError } = require("../middlewares/upload");
const serviceController = require('../controllers/serviceController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');
const { validateCreateService } = require('../middlewares/validateMiddlewares');

router.post("/create-service",upload.single("image"), handleMulterError, verifyAdmin, validateCreateService, serviceController.createService);
router.get("/all-services", verifyToken, serviceController.getAllServices);
router.delete("/delete-service/:id", verifyAdmin, serviceController.deleteService);
router.get("/service/:id", verifyToken, serviceController.getServiceById);
router.put("/update-service/:id", upload.single("image"), handleMulterError, verifyAdmin, serviceController.updateService);

module.exports = router;