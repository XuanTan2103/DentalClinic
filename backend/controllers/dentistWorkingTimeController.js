const DentistWorkingTime = require('../models/DentistWorkingTime');
const User = require('../models/User');
const mongoose = require("mongoose");

const dentistWorkingTimeController = {
  createDentistWorkingTime: async (req, res) => {
    try {
      const { dentistId, date, morning, afternoon, isClosed, isFixed, workingDays } = req.body;

      if (!dentistId) {
        return res.status(400).json({ message: "Dentist is required, please choose a dentist" });
      }
      if (!mongoose.Types.ObjectId.isValid(dentistId)) {
        return res.status(400).json({ message: "Invalid dentist ID format" });
      }

      const dentist = await User.findById(dentistId);
      if (!dentist || dentist.role !== "Dentist") {
        return res.status(404).json({ message: "Dentist not found" });
      }

      // Helpers...
      const timeToMinutes = (t) => {
        if (typeof t !== 'string') return NaN;
        const parts = t.split(':');
        if (parts.length !== 2) return NaN;
        const hh = parseInt(parts[0], 10);
        const mm = parseInt(parts[1], 10);
        if (Number.isNaN(hh) || Number.isNaN(mm)) return NaN;
        return hh * 60 + mm;
      };

      const isValidShift = (start, end, min, max) => {
        const s = timeToMinutes(start);
        const e = timeToMinutes(end);
        const mn = timeToMinutes(min);
        const mx = timeToMinutes(max);
        if (Number.isNaN(s) || Number.isNaN(e) || Number.isNaN(mn) || Number.isNaN(mx)) return false;
        return s >= mn && e <= mx && s < e;
      };

      const validateShifts = () => {
        if (isClosed) {
          if ((morning?.startTime && morning?.endTime) || (afternoon?.startTime && afternoon?.endTime)) {
            return "Closed day should not have morning or afternoon sessions";
          }
          return null;
        }

        const hasMorning = !!(morning?.startTime || morning?.endTime);
        const hasAfternoon = !!(afternoon?.startTime || afternoon?.endTime);
        if (!hasMorning && !hasAfternoon) {
          return "At least one shift (morning or afternoon) is required";
        }

        if (hasMorning) {
          if (!morning?.startTime || !morning?.endTime) {
            return "Both start time and end time are required for morning shift";
          }
          if (!isValidShift(morning.startTime, morning.endTime, "06:00", "12:00")) {
            return "Morning shift must be between 06:00 and 12:00, and start < end";
          }
        }

        if (hasAfternoon) {
          if (!afternoon?.startTime || !afternoon?.endTime) {
            return "Both start time and end time are required for afternoon shift";
          }
          if (!isValidShift(afternoon.startTime, afternoon.endTime, "12:00", "21:00")) {
            return "Afternoon shift must be between 12:00 and 21:00, and start < end";
          }
        }

        return null;
      };

      // CASE: fixed schedule (isFixed = true)
      if (isFixed) {
        const existingFixed = await DentistWorkingTime.findOne({ dentistId, isFixed: true });
        if (existingFixed) {
          return res.status(400).json({ message: "Dentist already has a fixed working schedule" });
        }

        const shiftError = validateShifts();
        if (shiftError) return res.status(400).json({ message: shiftError });

        if (!Array.isArray(workingDays) || workingDays.length === 0) {
          return res.status(400).json({ message: "Working days are required for fixed schedule" });
        }
        const invalidDay = workingDays.find(d => d < 1 || d > 7);
        if (invalidDay) {
          return res.status(400).json({ message: "Working days must be between 1 (Sunday) and 7 (Saturday)" });
        }

        const newWorkingTime = new DentistWorkingTime({
          dentistId,
          date: null,
          morning: morning || { startTime: "", endTime: "" },
          afternoon: afternoon || { startTime: "", endTime: "" },
          isClosed: !!isClosed,
          isFixed: true,
          workingDays
        });

        await newWorkingTime.save();
        return res.status(201).json({
          message: "Create fixed dentist working time successfully",
          data: newWorkingTime
        });
      }

      // CASE: special schedule (isFixed = false) => date required
      if (!date) {
        return res.status(400).json({ message: "Date is required for special schedule" });
      }

      const inputDate = new Date(
        new Date(date).toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
      );
      inputDate.setHours(0, 0, 0, 0);

      const todayVN = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
      );
      todayVN.setHours(0, 0, 0, 0);
      const tomorrowVN = new Date(todayVN.getTime() + 24 * 60 * 60 * 1000);

      if (inputDate < tomorrowVN) {
        return res.status(400).json({ message: "Date must be from tomorrow onwards (VN time)" });
      }

      const existingSameDay = await DentistWorkingTime.findOne({ dentistId, date: inputDate });
      if (existingSameDay) {
        return res.status(400).json({ message: "Working time already exists for this date" });
      }

      const shiftError = validateShifts();
      if (shiftError) return res.status(400).json({ message: shiftError });

      const newWorkingTime = new DentistWorkingTime({
        dentistId,
        date: inputDate,
        morning: morning || { startTime: "", endTime: "" },
        afternoon: afternoon || { startTime: "", endTime: "" },
        isClosed: !!isClosed,
        isFixed: false,
        workingDays: []
      });

      await newWorkingTime.save();
      return res.status(201).json({
        message: "Create special dentist working time successfully",
        data: newWorkingTime
      });

    } catch (error) {
      console.error("Error creating working time:", error);
      res.status(500).json({ message: error.message });
    }
  },



  deleteDentistWorkingTime: async (req, res) => {
    try {
      const deleted = await DentistWorkingTime.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Working time not found" });
      }
      res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAllDentistWorkingTime: async (req, res) => {
    try {
      const workingTimes = await DentistWorkingTime.find()
        .populate("dentistId", "fullName email");

      const fixedWorkingTime = workingTimes.filter(item => item.isFixed === true);
      const specialWorkingTime = workingTimes.filter(item => item.isFixed === false);

      res.status(200).json({
        message: "Get dentits working time successfully",
        data: {
          fixedWorkingTime,
          specialWorkingTime
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getDentistWorkingTimeById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const workingTime = await DentistWorkingTime.findById(id)
        .populate("dentistId", "fullName email");

      if (!workingTime) {
        return res.status(404).json({ message: "Working time not found" });
      }

      res.status(200).json({
        message: "Get dentist working time successfully",
        data: workingTime,
      });
    } catch (error) {
      console.error("Error fetching working time by id:", error);
      res.status(500).json({ message: error.message });
    }
  },

updateDentistWorkingTime: async (req, res) => {
  try {
    const { dentistId, date, morning, afternoon, isClosed, isFixed, workingDays } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid working time ID format" });
    }

    if (!dentistId) {
      return res.status(400).json({ message: "Dentist is required, please choose a dentist" });
    }
    if (!mongoose.Types.ObjectId.isValid(dentistId)) {
      return res.status(400).json({ message: "Invalid dentist ID format" });
    }

    const dentist = await User.findById(dentistId);
    if (!dentist || dentist.role !== "Dentist") {
      return res.status(404).json({ message: "Dentist not found" });
    }

    // ------------------------
    // Helpers for time checks
    // ------------------------
    const timeToMinutes = (t) => {
      if (typeof t !== 'string') return NaN;
      const parts = t.split(':');
      if (parts.length !== 2) return NaN;
      const hh = parseInt(parts[0], 10);
      const mm = parseInt(parts[1], 10);
      if (Number.isNaN(hh) || Number.isNaN(mm)) return NaN;
      return hh * 60 + mm;
    };

    const isValidShift = (start, end, min, max) => {
      const s = timeToMinutes(start);
      const e = timeToMinutes(end);
      const mn = timeToMinutes(min);
      const mx = timeToMinutes(max);
      if (Number.isNaN(s) || Number.isNaN(e) || Number.isNaN(mn) || Number.isNaN(mx)) return false;
      return s >= mn && e <= mx && s < e;
    };

    const validateShifts = () => {
      if (isClosed) {
        if ((morning?.startTime && morning?.endTime) || (afternoon?.startTime && afternoon?.endTime)) {
          return "Closed day should not have morning or afternoon sessions";
        }
        return null;
      }

      const hasMorning = !!(morning?.startTime || morning?.endTime);
      const hasAfternoon = !!(afternoon?.startTime || afternoon?.endTime);
      if (!hasMorning && !hasAfternoon) {
        return "At least one shift (morning or afternoon) is required";
      }

      if (hasMorning) {
        if (!morning?.startTime || !morning?.endTime) {
          return "Both start time and end time are required for morning shift";
        }
        if (!isValidShift(morning.startTime, morning.endTime, "06:00", "12:00")) {
          return "Morning shift must be between 06:00 and 12:00, and start < end";
        }
      }

      if (hasAfternoon) {
        if (!afternoon?.startTime || !afternoon?.endTime) {
          return "Both start time and end time are required for afternoon shift";
        }
        if (!isValidShift(afternoon.startTime, afternoon.endTime, "12:00", "21:00")) {
          return "Afternoon shift must be between 12:00 and 21:00, and start < end";
        }
      }

      return null;
    };

    // ------------------------
    // Build update object & validations per case
    // ------------------------
    let updateData = {
      dentistId,
      morning: morning || { startTime: "", endTime: "" },
      afternoon: afternoon || { startTime: "", endTime: "" },
      isClosed: !!isClosed,
      isFixed: !!isFixed
    };

    // CASE: fixed schedule (isFixed = true) => date must be null
    if (isFixed) {
      const existingFixed = await DentistWorkingTime.findOne({
        dentistId,
        isFixed: true,
        _id: { $ne: id }
      });
      if (existingFixed) {
        return res.status(400).json({ message: "Dentist already has a fixed working schedule" });
      }

      const shiftError = validateShifts();
      if (shiftError) return res.status(400).json({ message: shiftError });

      if (!Array.isArray(workingDays) || workingDays.length === 0) {
        return res.status(400).json({ message: "Working days are required for fixed schedule" });
      }
      const invalidDay = workingDays.find(d => d < 1 || d > 7);
      if (invalidDay) {
        return res.status(400).json({ message: "Working days must be between 1 (Sunday) and 7 (Saturday)" });
      }

      updateData.date = null;
      updateData.isFixed = true;
      updateData.workingDays = workingDays;
    } else {
      // CASE: special schedule => date required and must be >= tomorrow (VN time)
      if (!date) {
        return res.status(400).json({ message: "Date is required for special schedule" });
      }

      const inputDate = new Date(
        new Date(date).toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
      );
      inputDate.setHours(0, 0, 0, 0);

      const todayVN = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
      );
      todayVN.setHours(0, 0, 0, 0);
      const tomorrowVN = new Date(todayVN.getTime() + 24 * 60 * 60 * 1000);

      if (inputDate < tomorrowVN) {
        return res.status(400).json({ message: "Date must be from tomorrow onwards (VN time)" });
      }

      const existingSameDay = await DentistWorkingTime.findOne({
        dentistId,
        date: inputDate,
        _id: { $ne: id }
      });
      if (existingSameDay) {
        return res.status(400).json({ message: "Working time already exists for this date" });
      }

      const shiftError = validateShifts();
      if (shiftError) return res.status(400).json({ message: shiftError });

      updateData.date = inputDate;
      updateData.isFixed = false;
      updateData.workingDays = [];
    }

    // perform update
    const updated = await DentistWorkingTime.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate("dentistId", "fullName email");

    if (!updated) {
      return res.status(404).json({ message: "Working time not found" });
    }

    return res.status(200).json({
      message: "Update dentist working time successfully",
      data: updated
    });
  } catch (error) {
    console.error("Error updating working time:", error);
    return res.status(500).json({ message: error.message });
  }
},

};

module.exports = dentistWorkingTimeController;
