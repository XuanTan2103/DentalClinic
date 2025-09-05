import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./Profile.module.css";
import Header from "../components/Header";
import axios from "axios";
import { notification } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { LogOut } from "lucide-react";
import Swal from "sweetalert2";
import UpdateProfile from "./UpdateProfile";
import UpdatePhoto from "../components/UpdatePhoto";

function Profile() {
    const [activeView, setActiveView] = useState("records");
    const [user, setUser] = useState({});
    const [api, contextHolder] = notification.useNotification();
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPhoto, setCurrentPhoto] = useState({});
    const navigate = useNavigate();

    const openNotification = (type, detailMessage = "") => {
        if (type === "success") {
            api.open({
                message: "Action successful!",
                description: detailMessage,
                showProgress: true,
                pauseOnHover: true,
                icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
            });
        } else {
            api.open({
                message: "Action failed!",
                description: detailMessage,
                showProgress: true,
                pauseOnHover: true,
                icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
            });
        }
    };

    useEffect(() => {
        fetchPforile();
    }, []);

    const fetchPforile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/user/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(response.data.user);
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    }

    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out of the system.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, logout",
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("token");
                navigate("/");
                Swal.fire("Logged out!", "You have been logged out successfully.", "success");
            }
        });
    };

    const medicalRecords = [
        {
            id: 1,
            title: "Tẩy trắng răng",
            doctor: "Bác sĩ Nguyễn Minh Đức",
            description: "Tẩy trắng răng toàn hàm bằng công nghệ Zoom WhiteSpeed",
            date: "2024-03-15",
            cost: "2,500,000 VND",
            status: "Hoàn thành",
            note: "Bệnh nhân cần tránh thức phẩm có màu trong 48h",
        },
        {
            id: 2,
            title: "Trám răng",
            doctor: "Bác sĩ Trần Thị Mai",
            description: "Trám composite răng số 6 hàm dưới",
            date: "2024-02-20",
            cost: "800,000 VND",
            status: "Hoàn thành",
            note: "Tái khám sau 6 tháng",
        },
        {
            id: 3,
            title: "Khám tổng quát",
            doctor: "Bác sĩ Lê Văn Hùng",
            description: "Khám định kỳ 6 tháng, lấy cao răng",
            date: "2024-01-10",
            cost: "500,000 VND",
            status: "Hoàn thành",
            note: "Tình trạng răng miệng tốt",
        },
    ]

    const appointments = [
        {
            id: 1,
            title: "Khám định kỳ",
            doctor: "Bác sĩ Nguyễn Minh Đức",
            description: "Khám tổng quát và vệ sinh răng miệng",
            date: "2024-04-15",
            time: "09:00",
            status: "Đã đặt",
            type: "Khám định kỳ",
        },
        {
            id: 2,
            title: "Tái khám trám răng",
            doctor: "Bác sĩ Trần Thị Mai",
            description: "Kiểm tra tình trạng răng đã trám",
            date: "2024-04-20",
            time: "14:30",
            status: "Chờ xác nhận",
            type: "Tái khám",
        },
        {
            id: 3,
            title: "Tư vấn niềng răng",
            doctor: "Bác sĩ Lê Văn Hùng",
            description: "Tư vấn phương pháp niềng răng phù hợp",
            date: "2024-05-05",
            time: "10:15",
            status: "Đã đặt",
            type: "Tư vấn",
        },
    ]

    return (
        <div>
            {contextHolder}
            <Header />
            <div className={styles.container}>
                {/* Patient Information Card */}
                <div className={styles.patientCard}>
                    <div className={styles.avatar}>
                        <img className={styles.avatarImg} src={user.avatar} alt="Avatar" />
                        <img onClick={() => { setIsModalOpen(true); setCurrentPhoto(user.avatar); }} className={styles.changeAvatarBtn} width="20" height="20" src="https://img.icons8.com/emoji/20/camera-emoji.png" alt="camera-emoji" />
                        <UpdatePhoto
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            currentPhoto={currentPhoto}
                            onSuccess={(newPhotoUrl) => { setCurrentPhoto(newPhotoUrl); fetchPforile(); }}
                            openNotification={openNotification}
                        />
                    </div>

                    <h2 className={styles.patientName}>{user.fullName}</h2>
                    <p className={styles.patientId}>Role: {user.role}</p>

                    <div className={styles.contactInfo}>
                        <div className={styles.contactItem}>
                            <img width="20" height="20" src="https://img.icons8.com/fluency/20/mail.png" alt="mail" />
                            <span>{user.email}</span>
                        </div>
                        <div className={styles.contactItem}>
                            <img width="20" height="20" src="https://img.icons8.com/ios-filled/25/FA5252/phone.png" alt="phone" />
                            <span>{user.phoneNumber}</span>
                        </div>
                        <div className={styles.contactItem}>
                            <img width="20" height="20" src="https://img.icons8.com/color-glass/25/order-delivered.png" alt="order-delivered" />
                            <span>{user.address}</span>
                        </div>
                        <div className={styles.contactItem}>
                            <img width="20" height="20" src="https://img.icons8.com/color-glass/25/birth-date.png" alt="birth-date" />
                            <span>Date of birth: {new Date(user.dateOfBirth).toLocaleDateString("vi-VN")}</span>
                        </div>
                        <div className={styles.contactItem}>
                            <img width="20" height="20" src="https://img.icons8.com/dusk/25/gender.png" alt="gender" />
                            <span>Gender: {user.gender}</span>
                        </div>
                    </div>
                    <div className={styles.buttonContainer}>
                        <button className={styles.changePasswordBtn} onClick={() => navigate('/change-password')}>Change password</button>
                        <button className={styles.editProfileBtn} onClick={() => setOpenUpdateModal(true)}>Update profile</button>
                        <UpdateProfile user={user} isOpen={openUpdateModal} onClose={() => setOpenUpdateModal(false)} openNotification={openNotification} onSuccess={() => { fetchPforile() }} />
                        <button className={styles.logoutBtn} onClick={handleLogout}><LogOut size={16} />Logout</button>
                    </div>
                </div>

                {/* Medical Records */}
                <div className={styles.medicalRecords}>
                    <div className={styles.recordsHeader}>
                        <h2 className={styles.recordsTitle}>
                            <span className={styles.fileIcon}>📋</span>
                            {activeView === "records" ? "Hồ Sơ Y Tế" : "Lịch Hẹn"}
                        </h2>
                        <div className={styles.headerButtons}>
                            <button
                                className={`${styles.scheduleBtn} ${activeView === "records" ? styles.active : ""}`}
                                onClick={() => setActiveView("records")}
                            >
                                <span className={styles.clockIcon}>🕐</span>
                                Lịch Sử Khám
                            </button>
                            <button
                                className={`${styles.appointmentBtn} ${activeView === "appointments" ? styles.active : ""}`}
                                onClick={() => setActiveView("appointments")}
                            >
                                <span className={styles.calendarIcon}>📅</span>
                                Lịch Hẹn
                            </button>
                        </div>
                    </div>

                    {activeView === "records" && (
                        <div className={styles.recordsList}>
                            {medicalRecords.map((record) => (
                                <div key={record.id} className={styles.recordCard}>
                                    <div className={styles.recordHeader}>
                                        <h3 className={styles.recordTitle}>{record.title}</h3>
                                        <span className={styles.statusBadge}>{record.status}</span>
                                    </div>

                                    <p className={styles.doctorName}>{record.doctor}</p>
                                    <p className={styles.recordDescription}>{record.description}</p>

                                    <div className={styles.recordDetails}>
                                        <div className={styles.recordDate}>
                                            <span className={styles.dateIcon}>📅</span>
                                            <span>{record.date}</span>
                                        </div>
                                        <div className={styles.recordCost}>
                                            Chi phí: <strong>{record.cost}</strong>
                                        </div>
                                    </div>

                                    <div className={styles.recordNote}>
                                        <span className={styles.noteLabel}>Ghi chú:</span>
                                        <span className={styles.noteText}>{record.note}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeView === "appointments" && (
                        <div className={styles.appointmentsList}>
                            {appointments.map((appointment) => (
                                <div key={appointment.id} className={styles.appointmentCard}>
                                    <div className={styles.appointmentHeader}>
                                        <h3 className={styles.appointmentTitle}>{appointment.title}</h3>
                                        <span
                                            className={`${styles.appointmentStatus} ${styles[appointment.status.replace(/\s+/g, "").toLowerCase()]}`}
                                        >
                                            {appointment.status}
                                        </span>
                                    </div>

                                    <p className={styles.doctorName}>{appointment.doctor}</p>
                                    <p className={styles.appointmentDescription}>{appointment.description}</p>

                                    <div className={styles.appointmentDetails}>
                                        <div className={styles.appointmentDateTime}>
                                            <span className={styles.dateIcon}>📅</span>
                                            <span>{appointment.date}</span>
                                            <span className={styles.timeIcon}>🕐</span>
                                            <span>{appointment.time}</span>
                                        </div>
                                        <div className={styles.appointmentType}>
                                            Loại: <strong>{appointment.type}</strong>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile;
