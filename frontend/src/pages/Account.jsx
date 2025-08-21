import { useState } from "react";
import styles from "./Account.module.css";
import Sidebar from "../components/Sidebar";

const mockUsers = [
    {
        id: 1,
        name: "Nguyễn Văn An",
        email: "an.nguyen@email.com",
        phone: "0901234567",
        role: "Admin",
        status: "active",
        createdAt: "15/1/2024",
        avatar: "N",
    },
    {
        id: 2,
        name: "Trần Thị Bình",
        email: "binh.tran@email.com",
        phone: "0902345678",
        role: "User",
        status: "active",
        createdAt: "16/1/2024",
        avatar: "T",
    },
    {
        id: 3,
        name: "Lê Văn Cường",
        email: "cuong.le@email.com",
        phone: "0903456789",
        role: "Moderator",
        status: "inactive",
        createdAt: "17/1/2024",
        avatar: "L",
    },
]

function Account() {
    const [users, setUsers] = useState(mockUsers)
    const [searchTerm, setSearchTerm] = useState("")
    const [activeDropdown, setActiveDropdown] = useState(null)

    const activeUsers = users.filter((user) => user.status === "active").length
    const inactiveUsers = users.filter((user) => user.status === "inactive").length

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleStatusToggle = (userId) => {
        setUsers(
            users.map((user) =>
                user.id === userId ? { ...user, status: user.status === "active" ? "inactive" : "active" } : user,
            ),
        )
        setActiveDropdown(null)
    }

    const handleDelete = (userId) => {
        setUsers(users.filter((user) => user.id !== userId))
        setActiveDropdown(null)
    }

    return (
        <div className={styles.account}>
                <Sidebar />
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Quản lý người dùng</h1>
                        <p className={styles.subtitle}>Quản lý tài khoản và quyền hạn người dùng</p>
                    </div>
                    <button className={styles.addButton}>+ Thêm người dùng</button>
                </div>

                {/* Stats Cards */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </div>
                        <div>
                            <div className={styles.statNumber}>{users.length}</div>
                            <div className={styles.statLabel}>Tổng người dùng</div>
                            <div className={styles.statChange}>+2 từ tháng trước</div>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={`${styles.statIcon} ${styles.activeIcon}`}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <circle cx="17" cy="7" r="2" fill="currentColor" />
                            </svg>
                        </div>
                        <div>
                            <div className={styles.statNumber}>{activeUsers}</div>
                            <div className={styles.statLabel}>Đang hoạt động</div>
                            <div className={styles.statChange}>75% tổng số</div>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={`${styles.statIcon} ${styles.inactiveIcon}`}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <line x1="17" y1="8" x2="22" y2="13" />
                                <line x1="22" y1="8" x2="17" y2="13" />
                            </svg>
                        </div>
                        <div>
                            <div className={styles.statNumber}>{inactiveUsers}</div>
                            <div className={styles.statLabel}>Tạm khóa</div>
                            <div className={styles.statChange}>25% tổng số</div>
                        </div>
                    </div>
                </div>

                {/* User Table Section */}
                <div className={styles.tableSection}>
                    <div className={styles.tableSectionHeader}>
                        <div>
                            <h2 className={styles.tableSectionTitle}>Danh sách người dùng</h2>
                            <p className={styles.tableSectionSubtitle}>Quản lý và theo dõi thông tin người dùng</p>
                        </div>
                        <div className={styles.tableControls}>
                            <div className={styles.searchContainer}>
                                <svg
                                    className={styles.searchIcon}
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.35-4.35" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm người dùng..."
                                    className={styles.searchInput}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className={styles.filterContainer}>
                                <svg
                                    className={styles.filterIcon}
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
                                </svg>
                                <select className={styles.filterSelect}>
                                    <option>Tất cả</option>
                                    <option>Hoạt động</option>
                                    <option>Tạm khóa</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Người dùng</th>
                                    <th>Liên hệ</th>
                                    <th>Vai trò</th>
                                    <th>Trạng thái</th>
                                    <th>Ngày tạo</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className={styles.userInfo}>
                                                <div className={styles.avatar}>{user.avatar}</div>
                                                <span className={styles.userName}>{user.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.contactInfo}>
                                                <div className={styles.email}>{user.email}</div>
                                                <div className={styles.phone}>{user.phone}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`${styles.roleBadge} ${styles[user.role.toLowerCase()]}`}>{user.role}</span>
                                        </td>
                                        <td>
                                            <span
                                                className={`${styles.statusBadge} ${user.status === "active" ? styles.active : styles.inactive}`}
                                            >
                                                {user.status === "active" ? "Hoạt động" : "Tạm khóa"}
                                            </span>
                                        </td>
                                        <td className={styles.dateCell}>{user.createdAt}</td>
                                        <td>
                                            <div className={styles.actionContainer}>
                                                <button
                                                    className={styles.actionButton}
                                                    onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                                                >
                                                    <svg
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                    >
                                                        <circle cx="12" cy="12" r="1" />
                                                        <circle cx="12" cy="5" r="1" />
                                                        <circle cx="12" cy="19" r="1" />
                                                    </svg>
                                                </button>
                                                {activeDropdown === user.id && (
                                                    <div className={styles.dropdown}>
                                                        <button className={styles.dropdownItem}>
                                                            <svg
                                                                width="14"
                                                                height="14"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                            >
                                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                            </svg>
                                                            Chỉnh sửa
                                                        </button>
                                                        <button className={styles.dropdownItem} onClick={() => handleStatusToggle(user.id)}>
                                                            <svg
                                                                width="14"
                                                                height="14"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                            >
                                                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                                                <circle cx="9" cy="7" r="4" />
                                                                <line x1="17" y1="8" x2="22" y2="13" />
                                                                <line x1="22" y1="8" x2="17" y2="13" />
                                                            </svg>
                                                            {user.status === "active" ? "Tạm khóa" : "Kích hoạt"}
                                                        </button>
                                                        <button
                                                            className={`${styles.dropdownItem} ${styles.deleteItem}`}
                                                            onClick={() => handleDelete(user.id)}
                                                        >
                                                            <svg
                                                                width="14"
                                                                height="14"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                            >
                                                                <polyline points="3,6 5,6 21,6" />
                                                                <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6" />
                                                            </svg>
                                                            Xóa
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Account;
