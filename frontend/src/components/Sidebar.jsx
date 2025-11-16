import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { Users, BarChart3, Mailbox, Album, Mail, ChevronLeft, TicketPercent, ChevronRight, LogOut, User, ScrollText, Calendar1, CalendarCheck, Wallet, Pill, ClipboardPlus } from "lucide-react";
import axios from 'axios';
import ConfirmDialog from './ConfirmDialog';

const adminItems = [
    { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "Accounts", href: "/accounts" },
    { icon: ScrollText, label: "Services", href: "/manage-service" },
    { icon: Calendar1, label: "Dentist working time", href: "/dentist-working-time" },
    { icon: Album , label: "Dentist profile", href: "/dentist-profile" },
    { icon: CalendarCheck, label: "Appointment", href: "/appointment" },
    { icon: ClipboardPlus, label: "Medical record", href: "/medical-record" },
    { icon: Wallet, label: "Payment", href: "/payment" },
    { icon: Pill, label: "Medicine", href: "/manage-medicine" },
    { icon: TicketPercent, label: "Promotion", href: "/promotion" },
    { icon: Mailbox, label: "Review", href: "/review" },
];

const staffItems = [
    { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "Accounts", href: "/accounts" },
    { icon: Mail, label: "Messenger", href: "/messenger" },
    { icon: Calendar1, label: "Dentist working time", href: "/dentist-working-time" },
    { icon: CalendarCheck, label: "Appointment", href: "/appointment" },
    { icon: Wallet, label: "Payment", href: "/payment" },
    { icon: ScrollText, label: "Services", href: "/manage-service" },
    { icon: Pill, label: "Medicine", href: "/manage-medicine" },
];

const dentistItems = [
    { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "Accounts", href: "/accounts" },
    { icon: CalendarCheck, label: "Appointment", href: "/appointment" },
    { icon: ClipboardPlus, label: "Medical record", href: "/medical-record" },
    { icon: ScrollText, label: "Services", href: "/manage-service" },
    { icon: Pill, label: "Medicine", href: "/manage-medicine" },
];

function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === "Admin") {
                setMenuItems(adminItems);
            } else if (user.role === "Staff") {
                setMenuItems(staffItems);
            } else {
                setMenuItems(dentistItems);
            }
        }
    }, [user]);

    const onToggle = () => {
        setCollapsed(!collapsed);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    }

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

    return (
        <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
            {/* Header with toggle button */}
            <div className={styles.header}>
                {!collapsed && (
                    <div className={styles.titleContainer}>
                        <img src="https://img.icons8.com/external-others-phat-plus/45/external-dental-odontologist-color-line-others-phat-plus.png" alt="" />
                        <h2 className={styles.title}>Gentle Care Dental</h2>
                    </div>
                )}
                <button
                    className={styles.toggleButton}
                    onClick={onToggle}
                    title={collapsed ? "Expand menu" : "Collapse menu"}
                >
                    {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* Navigation Menu */}
            <nav className={styles.nav}>
                <ul className={styles.menuList}>
                    {menuItems.map((item, index) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <li key={index}>
                                <Link
                                    to={item.href}
                                    className={`${styles.menuItem} ${isActive ? styles.active : ''}`}
                                >
                                    <item.icon size={20} className={styles.menuIcon} />
                                    {!collapsed && <span className={styles.menuLabel}>{item.label}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User section at bottom */}
            <div className={styles.userSection}>
                <div className={styles.userInfo}>
                    <div className={styles.avatar}>
                        {user && user.avatar ? (
                            <img src={user.avatar} alt="User Avatar" className={styles.userAvatar} />
                        ) : (
                            <User size={20} className={styles.defaultAvatar} />
                        )}
                    </div>
                    {!collapsed && (
                        <div className={styles.userDetails}>
                            <span className={styles.userName}>{user?.fullName}</span>
                            <span className={styles.userRole}>{user?.role}</span>
                        </div>
                    )}
                    {!collapsed && (
                        <ConfirmDialog
                            title="Confirm logout"
                            description={`Are you sure you want to Logout?`}
                            onConfirm={() => handleLogout()}>
                            <button className={styles.logoutButton} title="Logout">
                                <LogOut size={18} />
                            </button>
                        </ConfirmDialog>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Sidebar;