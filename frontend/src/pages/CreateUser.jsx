import React, { useState } from 'react';
import styles from './CreateUser.module.css';
import axios from 'axios';


function CreateUser({ isOpen, onClose, onSuccess, openNotification }) {

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        gender: '',
        dateOfBirth: '',
        address: '',
        role: ''
    });
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});


    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            await axios.post("http://localhost:5000/user/create-user", formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
            openNotification("success", "User created successfully.");
            if (onSuccess) onSuccess();
            setFormData({
                fullName: '',
                email: '',
                phoneNumber: '',
                gender: '',
                dateOfBirth: '',
                address: '',
                role: '',
            });
            onClose();
            setFieldErrors({});
        } catch (error) {
            console.error("Failed to create user:", error)
            if (error.response && error.response.data) {
                if (error.response.data.errors && error.response.data.errors.length > 0) {
                    const backendErrors = {};
                    error.response.data.errors.forEach(err => {
                        backendErrors[err.path] = err.msg;
                    });
                    setFieldErrors(backendErrors);
                    openNotification("error", error.response.data.errors[0].msg);
                } else if (error.response.data.message) {
                    openNotification("error", error.response.data.message);
                } else {
                    openNotification("error", "Failed to create user!");
                }
            } else {
                openNotification("error", "Failed to create user!");
            }
        } finally {
            setLoading(false)
        }
    }


    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Create New User</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="email">
                                Email <span className={styles.star}>*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                className={`${styles.input} ${fieldErrors.email ? styles.inputError : ""}`}
                                placeholder="Enter email"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="fullName">
                                Full name <span className={styles.star}>*</span>
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={(e) => handleInputChange("fullName", e.target.value)}
                                className={`${styles.input} ${fieldErrors.fullName ? styles.inputError : ""}`}
                                placeholder="enter full name"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="phoneNumber">
                                Phone number <span className={styles.star}>*</span>
                            </label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                                className={`${styles.input} ${fieldErrors.phoneNumber ? styles.inputError : ""}`}
                                placeholder="Enter phone number"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="gender">
                                Gender <span className={styles.star}>*</span>
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={(e) => handleInputChange("gender", e.target.value)}
                                className={`${styles.select} ${fieldErrors.gender ? styles.inputError : ""}`}
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="dateOfBirth">
                                Date off birth <span className={styles.star}>*</span>
                            </label>
                            <input
                                type="date"
                                id="dateOfBirth"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                                className={`${styles.input} ${fieldErrors.dateOfBirth ? styles.inputError : ""}`}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="role">
                                Role <span className={styles.star}>*</span>
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={(e) => handleInputChange("role", e.target.value)}
                                className={`${styles.select} ${fieldErrors.role ? styles.inputError : ""}`}
                            >
                                <option value="">Select role</option>
                                <option value="Admin">Admin</option>
                                <option value="Staff">Staff</option>
                                <option value="Dentist">Dentist</option>
                                <option value="Customer">Customer</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.formGroupFull}>
                        <label className={styles.label} htmlFor="address">
                            Address <span className={styles.star}>*</span>
                        </label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            rows={3}
                            className={`${styles.input} ${fieldErrors.address ? styles.inputError : ""}`}
                            placeholder="Enter full address"
                        />
                    </div>

                    <div className={styles.footer}>
                        <button type="button" className={styles.cancelButton} onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className={`${styles.submitButton} ${loading ? styles.loading : ""}`}>
                            {loading ? (
                                <span className={styles.spinner}></span>
                            ) : (
                                "Create User"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateUser;