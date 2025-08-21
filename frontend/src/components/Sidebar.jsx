import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { Home, Users, BarChart3, Settings, FileText, Mail, ChevronLeft, ChevronRight, LogOut, User, ScrollText } from "lucide-react"

function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    const onToggle = () => {
        setCollapsed(!collapsed);
    };
    
    const menuItems = [
        { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
        { icon: Users, label: "Accounts", href: "/accounts" },
        { icon: ScrollText, label: "Services", href: "/manage-service" },
        { icon: FileText, label: "Báo cáo", href: "/reports" },
        { icon: Mail, label: "Tin nhắn", href: "/messages" },
        { icon: Settings, label: "Cài đặt", href: "/settings" },
    ];

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
                         <User size={20} />
                     </div>
                     {!collapsed && (
                         <div className={styles.userDetails}>
                             <span className={styles.userName}>Nguyễn Văn A</span>
                             <span className={styles.userRole}>Quản trị viên</span>
                         </div>
                     )}
                     {!collapsed && (
                        <button className={styles.logoutButton} title="Logout">
                            <LogOut size={18} />
                        </button>
                     )}
                 </div>
             </div>
        </div>
    )
}

export default Sidebar;