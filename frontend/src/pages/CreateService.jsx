import { useState, useRef } from "react"
import styles from "./CreateService.module.css"
import axios from "axios"
import { Select } from "antd";

function CreateService({ isOpen, onClose, onSuccess, openNotification }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: 0,
    price: 0,
    type: "",
    guarantee: "",
    image: "",
  })

  const fileInputRef = useRef(null)
  const [imagePreview, setImagePreview] = useState("")
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const data = new FormData()
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("duration", formData.duration);
    data.append("price", formData.price);
    data.append("type", formData.type);
    data.append("guarantee", formData.guarantee);

    if (formData.image) {
      data.append("image", formData.image);
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post("http://localhost:5000/service/create-service", data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        })
      openNotification("success", "Service created successfully.");
      if (onSuccess) onSuccess();
      setFormData({
        name: "",
        description: "",
        duration: 0,
        price: 0,
        type: "",
        guarantee: "",
        image: "",
      })
      setImagePreview("");
      onClose();
    } catch (error) {
      console.error("Failed to create service:", error)
      if (error.response && error.response.data) {
        if (error.response.data.errors && error.response.data.errors.length > 0) {
          const backendErrors = {};
          error.response.data.errors.forEach(err => {
            backendErrors[err.path] = err.msg;
          });
          setFieldErrors(backendErrors);
          openNotification("error", error.response.data.errors[0].msg);
        } else if (error.response.data.message) {
          openNotification("error", error.response.data.message);
        } else {
          openNotification("error", "Failed to create service!");
        }
      } else {
        openNotification("error", "Failed to create service!");
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setImagePreview(ev.target.result)
      }
      reader.readAsDataURL(file)

      handleInputChange("image", file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={onClose} />

      <div className={styles.modal}>
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <h2 className={styles.title}>Create New Service</h2>
            <button onClick={onClose} className={styles.closeButton}>
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Service Name <span className={styles.star}>*</span>
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter service name"
                className={`${styles.input} ${fieldErrors.name ? styles.inputError : ""}`}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>
                Description <span className={styles.star}>*</span>
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your service in detail"
                rows={4}
                className={`${styles.textarea} ${fieldErrors.description ? styles.inputError : ""}`}
              />
            </div>

            <div className={styles.gridTwo}>
              <div className={styles.formGroup}>
                <label htmlFor="duration" className={styles.label}>
                  Time (minutes) <span className={styles.star}>*</span>
                </label>
                <input
                  id="duration"
                  type="number"
                  min="1"
                  value={formData.duration || ""}
                  onChange={(e) => handleInputChange("duration", Number.parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className={`${styles.input} ${fieldErrors.duration ? styles.inputError : ""}`}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="price" className={styles.label}>
                  Price (VND) <span className={styles.star}>*</span>
                </label>
                <input
                  id="price"
                  type="number"
                  min="0"
                  step="100000"
                  value={formData.price || ""}
                  onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className={`${styles.input} ${fieldErrors.price ? styles.inputError : ""}`}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="type" className={styles.label}>
                Type service <span className={styles.star}>*</span>
              </label>
              <Select
                id="type"
                value={formData.type}
                onChange={(value) => handleInputChange("type", value)}
                className={`${styles.select} ${fieldErrors.type ? styles.inputError : ""}`}
                options={[
                  { value: "", label: "Select service type" },
                  { value: "Check-up", label: "Check-up" },
                  { value: "Treatment", label: "Treatment" },
                  { value: "Aesthetics", label: "Aesthetics" },
                  { value: "Surgery", label: "Surgery" },
                  { value: "Orthodontics", label: "Orthodontics" },
                ]}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="guarantee" className={styles.label}>
                Guarantee <span className={styles.star}>*</span>
              </label>
              <input
                id="guarantee"
                type="text"
                value={formData.guarantee}
                onChange={(e) => handleInputChange("guarantee", e.target.value)}
                placeholder="VD: One year"
                className={`${styles.input} ${fieldErrors.guarantee ? styles.inputError : ""}`}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Service Image <span className={styles.star}>*</span></label>
              <div className={styles.imageUpload}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className={styles.hiddenInput}
                />

                {imagePreview ? (
                  <div className={`${styles.imagePreview} ${fieldErrors.image ? styles.inputError : ""}`}>
                    <img src={imagePreview || "/placeholder.svg"} alt="Preview" className={styles.previewImage} />
                    <div className={styles.imageOverlay}>
                      <button type="button" onClick={triggerFileInput} className={styles.changeImageBtn}>
                        Change Photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={`${styles.uploadArea} ${fieldErrors.image ? styles.inputError : ""}`} onClick={triggerFileInput}>
                    <div className={styles.uploadContent}>
                      <div className={styles.uploadIcon}>📁</div>
                      <p className={styles.uploadText}>Click to upload photo</p>
                      <p className={styles.uploadSubtext}>PNG, JPG, GIF maximum 5MB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.actions}>
              <button type="button" onClick={onClose} className={styles.cancelBtn}>
                Cancel
              </button>
              <button type="submit" className={`${styles.submitBtn} ${loading ? styles.loading : ""}`}>
                {loading ? (
                  <span className={styles.spinner}></span>
                ) : (
                  "Create Service"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateService;