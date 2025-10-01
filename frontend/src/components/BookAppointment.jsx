import React, { useState, useEffect } from 'react';
import { X, User, Stethoscope, Calendar, Clock, FileText } from 'lucide-react';
import styles from "./BookAppointment.module.css";


const services = [
    { id: 'general', name: 'Khám tổng quát', duration: 30 },
    { id: 'cleaning', name: 'Vệ sinh răng miệng', duration: 45 },
    { id: 'filling', name: 'Hàn răng', duration: 60 },
    { id: 'extraction', name: 'Nhổ răng', duration: 90 },
    { id: 'root-canal', name: 'Điều trị tủy', duration: 120 },
    { id: 'crown', name: 'Bọc răng sứ', duration: 90 },
];

function BookAppointment({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        doctor: '',
        service: '',
        date: '',
        startTime: '',
        endTime: '',
        notes: ''
    });

    // Tính toán thời gian kết thúc khi service hoặc startTime thay đổi
    useEffect(() => {
        if (formData.service && formData.startTime) {
            const selectedService = services.find(s => s.id === formData.service);
            if (selectedService) {
                const [hours, minutes] = formData.startTime.split(':').map(Number);
                const startDate = new Date();
                startDate.setHours(hours, minutes, 0, 0);

                const endDate = new Date(startDate.getTime() + selectedService.duration * 60000);
                const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;

                setFormData(prev => ({
                    ...prev,
                    endTime: endTime
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                endTime: ''
            }));
        }
    }, [formData.service, formData.startTime]);

    const handleClose = () => {
        onClose();
    };

    const handleSubmit = () => {
        console.log('Thông tin đặt lịch:', formData);
        const selectedService = services.find(s => s.id === formData.service);
        if (selectedService) {
            console.log('Thời gian dịch vụ:', selectedService.duration, 'phút');
        }
        // Handle form submission here
        alert('Đặt lịch thành công!');
        onClose();
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const isFormValid = () => {
        return formData.doctor && formData.service && formData.date && formData.startTime;
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={handleClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.headerTitle}>
                        <Stethoscope size={24} />
                        Book a dental appointment
                    </h2>
                    <button className={styles.closeButton} onClick={handleClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.body}>
                    {/* Choose a doctor */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            <User size={16} />
                            Choose a doctor
                        </label>
                        <select
                            className={styles.select}
                            value={formData.doctor}
                            onChange={e => handleInputChange('doctor', e.target.value)}
                        >
                            <option value="">Choose a doctor</option>
                            <option value="dr-nguyen">BS. Nguyễn Văn An</option>
                            <option value="dr-tran">BS. Trần Thị Bình</option>
                            <option value="dr-le">BS. Lê Văn Công</option>
                            <option value="dr-pham">BS. Phạm Thị Dung</option>
                        </select>
                    </div>

                    {/* Select service */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            <Stethoscope size={16} />
                            Select service
                        </label>
                        <select
                            className={styles.select}
                            value={formData.service}
                            onChange={e => handleInputChange('service', e.target.value)}
                        >
                            <option value="">Select service</option>
                            {services.map(service => (
                                <option key={service.id} value={service.id}>
                                    {service.name} ({service.duration} minute)
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date and Time */}
                    <div className={styles.dateTimeRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                <Calendar size={16} />
                                Date
                            </label>
                            <input
                                type="date"
                                className={styles.input}
                                value={formData.date}
                                onChange={e => handleInputChange('date', e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                <Clock size={16} />
                                Start time
                            </label>
                            <input
                                type="time"
                                className={styles.input}
                                value={formData.startTime}
                                onChange={e => handleInputChange('startTime', e.target.value)}
                                min="08:00"
                                max="17:00"
                                step="900"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                <Clock size={16} />
                                End time
                            </label>
                            <div className={styles.timeDisplay}>
                                {formData.endTime || '--:--'}
                            </div>
                        </div>
                    </div>

                    {/* Ghi chú */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            <FileText size={16} />
                            Notes (optional)
                        </label>
                        <textarea
                            placeholder="Additional notes about condition or special request..."
                            className={styles.textarea}
                            value={formData.notes}
                            onChange={e => handleInputChange('notes', e.target.value)}
                            rows={3}
                        />
                    </div>
                </div>

                <div className={styles.footer}>
                    <button
                        className={`${styles.button} ${styles.cancelButton}`}
                        onClick={handleClose}
                    >
                        Cancel
                    </button>
                    <button
                        className={`${styles.button} ${styles.confirmButton} ${!isFormValid() ? styles.disabledButton : ''}`}
                        onClick={handleSubmit}
                        disabled={!isFormValid()}
                    >
                        Confirm appointment
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BookAppointment;