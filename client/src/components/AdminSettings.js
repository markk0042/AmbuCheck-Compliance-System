import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';
import { formsConfig } from '../config/formsConfig';
import './AdminSettings.css';

const TABS = [
  { id: 'practitioners', label: 'Practitioners' },
  { id: 'vehicles', label: 'Vehicles' },
  { id: 'forms', label: 'Forms' },
];

const EDITABLE_FORMS = [
  { id: 'shiftEndVdi', label: 'VDI – End of Shift' },
  { id: 'vehicleIr1', label: 'Vehicle IR1 – Incident Report' },
  { id: 'blsBagUpdated', label: 'BLS Bag' },
  { id: 'emtMeds', label: 'EMT Medications' },
  { id: 'paramedicMeds', label: 'Paramedic Medications' },
  { id: 'apMeds', label: 'Advanced Paramedic Medications' },
  { id: 'system48', label: 'ALS Bag' },
];

const AdminSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('practitioners');

  const [practitioners, setPractitioners] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [practitionerForm, setPractitionerForm] = useState({
    name: '',
    pin: '',
    role: 'crew',
  });
  const [vehicleForm, setVehicleForm] = useState({
    registration: '',
    callsign: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form configuration editor state
  const [selectedFormId, setSelectedFormId] = useState(EDITABLE_FORMS[0].id);
  const [formConfigText, setFormConfigText] = useState('');
  const [formConfigLoading, setFormConfigLoading] = useState(false);

  const loadPractitioners = useCallback(async () => {
    setError('');
    try {
      const res = await api.get('/api/admin/practitioners');
      setPractitioners(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error loading practitioners', err);
      setError(
        err.response?.data?.error ||
          'Unable to load practitioners. Please try again.'
      );
    }
  }, []);

  const loadVehicles = useCallback(async () => {
    setError('');
    try {
      const res = await api.get('/api/admin/vehicles');
      setVehicles(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error loading vehicles', err);
      setError(
        err.response?.data?.error ||
          'Unable to load vehicles. Please try again.'
      );
    }
  }, []);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    loadPractitioners();
    loadVehicles();
  }, [user, loadPractitioners, loadVehicles]);

  const loadFormConfig = useCallback(
    async (formId) => {
      if (!user || user.role !== 'admin') return;
      setFormConfigLoading(true);
      setError('');
      try {
        // Start with base config from client-side formsConfig
        let base = formsConfig[formId];
        if (!base) {
          throw new Error(`Unknown formId: ${formId}`);
        }
        let working = base;

        try {
          const res = await api.get(`/api/admin/forms/config/${formId}`);
          if (res.data?.config) {
            working = res.data.config;
          }
        } catch (err) {
          if (err.response?.status !== 404) {
            throw err;
          }
          // 404 just means there is no override yet – we stick with base config
        }

        setFormConfigText(JSON.stringify(working, null, 2));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error loading form config', err);
        setError(
          err.response?.data?.error ||
            err.message ||
            'Unable to load form configuration.'
        );
        setFormConfigText('');
      } finally {
        setFormConfigLoading(false);
      }
    },
    [user]
  );

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    if (activeTab === 'forms') {
      loadFormConfig(selectedFormId);
    }
  }, [user, activeTab, selectedFormId, loadFormConfig]);

  const parsedFormConfig = useMemo(() => {
    try {
      if (!formConfigText.trim()) return null;
      return JSON.parse(formConfigText);
    } catch {
      return null;
    }
  }, [formConfigText]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-settings-container">
        <h2>Admin Settings</h2>
        <p>You do not have access to this page.</p>
      </div>
    );
  }

  const handlePractitionerSubmit = async (e) => {
    e.preventDefault();
    if (!practitionerForm.name.trim() || !practitionerForm.pin.trim()) {
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/api/admin/practitioners', practitionerForm);
      setPractitionerForm({ name: '', pin: '', role: 'crew' });
      await loadPractitioners();
    } catch (err) {
      console.error('Error saving practitioner', err);
      setError(
        err.response?.data?.error ||
          'Unable to save practitioner. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleSubmit = async (e) => {
    e.preventDefault();
    if (!vehicleForm.registration.trim()) {
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/api/admin/vehicles', vehicleForm);
      setVehicleForm({ registration: '', callsign: '', description: '' });
      await loadVehicles();
    } catch (err) {
      console.error('Error saving vehicle', err);
      setError(
        err.response?.data?.error ||
          'Unable to save vehicle. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const deletePractitioner = async (id) => {
    if (!window.confirm('Delete this practitioner?')) return;
    setLoading(true);
    setError('');
    try {
      await api.delete(`/api/admin/practitioners/${id}`);
      await loadPractitioners();
    } catch (err) {
      console.error('Error deleting practitioner', err);
      setError(
        err.response?.data?.error ||
          'Unable to delete practitioner. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteVehicle = async (id) => {
    if (!window.confirm('Delete this vehicle?')) return;
    setLoading(true);
    setError('');
    try {
      await api.delete(`/api/admin/vehicles/${id}`);
      await loadVehicles();
    } catch (err) {
      console.error('Error deleting vehicle', err);
      setError(
        err.response?.data?.error || 'Unable to delete vehicle. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderPractitioners = () => (
    <div className="admin-settings-section">
      <h3>Practitioners</h3>
      <p className="admin-settings-help">
        Store practitioner names and PINs for reference. (Forms still accept
        manual PIN entry; this list is primarily for admin tracking for now.)
      </p>

      <form className="admin-settings-form" onSubmit={handlePractitionerSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={practitionerForm.name}
          onChange={(e) =>
            setPractitionerForm((f) => ({ ...f, name: e.target.value }))
          }
          required
        />
        <input
          type="text"
          placeholder="PIN"
          value={practitionerForm.pin}
          onChange={(e) =>
            setPractitionerForm((f) => ({ ...f, pin: e.target.value }))
          }
          required
        />
        <select
          value={practitionerForm.role}
          onChange={(e) =>
            setPractitionerForm((f) => ({ ...f, role: e.target.value }))
          }
        >
          <option value="crew">Crew</option>
          <option value="emt">EMT</option>
          <option value="paramedic">Paramedic</option>
          <option value="ap">Advanced Paramedic</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Add Practitioner'}
        </button>
      </form>

      <div className="admin-settings-table-wrapper">
        <table className="admin-settings-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>PIN</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {practitioners.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.pin}</td>
                <td>{p.role || 'crew'}</td>
                <td>
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => deletePractitioner(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {practitioners.length === 0 && (
              <tr>
                <td colSpan={5}>No practitioners added yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderVehicles = () => (
    <div className="admin-settings-section">
      <h3>Vehicles</h3>
      <p className="admin-settings-help">
        Manage registrations and call signs used in the VDI – Start of Shift
        form. The registration dropdown will pull from this list.
      </p>

      <form className="admin-settings-form" onSubmit={handleVehicleSubmit}>
        <input
          type="text"
          placeholder="Registration (e.g. 241-KE-3147)"
          value={vehicleForm.registration}
          onChange={(e) =>
            setVehicleForm((f) => ({ ...f, registration: e.target.value }))
          }
          required
        />
        <input
          type="text"
          placeholder="Call sign (optional)"
          value={vehicleForm.callsign}
          onChange={(e) =>
            setVehicleForm((f) => ({ ...f, callsign: e.target.value }))
          }
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={vehicleForm.description}
          onChange={(e) =>
            setVehicleForm((f) => ({ ...f, description: e.target.value }))
          }
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Add Vehicle'}
        </button>
      </form>

      <div className="admin-settings-table-wrapper">
        <table className="admin-settings-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Registration</th>
              <th>Call sign</th>
              <th>Description</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{v.registration}</td>
                <td>{v.callsign}</td>
                <td>{v.description}</td>
                <td>
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => deleteVehicle(v.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {vehicles.length === 0 && (
              <tr>
                <td colSpan={5}>No vehicles added yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const handleFormConfigSave = async () => {
    setError('');
    let parsed;
    try {
      parsed = JSON.parse(formConfigText);
    } catch (err) {
      setError('Form configuration is not valid JSON. Please fix and try again.');
      return;
    }

    setFormConfigLoading(true);
    try {
      await api.put(`/api/admin/forms/config/${selectedFormId}`, {
        config: parsed,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error saving form config', err);
      setError(
        err.response?.data?.error ||
          'Unable to save form configuration. Please try again.'
      );
    } finally {
      setFormConfigLoading(false);
    }
  };

  const renderForms = () => (
    <div className="admin-settings-section">
      <h3>Forms</h3>
      <p className="admin-settings-help">
        Visually tweak blank forms (labels, options and fields). Changes apply
        to new submissions without needing a new app release. Avoid renaming
        special IDs like tamper seal questions unless you know what you&apos;re doing.
      </p>

      <div className="admin-forms-toolbar">
        <select
          value={selectedFormId}
          onChange={(e) => setSelectedFormId(e.target.value)}
        >
          {EDITABLE_FORMS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn btn-secondary small"
          onClick={() => loadFormConfig(selectedFormId)}
          disabled={formConfigLoading}
        >
          {formConfigLoading ? 'Loading…' : 'Reload'}
        </button>
        <button
          type="button"
          className="btn btn-primary small"
          onClick={handleFormConfigSave}
          disabled={formConfigLoading}
        >
          {formConfigLoading ? 'Saving…' : 'Save Form Config'}
        </button>
      </div>

      {parsedFormConfig && Array.isArray(parsedFormConfig.sections) ? (
        <div className="admin-forms-sections">
          {parsedFormConfig.sections.map((section, sectionIdx) => {
            const handleSectionChange = (updater) => {
              const clone = JSON.parse(JSON.stringify(parsedFormConfig));
              updater(clone.sections[sectionIdx]);
              setFormConfigText(JSON.stringify(clone, null, 2));
            };

            const handleFieldChange = (fieldIdx, updater) => {
              const clone = JSON.parse(JSON.stringify(parsedFormConfig));
              const target =
                clone.sections?.[sectionIdx]?.fields?.[fieldIdx];
              if (!target) return;
              updater(target);
              setFormConfigText(JSON.stringify(clone, null, 2));
            };

            const addField = () => {
              const clone = JSON.parse(JSON.stringify(parsedFormConfig));
              const targetSection = clone.sections?.[sectionIdx];
              if (!targetSection) return;
              if (!Array.isArray(targetSection.fields)) {
                targetSection.fields = [];
              }
              targetSection.fields.push({
                id: `field_${Date.now()}`,
                label: 'New Field',
                type: 'text',
                required: false,
              });
              setFormConfigText(JSON.stringify(clone, null, 2));
            };

            const removeField = (fieldIdx) => {
              const clone = JSON.parse(JSON.stringify(parsedFormConfig));
              const targetSection = clone.sections?.[sectionIdx];
              if (!targetSection || !Array.isArray(targetSection.fields)) {
                return;
              }
              targetSection.fields.splice(fieldIdx, 1);
              setFormConfigText(JSON.stringify(clone, null, 2));
            };

            return (
              <div key={section.id || sectionIdx} className="admin-forms-section">
                <div className="admin-forms-section-header">
                  <input
                    type="text"
                    value={section.title || ''}
                    onChange={(e) =>
                      handleSectionChange((sec) => {
                        sec.title = e.target.value;
                      })
                    }
                    placeholder="Section title"
                  />
                  <button
                    type="button"
                    className="btn btn-secondary small"
                    onClick={addField}
                  >
                    Add Field
                  </button>
                </div>

                {Array.isArray(section.fields) &&
                  section.fields.map((field, fieldIdx) => (
                    <div
                      key={field.id || `${sectionIdx}-${fieldIdx}`}
                      className="admin-forms-field-row"
                    >
                      <div className="admin-forms-field-main">
                        <input
                          type="text"
                          value={field.label || ''}
                          onChange={(e) =>
                            handleFieldChange(fieldIdx, (f) => {
                              f.label = e.target.value;
                            })
                          }
                          placeholder="Question label"
                        />
                        <select
                          value={field.type || 'text'}
                          onChange={(e) =>
                            handleFieldChange(fieldIdx, (f) => {
                              f.type = e.target.value;
                            })
                          }
                        >
                          <option value="text">Text</option>
                          <option value="number">Number</option>
                          <option value="select">Dropdown</option>
                          <option value="textarea">Paragraph</option>
                          <option value="checkbox">Checkbox</option>
                        </select>
                        <label className="admin-forms-required-toggle">
                          <input
                            type="checkbox"
                            checked={!!field.required}
                            onChange={(e) =>
                              handleFieldChange(fieldIdx, (f) => {
                                f.required = e.target.checked;
                              })
                            }
                          />
                          Required
                        </label>
                      </div>

                      {field.type === 'select' && (
                        <div className="admin-forms-field-options">
                          <label>
                            Options (comma separated)
                            <input
                              type="text"
                              value={
                                Array.isArray(field.options)
                                  ? field.options.join(', ')
                                  : ''
                              }
                              onChange={(e) => {
                                const raw = e.target.value;
                                const opts = raw
                                  .split(',')
                                  .map((o) => o.trim())
                                  .filter(Boolean);
                                handleFieldChange(fieldIdx, (f) => {
                                  f.options = opts;
                                });
                              }}
                              placeholder="Present, Not Present, Expired"
                            />
                          </label>
                        </div>
                      )}

                      <div className="admin-forms-field-footer">
                        <span className="admin-forms-field-id">
                          ID: {field.id}
                        </span>
                        <button
                          type="button"
                          className="link-button"
                          onClick={() => removeField(fieldIdx)}
                        >
                          Remove field
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="admin-settings-help">
          The current form configuration could not be parsed. Reload the form
          or contact support.
        </p>
      )}
    </div>
  );

  return (
    <div className="admin-settings-container">
      <h2>Admin Settings</h2>
      {error && <div className="admin-settings-error">{error}</div>}

      <div className="admin-settings-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`admin-settings-tab ${
              activeTab === tab.id ? 'active' : ''
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'practitioners' && renderPractitioners()}
      {activeTab === 'vehicles' && renderVehicles()}
      {activeTab === 'forms' && renderForms()}
    </div>
  );
};

export default AdminSettings;

