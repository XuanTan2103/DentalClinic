import { useState, useEffect, useCallback } from 'react';
import styles from './Appointment.module.css';
import Sidebar from "../components/Sidebar";
import { CalendarCheck, Trash2, X } from 'lucide-react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { notification } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import ConfirmDelete from "../components/ConfirmDelete";
import ConfirmDialog from "../components/ConfirmDialog";
import AppointmentDetail from '../components/AppointmentDetail';
import BookAppointment from '../components/BookAppointment';

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [dentistSearch, setDentistSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [api, contextHolder] = notification.useNotification();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [appointmentToReject, setAppointmentToReject] = useState(null);
  const [role, setRole] = useState(null);
  const [isOpenBookAppointmentModal, setIsOpenBookAppointmentModal] = useState(false);

  const filteredAppointments = appointments
    .filter((appointment) => {
      const customerName = appointment.customer?.fullName?.toLowerCase() || '';
      const dentistName = appointment.dentist?.fullName?.toLowerCase() || '';
      const matchesCustomer = customerName.includes(customerSearch.toLowerCase());
      const matchesDentist = dentistName.includes(dentistSearch.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || appointment.status === statusFilter;
      return matchesCustomer && matchesDentist && matchesStatus;
    })
    .sort((a, b) => {
      const createdA = new Date(a.createdAt).getTime();
      const createdB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? createdB - createdA : createdA - createdB;
    });

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

  const handleViewDetail = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setIsModalOpen(true);
  };

  const fetchAppointments = useCallback(async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const decoded = jwtDecode(token);
      setRole(decoded.role);
      const headers = { Authorization: `Bearer ${token}` };

      try {
        if (decoded.role === 'Dentist') {
          const res = await axios.get('http://localhost:5000/appointment/get-appointments-by-dentist', { headers });
          setAppointments(res.data?.data || []);
        } else {
          const res = await axios.get('http://localhost:5000/appointment/get-all-appointments', { headers });
          setAppointments(res.data?.data || []);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    },[]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);


  const handleConfirm = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/appointment/confirm-appointment/${id}`, { status: 'confirmed' }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setAppointments((prev) =>
        prev.map((apt) =>
          apt._id === id ? { ...apt, status: 'confirmed' } : apt
        )
      );
      openNotification("success", "Appointment confirmed successfully.");
    } catch (error) {
      console.error('Error confirming appointment:', error);
      openNotification("error", "Failed to confirm appointment." || error.message);
    }
  };

  const openRejectModal = (appointment) => {
    setAppointmentToReject(appointment);
    setRejectReason('');
    setIsRejectModalOpen(true);
  };

  const closeRejectModal = () => {
    setIsRejectModalOpen(false);
    setRejectReason('');
    setAppointmentToReject(null);
  };

  const handleRejectSubmit = async () => {
    try {
      await axios.patch(
        `http://localhost:5000/appointment/reject-appointment/${appointmentToReject._id}`,
        {
          status: 'rejected',
          reason: rejectReason,

        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setAppointments((prev) =>
        prev.map((apt) =>
          apt._id === appointmentToReject._id ? { ...apt, status: 'rejected' } : apt
        )
      );

      openNotification("success", "Appointment rejected successfully.");
      closeRejectModal();
    } catch (error) {
      console.error('Error rejecting appointment:', error);
      openNotification("error", "Failed to reject appointment." || error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/appointment/delete-appointment/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setAppointments((prev) => prev.filter((apt) => apt._id !== id));
      openNotification("success", "Appointment deleted successfully.");
    } catch (error) {
      console.error('Error deleting appointment:', error);
      openNotification("error", "Failed to delete appointment." || error.message);
    }
  };

  const formatDate = (ymd) => {
    const [y, m, d] = (ymd || '').split('-');
    return y && m && d ? `${d}/${m}/${y}` : '';
  };

  return (
    <div className={styles.appointment}>
      {contextHolder}
      <Sidebar />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <CalendarCheck size={32} />
            <h1 className={styles.headerTitle}>Appointment Management</h1>
          </div>
          <p className={styles.headerSubtitle}>
            Total {filteredAppointments.length} appointments
          </p>
        </div>

        <div className={styles.controls}>
          <button onClick={() => setIsOpenBookAppointmentModal(true)} className={styles.addButton}>Create appointment</button>
          <BookAppointment isOpen={isOpenBookAppointmentModal} onSuccess={fetchAppointments} onClose={() => setIsOpenBookAppointmentModal(false)} openNotification={openNotification}/>
        </div>

        <div className={styles.filterSection}>
          <div className={styles.searchSection}>
            <input
              type="text"
              placeholder="🔍 Search by customer name..."
              className={styles.searchInput}
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
            />
            <input
              type="text"
              placeholder="🔍 Search by dentist name..."
              className={styles.searchInput}
              value={dentistSearch}
              onChange={(e) => setDentistSearch(e.target.value)}
            />
          </div>

          <div className={styles.filterControls}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Status:</label>
              <select
                className={styles.filterSelect}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Sort by:</label>
              <select
                className={styles.filterSelect}
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.appointmentsList}>
          <div className={styles.listHeader}>
            <div>Customer</div>
            <div>Dentist</div>
            <div>Date & Time</div>
            <div>Services</div>
            <div>Status</div>
            {role !== 'Dentist' && <div>Action</div>}
          </div>
          <AppointmentDetail
            appointmentId={selectedAppointmentId}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
          {filteredAppointments.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📅</div>
              <p className={styles.emptyText}>No appointments found</p>
            </div>
          ) : (
            filteredAppointments.map((appointment) => (
              <div key={appointment._id} className={styles.appointmentItem} onClick={() => handleViewDetail(appointment._id)}>
                <div>
                  <div className={styles.customerName}>
                    {appointment.customer.fullName}
                  </div>
                  <div className={styles.email}>{appointment.customer.email}</div>
                </div>

                <div>
                  <div className={styles.dentistName}>
                    {appointment.dentist.fullName}
                  </div>
                </div>

                <div className={styles.dateTime}>
                  <div className={styles.date}>{formatDate(appointment.date)}</div>
                  <div className={styles.time}>
                    {appointment.startTime} - {appointment.endTime}
                  </div>
                </div>

                <div className={styles.services}>
                  {appointment.service.map((service) => (
                    <div key={service._id} className={styles.serviceName}>
                      • {service.name}
                    </div>
                  ))}
                  {appointment.note && (
                    <div className={styles.note}>{appointment.note}</div>
                  )}
                </div>

                <div>
                  <span
                    className={`${styles.statusBadge} ${appointment.status === 'pending'
                      ? styles.statusPending
                      : appointment.status === 'confirmed'
                        ? styles.statusConfirmed
                        : styles.statusRejected
                      }`}
                  >
                    {appointment.status === 'pending'
                      ? 'Pending'
                      : appointment.status === 'confirmed'
                        ? 'Confirmed'
                        : 'Rejected'}
                  </span>
                </div>
                {role !== 'Dentist' && (
                  <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
                    {appointment.status === 'pending' && (
                      <>
                        <ConfirmDialog
                          title="Confirm appointment"
                          description={`Are you sure you want to confirm this appointment?`}
                          onConfirm={() => handleConfirm(appointment._id)}>
                          <button
                            className={`${styles.actionButton} ${styles.confirmButton}`}
                          >
                            Confirm
                          </button>
                        </ConfirmDialog>
                        <button
                          className={`${styles.actionButton} ${styles.rejectButton}`}
                          onClick={() => openRejectModal(appointment)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <ConfirmDelete
                      title="Confirm appointment deletion"
                      description={`Are you sure you want to delete this appointment? This action cannot be undone.`}
                      onConfirm={() => handleDelete(appointment._id)}>
                      {role !== 'Staff' && (
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </ConfirmDelete>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reject Reason Modal */}
      {isRejectModalOpen && (
        <div className={styles.modalOverlay} onClick={closeRejectModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Reject Appointment</h2>
              <button className={styles.modalCloseButton} onClick={closeRejectModal}>
                <X size={24} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <p className={styles.modalDescription}>
                Please provide a reason for rejecting this appointment:
              </p>

              <textarea
                className={styles.modalTextarea}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason..."
                rows={5}
              />
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.modalCancelButton}
                onClick={closeRejectModal}
              >
                Cancel
              </button>
              <button
                className={styles.modalSubmitButton}
                onClick={handleRejectSubmit}
              >
                Reject Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;
