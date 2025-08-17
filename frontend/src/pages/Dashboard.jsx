import React from 'react';
import styles from './Dashboard.module.css';
import Sidebar from '../components/Sidebar';

function Dashboard() {
    return(
        <div className={styles.dashboard}>
            <Sidebar />
            <div className={styles.mainContent}>
                <header className={styles.header}>
                    <h1>Dashboard</h1>
                    <div className={styles.headerActions}>
                        <button className={styles.notificationButton}>🔔</button>
                    </div>
                </header>
                
                <main className={styles.main}>
                    <div className={styles.content}>
                        <h2>Chào mừng đến với hệ thống quản lý phòng khám nha khoa</h2>
                        <div className={styles.statsGrid}>
                            <div className={styles.statCard}>
                                <h3>Lịch hẹn hôm nay</h3>
                                <p className={styles.statNumber}>12</p>
                            </div>
                            <div className={styles.statCard}>
                                <h3>Bệnh nhân mới</h3>
                                <p className={styles.statNumber}>5</p>
                            </div>
                            <div className={styles.statCard}>
                                <h3>Doanh thu tháng</h3>
                                <p className={styles.statNumber}>15.5M</p>
                            </div>
                            <div className={styles.statCard}>
                                <h3>Đánh giá trung bình</h3>
                                <p className={styles.statNumber}>4.8</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Dashboard;
