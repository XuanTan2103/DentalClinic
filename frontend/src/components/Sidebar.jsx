import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { Users, BarChart3, Settings, FileText, Mail, ChevronLeft, ChevronRight, LogOut, User, ScrollText, Calendar1 } from "lucide-react";
import Swal from "sweetalert2";
import axios from 'axios';

const adminItems = [
    { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "Accounts", href: "/accounts" },
    { icon: ScrollText, label: "Services", href: "/manage-service" },
    { icon: Calendar1, label: "Dentist working time", href: "/dentist-working-time" },
    { icon: FileText, label: "Báo cáo", href: "/reports" },
    { icon: Settings, label: "Cài đặt", href: "/settings" },
];

const staffItems = [
    { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "Accounts", href: "/accounts" },
    { icon: FileText, label: "Báo cáo", href: "/reports" },
    { icon: Mail, label: "Messenger", href: "/messenger" },
    { icon: Settings, label: "Cài đặt", href: "/settings" },
];

const dentistItems = [
    { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "Accounts", href: "/accounts" },
    { icon: FileText, label: "Báo cáo", href: "/reports" },
    { icon: Settings, label: "Cài đặt", href: "/settings" },
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
                        <button onClick={handleLogout} className={styles.logoutButton} title="Logout">
                            <LogOut size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Sidebar;