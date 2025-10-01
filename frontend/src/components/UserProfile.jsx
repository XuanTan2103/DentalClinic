import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { User as UserIcon, Mail, Phone, MapPin, Calendar, Stethoscope, GraduationCap, Clock, Heart, Pill, FileText, Award, Briefcase, CalendarDays, X } from "lucide-react";
import styles from "./UserProfile.module.css";

function UserProfile({ isOpen, onClose, userId }) {
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const roleIs = (role, value) => (role || "").toLowerCase() === (value || "").toLowerCase();

  const getRoleDisplayName = (role) => {
    const r = (role || "").toLowerCase();
    switch (r) {
      case "admin": return "Quản trị viên";
      case "staff": return "Nhân viên";
      case "dentist": return "Nha sĩ";
      case "customer": return "Khách hàng";
      default: return role;
    }
  };

  const getRoleBadgeClass = (role) => {
    const r = (role || "").toLowerCase();
    switch (r) {
      case "admin": return "badgeAdmin";
      case "staff": return "badgeStaff";
      case "dentist": return "badgeDentist";
      case "customer": return "badgeCustomer";
      default: return "badgeDefault";
    }
  };

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString("vi-VN") : "";

  const Avatar = ({ src, name }) => {
    const initials = name
      ? name.split(" ").map(n => n[0] || "").join("").slice(0, 2).toUpperCase()
      : "";
    return (
      <div className={styles.avatar}>
        {src ? (
          <img
            src={src}
            alt={name}
            className={styles.avatarImage}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : null}
        {!src && <div className={styles.avatarInitials}>{initials}</div>}
      </div>
    );
  };

  const Badge = ({ children, variant }) => (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {children}
    </span>
  );

  const InfoRow = ({ icon: Icon, label, value, fullWidth }) => (
    <div className={fullWidth ? styles.infoRowFull : styles.infoRow}>
      <div className={styles.infoLabel}>
        {Icon && <Icon className={styles.iconSmall} />}
        <span>{label}</span>
      </div>
      <div className={styles.infoValue}>{value || "Chưa cập nhật"}</div>
    </div>
  );

  const mapDentist = (user, extraInfo, workingTime) => {
    const professionalInfo = {
      specialization: extraInfo?.specialization || "",
      experienceYears: extraInfo?.experienceYears || 0,
      biography: extraInfo?.biography || "",
      education: extraInfo?.education || "",
      awards: extraInfo?.awards || ""
    };
    return {
      ...user,
      professionalInfo,
      workingTime: workingTime || []
    };
  };

  const mapCustomer = (user, extraInfo) => {
    const medicalHistory = {
      allergies: extraInfo?.allergies || extraInfo?.medicalHistory?.allergies || [],
      currentMedications: extraInfo?.currentMedications || extraInfo?.medicalHistory?.currentMedications || [],
      previousTreatments: extraInfo?.previousTreatments || extraInfo?.medicalHistory?.previousTreatments || [],
      lastVisit: extraInfo?.lastVisit || extraInfo?.medicalHistory?.lastVisit || null,
      nextAppointment: extraInfo?.nextAppointment || extraInfo?.medicalHistory?.nextAppointment || null,
    };
    return {
      ...user,
      medicalHistory
    };
  };

  const fetchUser = useCallback(async () => {
    if (!isOpen || !userId) return;
    setLoading(true);
    setData(null);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/user/get-user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const payload = res.data;
      let user = payload.user || null;
      const extraInfo = payload.extraInfo || null;
      const workingTime = payload.workingTime || null;

      if (user) {
        user = {
          ...user,
          phone: user.phoneNumber ?? user.phone ?? "",
          fullName: user.fullName ?? user.name ?? "",
        };

        if (roleIs(user.role, "dentist")) {
          user = mapDentist(user, extraInfo, workingTime);
        } else if (roleIs(user.role, "customer")) {
          user = mapCustomer(user, extraInfo);
        }
      }

      setData({ user, extraInfo });
    } catch (err) {
      console.error("Error fetching user detail:", err);
      setData({ user: null, extraInfo: null });
    } finally {
      setLoading(false);
    }
  }, [isOpen, userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setData(null);
      setActiveTab("basic");
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  if (loading || !data) {
    return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Đang tải thông tin...</p>
          </div>
        </div>
      </div>
    );
  }

  const { user } = data;
  if (!user) {
    return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.errorContainer}>
            <p>Không tìm thấy người dùng</p>
          </div>
        </div>
      </div>
    );
  }

  const BasicInfo = () => (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <UserIcon className={styles.sectionIcon} />
        <h3>Thông tin cơ bản</h3>
      </div>

      <div className={styles.profileHeader}>
        <Avatar src={user.avatar} name={user.fullName} />
        <div className={styles.profileInfo}>
          <h2 className={styles.profileName}>{user.fullName}</h2>
          <Badge variant={getRoleBadgeClass(user.role)}>
            {getRoleDisplayName(user.role)}
          </Badge>
        </div>
      </div>

      <div className={styles.infoGrid}>
        <InfoRow
          icon={Mail}
          label="Email"
          value={user.email}
        />
        <InfoRow
          icon={Phone}
          label="Số điện thoại"
          value={user.phone}
        />
        <InfoRow
          icon={Calendar}
          label="Ngày sinh"
          value={formatDate(user.dateOfBirth)}
        />
        <InfoRow
          icon={UserIcon}
          label="Giới tính"
          value={user.gender === "male" ? "Nam" : user.gender === "female" ? "Nữ" : "Khác"}
        />
      </div>

      <InfoRow
        icon={MapPin}
        label="Địa chỉ"
        value={user.address}
        fullWidth
      />
    </div>
  );

  const MedicalHistory = () => (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <Heart className={styles.sectionIcon} />
        <h3>Thông tin y tế</h3>
      </div>

      <div className={styles.infoGrid}>
        <InfoRow
          icon={Pill}
          label="Dị ứng"
          value={user.medicalHistory?.allergies?.length > 0
            ? user.medicalHistory.allergies.join(", ")
            : "Không có"}
        />
        <InfoRow
          icon={Pill}
          label="Thuốc hiện tại"
          value={user.medicalHistory?.currentMedications?.length > 0
            ? user.medicalHistory.currentMedications.join(", ")
            : "Không có"}
        />
        <InfoRow
          icon={Calendar}
          label="Lần khám cuối"
          value={user.medicalHistory?.lastVisit
            ? formatDate(user.medicalHistory.lastVisit)
            : "Chưa có"}
        />
        <InfoRow
          icon={Calendar}
          label="Lịch hẹn tiếp theo"
          value={user.medicalHistory?.nextAppointment
            ? formatDate(user.medicalHistory.nextAppointment)
            : "Chưa có"}
        />
      </div>

      {user.medicalHistory?.previousTreatments?.length > 0 && (
        <div className={styles.treatmentsSection}>
          <div className={styles.subsectionHeader}>
            <FileText className={styles.iconSmall} />
            <h4>Lịch sử điều trị</h4>
          </div>
          <div className={styles.treatmentsList}>
            {user.medicalHistory.previousTreatments.map((treatment, index) => (
              <div key={index} className={styles.treatmentCard}>
                <div className={styles.treatmentHeader}>
                  <span className={styles.treatmentTitle}>
                    {treatment.treatment || treatment.title || "Điều trị"}
                  </span>
                  <span className={styles.treatmentDate}>
                    {formatDate(treatment.date)}
                  </span>
                </div>
                <div className={styles.treatmentDentist}>
                  Nha sĩ: {treatment.dentist || treatment.doctor || "-"}
                </div>
                {treatment.notes && (
                  <div className={styles.treatmentNotes}>{treatment.notes}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const ProfessionalInfo = () => (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <Stethoscope className={styles.sectionIcon} />
        <h3>Thông tin chuyên môn</h3>
      </div>

      <div className={styles.infoGrid}>
        <InfoRow
          icon={Stethoscope}
          label="Chuyên khoa"
          value={user.professionalInfo?.specialization}
        />
        <InfoRow
          icon={Clock}
          label="Kinh nghiệm"
          value={user.professionalInfo?.experienceYears
            ? `${user.professionalInfo.experienceYears} năm`
            : null}
        />
        <InfoRow
          icon={GraduationCap}
          label="Học vấn"
          value={user.professionalInfo?.education}
        />
        <InfoRow
          icon={Award}
          label="Giải thưởng"
          value={user.professionalInfo?.awards}
        />
      </div>

      {user.professionalInfo?.biography && (
        <div className={styles.biographySection}>
          <div className={styles.subsectionHeader}>
            <UserIcon className={styles.iconSmall} />
            <h4>Tiểu sử</h4>
          </div>
          <div className={styles.biographyText}>
            {user.professionalInfo.biography}
          </div>
        </div>
      )}
    </div>
  );

  const WorkingSchedule = () => {
    const daysOfWeek = {
      1: "Chủ Nhật",
      2: "Thứ Hai",
      3: "Thứ Ba",
      4: "Thứ Tư",
      5: "Thứ Năm",
      6: "Thứ Sáu",
      7: "Thứ Bảy",
    };

    const workingTime = user.workingTime;

    if (!workingTime || !workingTime.workingDays?.length) {
      return (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <CalendarDays className={styles.sectionIcon} />
            <h3>Lịch làm việc</h3>
          </div>
          <div className={styles.emptyState}>Chưa có lịch làm việc</div>
        </div>
      );
    }

    const days = workingTime.workingDays.map((d) => daysOfWeek[d] || `Ngày ${d}`);

    return (
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <CalendarDays className={styles.sectionIcon} />
          <h3>Lịch làm việc cố định</h3>
        </div>

        <div className={styles.scheduleRow}>
          <div>
            <Clock className={styles.scheduleIcon} />
            <span>Giờ làm việc:</span>
          </div>
          {workingTime.morning?.startTime && workingTime.morning?.endTime && (
            <div>
              <span>Sáng: {workingTime.morning.startTime} - {workingTime.morning.endTime}</span>
            </div>
          )}
          {workingTime.afternoon?.startTime && workingTime.afternoon?.endTime && (
            <div>
              <span>Chiều: {workingTime.afternoon.startTime} - {workingTime.afternoon.endTime}</span>
            </div>
          )}
        </div>

        <div className={styles.scheduleRow}>
          <div>
            <CalendarDays className={styles.scheduleIcon} />
            <span>Ngày trong tuần:</span>
          </div>
          <div>
            <span>{days.join(", ")}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderTabs = () => {
    if (roleIs(user.role, "customer")) {
      return (
        <>
          <button
            className={`${styles.tab} ${activeTab === "basic" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("basic")}
          >
            <UserIcon className={styles.tabIcon} />
            <span>Thông tin cơ bản</span>
          </button>
          <button
            className={`${styles.tab} ${activeTab === "medical" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("medical")}
          >
            <Heart className={styles.tabIcon} />
            <span>Thông tin y tế</span>
          </button>
        </>
      );
    }

    if (roleIs(user.role, "dentist")) {
      return (
        <>
          <button
            className={`${styles.tab} ${activeTab === "basic" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("basic")}
          >
            <UserIcon className={styles.tabIcon} />
            <span>Thông tin cơ bản</span>
          </button>
          <button
            className={`${styles.tab} ${activeTab === "professional" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("professional")}
          >
            <Briefcase className={styles.tabIcon} />
            <span>Thông tin chuyên môn</span>
          </button>
          <button
            className={`${styles.tab} ${activeTab === "schedule" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("schedule")}
          >
            <CalendarDays className={styles.tabIcon} />
            <span>Lịch làm việc</span>
          </button>
        </>
      );
    }

    return null;
  };

  const renderContent = () => {
    if (activeTab === "basic") return <BasicInfo />;
    if (activeTab === "medical") return <MedicalHistory />;
    if (activeTab === "professional") return <ProfessionalInfo />;
    if (activeTab === "schedule") return <WorkingSchedule />;
    return <BasicInfo />;
  };

  const hasMultipleTabs = roleIs(user.role, "customer") || roleIs(user.role, "dentist");

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={24} />
        </button>

        <div className={styles.modalHeader}>
          <h2>Thông tin người dùng</h2>
        </div>

        {hasMultipleTabs && (
          <div className={styles.tabs}>
            {renderTabs()}
          </div>
        )}

        <div className={styles.modalBody}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;