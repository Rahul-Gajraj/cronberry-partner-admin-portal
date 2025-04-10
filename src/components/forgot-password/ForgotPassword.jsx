import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = ({ setUser, setIsLoggedIn }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const checkValidEmail = () => {
    if (
      formData.email == "admin@cronberry.com" &&
      formData.password == "admin@123"
    ) {
      return true;
    }

    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (checkValidEmail()) {
      localStorage.setItem("user", JSON.stringify(formData));
      setUser(formData);
      setIsLoggedIn(true);
      navigate("/");
    } else {
      alert("Enter valid email and password");
    }
  };

  const formGroupStyle = {
    display: "flex",
    flexDirection: "column",
    marginBottom: 16,
  };
  const labelStyle = { fontWeight: 600, marginBottom: 6 };
  const inputStyle = {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: 6,
    fontSize: 14,
  };

  return (
    <div
      className="flex-1 p-6 overflow-y-scroll space-y-6"
      style={{
        minHeight: "100vh",
        background: "#F9FAFB",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 600,
          width: "100%",
          background: "#fff",
          borderRadius: 12,
          padding: 32,
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <img
            src="https://www.cronberry.com/images/cronberry-logo.svg"
            alt="Cronberry Logo"
            style={{ width: 100, marginBottom: 12 }}
          />
          <h2 style={{ fontSize: 22, fontWeight: "bold", color: "#4F46E5" }}>
            Admin Forgot Password
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              autoComplete="off"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              style={inputStyle}
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            style={{
              padding: "14px",
              fontSize: 16,
              background: "#4F46E5",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              width: "100%",
              border: "none",
              borderRadius: 6,
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
