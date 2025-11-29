import { useState, useEffect } from 'react';
import styles from './EditUser.module.css';
import axios from 'axios';
import { Select } from 'antd';

const EditUser = ({ isOpen, onClose, userId, onSuccess, openNotification }) => {
    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        phoneNumber: '',
        gender: '',
        dateOfBirth: '',
        address: '',
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen || !userId) return;

        const fetchUser = async () => {
            try {
                setLoading(true);

                const token = localStorage.getItem('token');

                const res = await axios.get(
                    `http://localhost:5000/user/get-user/${userId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                const user = res.data.user;

                setFormData({
                    email: user.email || '',
                    fullName: user.fullName || '',
                    phoneNumber: user.phoneNumber || '',
                    gender: user.gender || '',
                    dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
                    address: user.address || '',
                });

                setAvatarPreview(user.avatar || '');
            } catch (err) {
                console.log('Fetch user error:', err);
                const msg = err.response?.data?.message || 'Failed to load user';
                if (openNotification) {
                    openNotification('error', msg);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [isOpen, userId, openNotification]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');

            const formDataToSend = new FormData();

            Object.keys(formData).forEach((key) => {
                if (formData[key]) {
                    formDataToSend.append(key, formData[key]);
                }
            });

            if (avatarFile) {
                formDataToSend.append('avatar', avatarFile);
            }

            const res = await axios.patch(
                `http://localhost:5000/user/update-user/${userId}`,
                formDataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (onSuccess) onSuccess(res.data.user);

            if (openNotification) {
                openNotification('success', 'User updated successfully');
            }

            onClose();
        } catch (err) {
            console.log('Update user error:', err);
            const msg =
                err.response?.data?.message ||
                err.response?.data?.errors?.[0]?.msg ||
                err.message ||
                'Failed to update user';

            if (openNotification) {
                openNotification('error', msg);
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={loading ? undefined : onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Edit User</h2>
                    <button className={styles.closeBtn} onClick={onClose} disabled={loading}>
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.avatarSection}>
                        <div className={styles.avatarPreview}>
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar preview" />
                            ) : (
                                <div className={styles.avatarPlaceholder}>No Avatar</div>
                            )}
                        </div>

                        <label className={styles.avatarLabel}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className={styles.fileInput}
                                disabled={loading}
                            />
                            <span className={styles.uploadBtn}>Choose Avatar</span>
                        </label>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Email</label>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Full Name</label>
                        <input
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Phone Number</label>
                        <input
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Gender</label>
                        <Select
                            className={styles.select}
                            name="gender"
                            value={formData.gender}
                            onChange={(value) => handleChange({ target: { name: "gender", value } })}
                            disabled={loading}
                            placeholder="Select gender"
                        >
                            <Select.Option value="male">Male</Select.Option>
                            <Select.Option value="female">Female</Select.Option>
                            <Select.Option value="other">Other</Select.Option>
                        </Select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Date of Birth</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Address</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            className={styles.cancelBtn}
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUser;