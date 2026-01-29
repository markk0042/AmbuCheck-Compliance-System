import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const go = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const isActive = (pathPrefix) =>
    location.pathname === pathPrefix || location.pathname.startsWith(pathPrefix);

  return (
    <div className={`app-shell ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <header className="top-nav">
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen((open) => !open)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
        <div className="top-nav-left" onClick={() => go('/checklists')}>
          <div className="logo-circle">A</div>
          <div className="top-nav-title">
            <span className="app-name">AmbuCheck</span>
            <span className="app-subtitle">Ambulance Compliance Suite</span>
          </div>
        </div>
      </header>

      <aside className="sidebar">
        <nav className="sidebar-nav">

          <div className="sidebar-section">
            <p className="sidebar-section-title">Vehicle / Equipment</p>
            <button
              className={`sidebar-item ${isActive('/equipment-check') ? 'active' : ''}`}
              onClick={() => go('/equipment-check')}
            >
              VDI – Start of Shift
            </button>
            <button
              className={`sidebar-item ${isActive('/forms/shiftEndVdi') ? 'active' : ''}`}
              onClick={() => go('/forms/shiftEndVdi')}
            >
              VDI – End of Shift
            </button>
            <button
              className={`sidebar-item ${isActive('/forms/vehicleIr1') ? 'active' : ''}`}
              onClick={() => go('/forms/vehicleIr1')}
            >
              Vehicle IR1 – Incident Report
            </button>
            <button
              className={`sidebar-item ${isActive('/forms/monitorCheck') ? 'active' : ''}`}
              onClick={() => go('/forms/monitorCheck')}
            >
              Ambulance Monitor / AED Checklist
            </button>
          </div>

          <div className="sidebar-section">
            <p className="sidebar-section-title">EMT</p>
            <button
              className={`sidebar-item ${isActive('/forms/blsBagUpdated') ? 'active' : ''}`}
              onClick={() => go('/forms/blsBagUpdated')}
            >
              BLS Bag
            </button>
            <button
              className={`sidebar-item ${isActive('/forms/emtMeds') ? 'active' : ''}`}
              onClick={() => go('/forms/emtMeds')}
            >
              EMT Medications
            </button>
          </div>

          <div className="sidebar-section">
            <p className="sidebar-section-title">Paramedic</p>
            <button
              className={`sidebar-item ${isActive('/forms/system48') ? 'active' : ''}`}
              onClick={() => go('/forms/system48')}
            >
              ALS Bag
            </button>
            <button
              className={`sidebar-item ${isActive('/forms/paramedicMeds') ? 'active' : ''}`}
              onClick={() => go('/forms/paramedicMeds')}
            >
              Paramedic Meds
            </button>
          </div>

          <div className="sidebar-section">
            <p className="sidebar-section-title">Advanced Paramedic</p>
            <button
              className={`sidebar-item ${isActive('/forms/system48') ? 'active' : ''}`}
              onClick={() => go('/forms/system48')}
            >
              ALS Bag
            </button>
            <button
              className={`sidebar-item ${isActive('/forms/apMeds') ? 'active' : ''}`}
              onClick={() => go('/forms/apMeds')}
            >
              Advanced Para Meds
            </button>
          </div>

          {user?.role === 'admin' && (
            <div className="sidebar-section">
              <p className="sidebar-section-title">Admin</p>
              <button
                className={`sidebar-item ${isActive('/admin/completed-forms') ? 'active' : ''}`}
                onClick={() => go('/admin/completed-forms')}
              >
                Completed Forms
              </button>
              <button
                className={`sidebar-item ${isActive('/admin/settings') ? 'active' : ''}`}
                onClick={() => go('/admin/settings')}
              >
                Settings
              </button>
            </div>
          )}
        </nav>

        <div className="sidebar-footer">
          {user && (
            <>
              <div className="sidebar-user-label">
                Logged in as {user.name || user.username} {user.role ? `(${user.role})` : ''}
              </div>
              <button className="sidebar-logout-btn" onClick={handleLogout}>
                Log Out
              </button>
            </>
          )}
        </div>
      </aside>

      <main className="app-main">
        <div className="app-main-inner">{children}</div>
      </main>
    </div>
  );
};

export default Layout;


