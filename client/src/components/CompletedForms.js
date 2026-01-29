import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';
import './CompletedForms.css';

const CATEGORIES = [
  { id: 'vdiStart', label: 'VDI – Start of Shift' },
  { id: 'shiftEndVdi', label: 'VDI – End of Shift' },
  { id: 'vehicleIr1', label: 'Vehicle IR1 – Incident Reports' },
  { id: 'monitorCheck', label: 'Ambulance Monitor / AED Checklist' },
  { id: 'blsBagUpdated', label: 'BLS Bag' },
  { id: 'emtMeds', label: 'EMT Medications' },
  { id: 'paramedicMeds', label: 'Paramedic Meds' },
  { id: 'system48', label: 'ALS Bag' },
  { id: 'apMeds', label: 'Advanced Para Meds' },
];

const formatDateTime = (isoString) => {
  if (!isoString) return '-';
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  return d.toLocaleString();
};

const humanizeKey = (key) =>
  key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()).trim();

const isImageValue = (v) =>
  typeof v === 'string' && (v.startsWith('http') || v.startsWith('/'));

const CompletedForms = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('vdiStart');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [viewRow, setViewRow] = useState(null);

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
        } else {
          // All other categories use generic form submissions (shiftEndVdi, vehicleIr1, monitorCheck, etc.)
          response = await api.get(`/api/admin/forms/${categoryId}/submissions`);
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
      } else {
        // All form-based categories (shiftEndVdi, vehicleIr1, monitorCheck, blsBagUpdated, etc.)
        url = `/api/admin/forms/${activeCategory}/submissions/${row.id}/pdf`;
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
                    <th>Actions</th>
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
                        <div className="completed-forms-actions">
                          <button
                            type="button"
                            className="btn btn-secondary small"
                            onClick={() => setViewRow(row)}
                          >
                            View
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary small"
                            onClick={() => handleDownloadPdf(row)}
                          >
                            Download PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {viewRow && (
        <div className="completed-forms-view-overlay" onClick={() => setViewRow(null)} role="presentation">
          <div className="completed-forms-view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="completed-forms-view-header">
              <h3>
                {activeCategory === 'vdiStart'
                  ? 'VDI – Start of Shift'
                  : activeConfig?.label || 'Form'}
                {' '}
                (ID {viewRow.id})
              </h3>
              <button type="button" className="completed-forms-view-close" onClick={() => setViewRow(null)} aria-label="Close">
                ×
              </button>
            </div>
            <div className="completed-forms-view-body">
              {activeCategory === 'vdiStart' ? (
                (() => {
                  const raw = viewRow.raw || {};
                  const { photos, id: _id, createdAt, createdBy, ...rest } = raw;
                  return (
                    <>
                      <section className="completed-forms-view-section">
                        <h4>Details</h4>
                        <dl>
                          <dt>Submitted at</dt>
                          <dd>{formatDateTime(raw.createdAt)}</dd>
                          <dt>Staff name</dt>
                          <dd>{raw.staffName || '—'}</dd>
                          <dt>Registration</dt>
                          <dd>{raw.registration || '—'}</dd>
                          <dt>Vehicle call sign</dt>
                          <dd>{raw.vehicleCallsign || '—'}</dd>
                        </dl>
                      </section>
                      <section className="completed-forms-view-section">
                        <h4>Checklist values</h4>
                        <dl>
                          {Object.entries(rest).map(([k, v]) => (
                            <React.Fragment key={k}>
                              <dt>{humanizeKey(k)}</dt>
                              <dd>{typeof v === 'object' ? JSON.stringify(v) : String(v ?? '—')}</dd>
                            </React.Fragment>
                          ))}
                        </dl>
                      </section>
                      {photos && Object.keys(photos).length > 0 && (
                        <section className="completed-forms-view-section">
                          <h4>Photos</h4>
                          <dl>
                            {Object.entries(photos).map(([key, pathOrUrl]) => (
                              <React.Fragment key={key}>
                                <dt>{humanizeKey(key)}</dt>
                                <dd>
                                  {isImageValue(pathOrUrl) ? (
                                    <a href={pathOrUrl} target="_blank" rel="noopener noreferrer">View photo</a>
                                  ) : (
                                    pathOrUrl || '—'
                                  )}
                                </dd>
                              </React.Fragment>
                            ))}
                          </dl>
                        </section>
                      )}
                    </>
                  );
                })()
              ) : (
                (() => {
                  const raw = viewRow.raw || {};
                  const snapshot = raw.formSnapshot;
                  const formValues = raw.values || {};
                  if (snapshot && snapshot.title && Array.isArray(snapshot.sections)) {
                    return (
                      <>
                        <p className="completed-forms-view-meta">
                          Submitted: {formatDateTime(raw.createdAt)} · User ID: {raw.createdBy ?? '—'}
                        </p>
                        {snapshot.sections.map((section) => (
                          <section key={section.id} className="completed-forms-view-section">
                            <h4>{section.title || 'Section'}</h4>
                            <dl>
                              {(section.fields || []).map((field) => {
                                const label = field.label || field.id || '';
                                const val = formValues[field.id];
                                const display = val === undefined || val === null ? '—' : String(val);
                                return (
                                  <React.Fragment key={field.id}>
                                    <dt>{label}</dt>
                                    <dd>
                                      {isImageValue(val) ? (
                                        <a href={val} target="_blank" rel="noopener noreferrer">View photo</a>
                                      ) : (
                                        display
                                      )}
                                    </dd>
                                  </React.Fragment>
                                );
                              })}
                            </dl>
                          </section>
                        ))}
                      </>
                    );
                  }
                  return (
                    <section className="completed-forms-view-section">
                      <h4>Answers</h4>
                      <dl>
                        {Object.entries(formValues).map(([k, v]) => (
                          <React.Fragment key={k}>
                            <dt>{humanizeKey(k)}</dt>
                            <dd>{typeof v === 'object' ? JSON.stringify(v) : String(v ?? '—')}</dd>
                          </React.Fragment>
                        ))}
                      </dl>
                    </section>
                  );
                })()
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedForms;

