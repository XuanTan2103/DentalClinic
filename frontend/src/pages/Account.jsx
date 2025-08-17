import React from "react";
import styles from './Account.module.css';
import Sidebar from "../components/Sidebar";

function Account() {
    return (
        <div className={styles.account}>
            <Sidebar />
            <div className={styles.mainContent}>
                <header className={styles.header}>
                    <h1>Accounts</h1>
                    <div className={styles.headerActions}>
                        <button className={styles.notificationButton}>🔔</button>
                    </div>
                </header>


            </div>
        </div>
    )
}

export default Account;