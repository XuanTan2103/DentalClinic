const Service = require("../models/Service");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const { get } = require("mongoose");

const serviceController = {
  createService: async (req, res) => {
    try {
      const { name, description, duration, price, type, guarantee } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Service name is required" });
      }
      if (!description) {
        return res.status(400).json({ message: "Service description is required" });
      }
      if (!duration) {
        return res.status(400).json({ message: "Service duration is required" });
      }
      if (!price) {
        return res.status(400).json({ message: "Service price is required" });
      }
      if (!type) {
        return res.status(400).json({ message: "Service type is required" });
      }
      if (!guarantee) {
        return res.status(400).json({ message: "Service guarantee is required" });
      }
      if (!req.file) {
        return res.status(400).json({ message: "Service image is required" });
      }

      let imageUrl = null;

      if (req.file) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "dental_services", resource_type: "image" },
            (err, res) => (err ? reject(err) : resolve(res))
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

        imageUrl = result.secure_url;
      }

      const newService = new Service({
        name,
        description,
        duration,
        price,
        type,
        guarantee,
        image: imageUrl,
      });

      await newService.save();

      res.status(201).json({
        message: "Create service successfully",
        service: newService,
      });
    } catch (error) {
      console.error("Failed to create service:", error);
      res.status(500).json({ message: 'An error occurred while creating the service', error });
    }
  },

  getAllServices: async (req, res) => {
    try {
      const services = await Service.find();
      res.status(200).json({ message: "Get all service successfully", services });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while fetching services', error });
    }
  },

  deleteService: async (req, res) => {
    try {
      const deletedService = await Service.findByIdAndDelete(req.params.id);
      if (!deletedService) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.status(200).json({ message: "Delete service successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting service", error });
    }
  },

  getServiceById: async (req, res) => {
    try {
      const { id } = req.params;
      const service = await Service.findById(id);

      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      res.status(200).json({ message: "Get service by ID successfully", service });

    } catch (error) {
      console.error("Failed to get service by ID:", error);
      res.status(500).json({ message: 'An error occurred while fetching the service', error });
    }
  },

  updateService: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, duration, price, type, guarantee } = req.body;

      const service = await Service.findById(id);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      let imageUrl = service.image;
      if (req.file) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "dental_services", resource_type: "image" },
            (err, res) => (err ? reject(err) : resolve(res))
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
        imageUrl = result.secure_url;
      }

      service.name = name || service.name;
      service.description = description || service.description;
      service.duration = duration || service.duration;
      service.price = price || service.price;
      service.type = type || service.type;
      service.guarantee = guarantee || service.guarantee;
      service.image = imageUrl;

      await service.save();

      res.status(200).json({ message: "Update service successfully", service });
    } catch (error) {
      console.error("Failed to update service:", error);
      res.status(500).json({ message: 'An error occurred while updating the service', error });
    }
  },


}

module.exports = serviceController;