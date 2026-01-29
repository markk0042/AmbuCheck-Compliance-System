import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';
import './CompletedForms.css';

const CATEGORIES = [
  { id: 'vdiStart', label: 'VDI – Start of Shift' },
  { id: 'shiftEndVdi', label: 'VDI – End of Shift' },
  { id: 'vehicleIr1', label: 'Vehicle IR1 – Incident Reports' },
];

const formatDateTime = (isoString) => {
  if (!isoString) return '-';
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  return d.toLocaleString();
};

const CompletedForms = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('vdiStart');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  const loadData = useCallback(
    async (categoryId) => {
      if (!user || user.role !== 'admin') return;

      setLoading(true);
      setError('');

      try {
        let response;

        if (categoryId === 'vdiStart') {
          // VDI – Start of Shift uses the equipment-checks endpoint
          response = await api.get('/api/equipment-checks');
        } else if (categoryId === 'shiftEndVdi') {
          response = await api.get('/api/admin/forms/shiftEndVdi/submissions');
        } else if (categoryId === 'vehicleIr1') {
          response = await api.get('/api/admin/forms/vehicleIr1/submissions');
        } else {
          setItems([]);
          setLoading(false);
          return;
        }

        const raw = Array.isArray(response.data)
          ? response.data
          : response.data.runsheets || [];

        const mapped = raw.map((entry) => {
          if (categoryId === 'vdiStart') {
            // Equipment check record structure
            const identifier =
              entry.vehicleCallsign ||
              entry.registration ||
              entry.staffName ||
              '';
            const practitioner = entry.staffName || '';
            return {
              id: entry.id,
              identifier,
              practitioner,
              createdAt: entry.createdAt,
              raw: entry,
            };
          }

          // Generic form submissions: { id, formId, values, createdAt, createdBy }
          const values = entry.values || {};
          const identifier =
            values.vehicleCallsign ||
            values.registration ||
            values.pin ||
            values.practitionerPin ||
            '';
          const practitioner = values.practitionerName || '';

          return {
            id: entry.id,
            identifier,
            practitioner,
            createdAt: entry.createdAt,
            raw: entry,
          };
        });

        setItems(mapped);
      } catch (err) {
        console.error('Error loading completed forms', err);
        setError(
          err.response?.data?.error ||
            'Unable to load completed forms. Please try again.'
        );
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    loadData(activeCategory);
  }, [activeCategory, user, loadData]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="completed-forms-container">
        <h2>Completed Forms</h2>
        <p>You do not have access to this page.</p>
      </div>
    );
  }

  const activeConfig = CATEGORIES.find((c) => c.id === activeCategory);

  const filteredItems = items.filter((item) => {
    if (!filter.trim()) return true;
    const q = filter.trim().toLowerCase();
    return (
      item.identifier.toLowerCase().includes(q) ||
      (item.practitioner || '').toLowerCase().includes(q)
    );
  });

  const handleDownloadPdf = async (row) => {
    try {
      let url;
      if (activeCategory === 'vdiStart') {
        url = `/api/admin/equipment-checks/${row.id}/pdf`;
      } else if (activeCategory === 'shiftEndVdi' || activeCategory === 'vehicleIr1') {
        url = `/api/admin/forms/${activeCategory}/submissions/${row.id}/pdf`;
      } else {
        return;
      }

      const response = await api.get(url, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      const categoryLabel = activeConfig?.label || activeCategory;
      link.download = `${categoryLabel.replace(/\s+/g, '_')}_ID_${row.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error downloading PDF', err);
      alert('Unable to download PDF. Please try again.');
    }
  };

  return (
    <div className="completed-forms-container">
      <h2>Completed Forms</h2>
      <p className="completed-forms-subtitle">
        View submitted checks grouped by category. Use the search box to filter
        by call sign, registration, or practitioner PIN/name.
      </p>

      <div className="completed-forms-layout">
        <aside className="completed-forms-nav">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`completed-forms-nav-item ${
                activeCategory === cat.id ? 'active' : ''
              }`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </aside>

        <section className="completed-forms-content">
          <div className="completed-forms-header">
            <h3>{activeConfig?.label}</h3>
            <div className="completed-forms-tools">
              <input
                type="text"
                placeholder="Search by call sign, registration or PIN..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-secondary small"
                onClick={() => loadData(activeCategory)}
                disabled={loading}
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          {error && <div className="completed-forms-error">{error}</div>}

          {!loading && filteredItems.length === 0 && !error && (
            <div className="completed-forms-empty">
              No completed forms found for this category yet.
            </div>
          )}

          {loading && (
            <div className="completed-forms-loading">Loading records…</div>
          )}

          {!loading && filteredItems.length > 0 && (
            <div className="completed-forms-table-wrapper">
              <table className="completed-forms-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Vehicle / Identifier</th>
                    <th>Practitioner</th>
                    <th>Submitted At</th>
                    <th>Details</th>
                    <th>PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.identifier || '-'}</td>
                      <td>{row.practitioner || '-'}</td>
                      <td>{formatDateTime(row.createdAt)}</td>
                      <td>
                        <details>
                          <summary>View</summary>
                          <pre>
                            {JSON.stringify(row.raw, null, 2)}
                          </pre>
                        </details>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-secondary small"
                          onClick={() => handleDownloadPdf(row)}
                        >
                          Download PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CompletedForms;

