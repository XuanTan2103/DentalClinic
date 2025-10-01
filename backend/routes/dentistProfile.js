const express = require('express');
const router = express.Router();
const dentistProfileController = require('../controllers/dentistProfileController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

router.post("/create-dentist-profile", verifyToken, verifyRole(['Dentist']), dentistProfileController.createDentistProfile);
router.get("/get-dentist-profile/:dentistId", verifyToken, verifyRole(['Admin']), dentistProfileController.getdentistProfileById);

module.exports = router;