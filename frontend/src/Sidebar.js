import React, { useState, useEffect } from "react";
import "./static/Sidebar.css";
import { useNavigate, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Sidebar = () => {
  const [user, setUser] = useState({ username: "", email: "" }); // 保存用户信息
  const navigate = useNavigate();
  const location = useLocation();

  // 动态设置菜单的高亮项
  const [activeItem, setActiveItem] = useState("Dashboard");
  useEffect(() => {
    if (location.pathname === "/dashboard") {
      setActiveItem("Dashboard");
    } else if (location.pathname === "/request-admin") {
      setActiveItem("Request Admin");
    }
  }, [location.pathname]);

  // 获取当前用户信息
  useEffect(() => {
    fetch("http://localhost:8000/api/user/me", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`, // 发送 token
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        return response.json();
      })
      .then((data) => setUser({ username: data.username, email: data.email })) // 更新用户状态
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  // 处理登出
  const handleLogout = () => {
    localStorage.removeItem("token"); // 清除 token
    navigate("/sign-in"); // 跳转到登录页面
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handleRequestAdmin = () => {
    navigate("/request-admin");
  };

  return (
    <div className="sidebar">
      <div className="user-info">
        <div className="user-name">
          <span>{user.username || "N/A"}</span> {/* 动态显示用户名 */}
          <img
            src="/images/logout.png"
            alt="Logout Icon"
            className="icon logout"
            onClick={handleLogout}
            style={{ cursor: "pointer" }}
          />
        </div>
        <p className="email">{user.email || "N/A"}</p> {/* 动态显示邮箱 */}
        <Link to="/calculator">
          <button className="new-report-btn">+ New Report</button>
        </Link>
      </div>
      <nav className="menu">
        <ul>
          <li
            className={`menu-item ${activeItem === "Dashboard" ? "active" : ""}`}
            onClick={handleDashboard}
          >
            <span className="icon">
              <img src="/images/Dashboard.png" alt="Dashboard Icon" />
            </span>{" "}
            Dashboard
          </li>
          <li
            className={`menu-item ${activeItem === "Request Admin" ? "active" : ""}`}
            onClick={handleRequestAdmin}
          >
            <span className="icon request-admin">
              <img src="/images/RequestAdmin.png" alt="Request Admin Icon" />
            </span>{" "}
            Request Admin
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
