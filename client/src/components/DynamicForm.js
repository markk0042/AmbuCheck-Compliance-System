import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/axios';
import { formsConfig } from '../config/formsConfig';
import './DynamicForm.css';

const DynamicForm = () => {
  const { formId } = useParams();

  const baseFormDef = formsConfig[formId];

  const [formDef, setFormDef] = useState(baseFormDef || null);
  const [configLoading, setConfigLoading] = useState(true);
  const [values, setValues] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load any server-side form config overrides and initialise auto fields
  useEffect(() => {
    let cancelled = false;
    setConfigLoading(true);
    setError('');
    setSuccess('');
    setValues({});

    const loadConfig = async () => {
      // Start with base config from client
      let nextDef = formsConfig[formId] || null;

      try {
        const res = await api.get(`/api/forms/config/${formId}`);
        if (res.data?.config) {
          nextDef = res.data.config;
        }
      } catch (err) {
        // 404 just means no override; other errors we log but still fall back to base
        if (err.response?.status !== 404) {
          // eslint-disable-next-line no-console
          console.error('Error loading form config override', err);
        }
      }

      if (!cancelled) {
        setFormDef(nextDef);
        setConfigLoading(false);
      }
    };

    loadConfig();

    return () => {
      cancelled = true;
    };
  }, [formId]);

  // Initialise auto fields for specific forms (e.g. ALS Bag datetime)
  useEffect(() => {
    if (!formDef) return;
    if (
      formDef.id === 'system48' ||
      formDef.id === 'apMeds' ||
      formDef.id === 'paramedicMeds'
    ) {
      setValues(prev => {
        if (prev.completedAt) return prev;
        const now = new Date();
        // ISO-like value suitable for datetime-local
        const iso = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
        return {
          ...prev,
          completedAt: iso,
        };
      });
    }
  }, [formDef]);

  if (configLoading) {
    return (
      <div className="dynamic-form-container">
        <div className="content-wrapper">
          <p>Loading form…</p>
        </div>
      </div>
    );
  }

  if (!formDef) {
    return (
      <div className="dynamic-form-container">
        <div className="content-wrapper">
          <p>Form not found.</p>
        </div>
      </div>
    );
  }

  const handleChange = (fieldId, value) => {
    setValues(prev => {
      let next = {
        ...prev,
        [fieldId]: value,
      };

      // Auto-fill / relax behaviour for forms with tamper seals
      if (formDef.id === 'system48' && fieldId === 'tamperSealTagged' && value === 'Yes') {
        // ALS Bag: when main tamper seal is tagged yes, auto-fill all Yes/No selects with Yes
        formDef.sections.forEach(section => {
          section.fields.forEach(field => {
            const isMeta =
              field.id === 'tamperSealTagged' ||
              field.id === 'pin' ||
              field.id === 'bagNumber' ||
              field.id === 'completedAt' ||
              field.id === 'email';
            if (!isMeta && field.type === 'select' && Array.isArray(field.options)) {
              if (field.options.includes('Yes')) {
                next[field.id] = 'Yes';
              }
              const quantityFieldId = `${field.id}_quantity`;
              if (next[quantityFieldId]) {
                delete next[quantityFieldId];
              }
            }
          });
        });
      }

      if (formDef.id === 'apMeds' && fieldId === 'controlledTamperTagged' && value === 'Yes') {
        // Advanced Paramedic Meds: controlled meds pouch
        formDef.sections.forEach(section => {
          if (section.id !== 'apMeds-controlled') return;
          section.fields.forEach(field => {
            const isMeta =
              field.id === 'controlledTamperTagged' ||
              field.id === 'pin' ||
              field.id === 'controlledPouchNumber' ||
              field.id === 'completedAt' ||
              field.id === 'email';
            if (!isMeta && field.type === 'select' && Array.isArray(field.options)) {
              if (field.options.includes('Yes')) {
                next[field.id] = 'Yes';
              }
            }
          });
        });
      }

      if (formDef.id === 'apMeds' && fieldId === 'apBagTamperTagged' && value === 'Yes') {
        // Advanced Paramedic Meds: AP meds bag other medications
        formDef.sections.forEach(section => {
          if (section.id !== 'apMeds-other') return;
          section.fields.forEach(field => {
            const isMeta =
              field.id === 'apBagTamperTagged' ||
              field.id === 'pin' ||
              field.id === 'controlledPouchNumber' ||
              field.id === 'completedAt' ||
              field.id === 'email';
            if (!isMeta && field.type === 'select' && Array.isArray(field.options)) {
              // For these, "auto-fill" means we do not change value unless they have a "Yes" option
              if (field.options.includes('Yes')) {
                next[field.id] = 'Yes';
              }
            }
          });
        });
      }

      if (formDef.id === 'paramedicMeds' && fieldId === 'medsBagTamperTagged' && value === 'Yes') {
        // Paramedic Meds: when meds bag tamper seal tagged yes, auto-fill all Yes/No selects with Yes in items section
        formDef.sections.forEach(section => {
          if (section.id !== 'paramedicMeds-items') return;
          section.fields.forEach(field => {
            if (field.type === 'select' && Array.isArray(field.options)) {
              if (field.options.includes('Yes')) {
                next[field.id] = 'Yes';
              }
            }
          });
        });
      }

      if (formDef.id === 'blsBagUpdated' && fieldId === 'blsTamperTagged' && value === 'Yes') {
        // BLS Bag: when tamper seal tagged yes, auto-fill all Yes/No selects with Yes
        formDef.sections.forEach(section => {
          section.fields.forEach(field => {
            const isMetaBls =
              field.id === 'blsTamperTagged' ||
              field.id === 'practitionerName' ||
              field.id === 'practitionerPin' ||
              field.id === 'bagNumber' ||
              field.id === 'sealNumber' ||
              field.id === 'nameLocation' ||
              field.id === 'oxygenCdLevel';
            if (!isMetaBls && field.type === 'select' && Array.isArray(field.options)) {
              if (field.options.includes('Yes')) {
                next[field.id] = 'Yes';
              }
            }
          });
        });
      }

      if (formDef.id === 'emtMeds' && fieldId === 'emtPouchSealed' && value === 'Yes') {
        // EMT Meds: when pouch sealed yes, auto-fill all medication selects with "Present" in items section
        formDef.sections.forEach(section => {
          if (section.id !== 'emtMeds-items') return;
          section.fields.forEach(field => {
            if (field.type === 'select' && Array.isArray(field.options)) {
              if (field.options.includes('Present')) {
                next[field.id] = 'Present';
              }
            }
          });
        });
      }

      return next;
    });
  };

  const handleCheckboxChange = (fieldId) => {
    setValues(prev => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }));
  };

  const handleFileUpload = async (fieldId, file) => {
    if (!file) {
      setValues(prev => ({
        ...prev,
        [fieldId]: '',
      }));
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post(`/api/upload/${fieldId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const storedPath =
        res.data?.path || res.data?.url || res.data?.filename || '';
      setValues(prev => ({
        ...prev,
        [fieldId]: storedPath,
      }));
    } catch (uploadErr) {
      console.error('File upload failed', uploadErr);
      setError('Failed to upload file. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    setSubmitting(true);
    try {
      await api.post(`/api/forms/${formDef.id}/submissions`, {
        values,
      });
      setSuccess('Form submitted successfully.');
      // Clear but keep page
      setValues({});
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit form.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`dynamic-form-container form-${formDef.id}`}>
      <div className="content-wrapper">
        <div className="dynamic-form-header">
          <h2>{formDef.title}</h2>
          {formDef.description && <p>{formDef.description}</p>}
          <p className="required-note">* Indicates required question</p>
        </div>

        <form onSubmit={handleSubmit} className="dynamic-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {formDef.sections.map(section => (
            <div key={section.id} className="dynamic-form-section">
              {section.title && <h3>{section.title}</h3>}
              {section.requiredNote && (
                <p className="section-required-note">
                  Check box if yes. If no – leave blank and add comment at the end.
                </p>
              )}

              <div className="dynamic-form-fields">
                {section.fields.map(field => {
                  const value = values[field.id] || '';

                  const isSystem48 = formDef.id === 'system48';
                  const isApMeds = formDef.id === 'apMeds';
                  const isParamedicMeds = formDef.id === 'paramedicMeds';
                  const isBlsBag = formDef.id === 'blsBagUpdated';
                  const isEmtMeds = formDef.id === 'emtMeds';
                  const tamperTaggedYes =
                    isSystem48 && values.tamperSealTagged === 'Yes';

                  const controlledTamperYes =
                    isApMeds && values.controlledTamperTagged === 'Yes';
                  const apBagTamperYes =
                    isApMeds && values.apBagTamperTagged === 'Yes';
                  const medsBagTamperYes =
                    isParamedicMeds && values.medsBagTamperTagged === 'Yes';
                  const blsTamperYes =
                    isBlsBag && values.blsTamperTagged === 'Yes';
                  const emtPouchYes =
                    isEmtMeds && values.emtPouchSealed === 'Yes';

                  let inputRequired = field.required;

                  // ALS Bag: when tamper seal tagged yes, only the tamper question stays required
                  if (isSystem48 && tamperTaggedYes && field.id !== 'tamperSealTagged') {
                    inputRequired = false;
                  }

                  // Paramedic Meds: when meds bag seal tagged yes, only that tamper question stays required
                  if (
                    isParamedicMeds &&
                    medsBagTamperYes &&
                    section.id === 'paramedicMeds-details' &&
                    field.id !== 'medsBagTamperTagged'
                  ) {
                    inputRequired = field.id === 'pin' ||
                      field.id === 'controlledPouchNumber' ||
                      field.id === 'completedAt' ||
                      field.id === 'email' ||
                      field.id === 'medsBagTamperTagged';
                  }

                  if (
                    isParamedicMeds &&
                    medsBagTamperYes &&
                    section.id === 'paramedicMeds-items'
                  ) {
                    inputRequired = false;
                  }

                  // EMT Meds: when pouch sealed yes, only details (name, PIN, pouch, seal, question) stay required
                  if (
                    isEmtMeds &&
                    emtPouchYes &&
                    section.id === 'emtMeds-details' &&
                    field.id !== 'emtPouchSealed'
                  ) {
                    inputRequired =
                      field.id === 'practitionerName' ||
                      field.id === 'practitionerPin' ||
                      field.id === 'pouchNumber' ||
                      field.id === 'emtSealNumber' ||
                      field.id === 'emtPouchSealed';
                  }

                  if (
                    isEmtMeds &&
                    emtPouchYes &&
                    section.id === 'emtMeds-items'
                  ) {
                    inputRequired = false;
                  }

                  // AP Meds: controlled pouch
                  if (
                    isApMeds &&
                    controlledTamperYes &&
                    section.id === 'apMeds-controlled' &&
                    field.id !== 'controlledTamperTagged'
                  ) {
                    inputRequired = false;
                  }

                  // AP Meds: AP meds bag other medications
                  if (
                    isApMeds &&
                    apBagTamperYes &&
                    section.id === 'apMeds-other' &&
                    field.id !== 'apBagTamperTagged'
                  ) {
                    inputRequired = false;
                  }

                  const isMetaFieldAls =
                    field.id === 'tamperSealTagged' ||
                    field.id === 'practitionerName' ||
                    field.id === 'pin' ||
                    field.id === 'bagNumber' ||
                    field.id === 'completedAt' ||
                    field.id === 'email';

                  const isMetaFieldBls =
                    field.id === 'blsTamperTagged' ||
                    field.id === 'practitionerName' ||
                    field.id === 'practitionerPin' ||
                    field.id === 'bagNumber' ||
                    field.id === 'sealNumber' ||
                    field.id === 'nameLocation' ||
                    field.id === 'oxygenCdLevel';

                  let isDisabled = false;

                  // ALS Bag: grey out all non-meta fields when tamper seal tagged yes
                  if (isSystem48 && tamperTaggedYes && !isMetaFieldAls) {
                    isDisabled = true;
                  }

                  // Paramedic Meds: grey out all items when meds bag seal tagged yes
                  if (
                    isParamedicMeds &&
                    medsBagTamperYes &&
                    section.id === 'paramedicMeds-items'
                  ) {
                    isDisabled = true;
                  }

                  // AP Meds: grey out controlled pouch fields when its tamper seal tagged yes
                  if (
                    isApMeds &&
                    controlledTamperYes &&
                    section.id === 'apMeds-controlled' &&
                    field.id !== 'controlledTamperTagged'
                  ) {
                    isDisabled = true;
                  }

                  // AP Meds: grey out other meds when AP meds bag tamper seal tagged yes
                  if (
                    isApMeds &&
                    apBagTamperYes &&
                    section.id === 'apMeds-other' &&
                    field.id !== 'apBagTamperTagged'
                  ) {
                    isDisabled = true;
                  }

                  // BLS Bag: grey out all non-meta fields (except comments) when tamper seal tagged yes
                  if (
                    isBlsBag &&
                    blsTamperYes &&
                    !isMetaFieldBls &&
                    section.id !== 'bls-comments'
                  ) {
                    isDisabled = true;
                  }

                  // EMT Meds: grey out medications when pouch sealed yes
                  if (
                    isEmtMeds &&
                    emtPouchYes &&
                    section.id === 'emtMeds-items'
                  ) {
                    isDisabled = true;
                  }

                  const isFullRowTamper =
                    (isSystem48 && field.id === 'tamperSealTagged') ||
                    (isApMeds &&
                      (field.id === 'controlledTamperTagged' ||
                        field.id === 'apBagTamperTagged')) ||
                    (isBlsBag && field.id === 'blsTamperTagged') ||
                    (isEmtMeds && field.id === 'emtPouchSealed');

                  const groupClass = isFullRowTamper
                    ? 'form-group full-width'
                    : 'form-group';

                  const label = (
                    <label htmlFor={field.id}>
                      {field.label}{' '}
                      {inputRequired && <span className="required">*</span>}
                    </label>
                  );

                  if (field.type === 'checkbox') {
                    return (
                      <div
                        key={field.id}
                        className={
                          field.type === 'checkbox'
                            ? 'form-group checkbox-group'
                            : groupClass
                        }
                      >
                        <label>
                          <input
                            type="checkbox"
                            id={field.id}
                            checked={!!values[field.id]}
                            onChange={() => handleCheckboxChange(field.id)}
                          />
                          {field.label}
                        </label>
                      </div>
                    );
                  }

                  if (field.type === 'radio') {
                    return (
                      <div key={field.id} className={groupClass}>
                        {label}
                        <div className="radio-group">
                          {field.options?.map(opt => (
                            <label key={opt}>
                              <input
                                type="radio"
                                name={field.id}
                                value={opt}
                                checked={value === opt}
                                onChange={e => handleChange(field.id, e.target.value)}
                                required={inputRequired}
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (field.type === 'select') {
                    const isSystem48Select = isSystem48;
                    const quantityFieldId = `${field.id}_quantity`;
                    const quantityValue = values[quantityFieldId] || '';
                    const showQuantity =
                      isSystem48Select && value === 'No' && !isDisabled;

                    return (
                      <div key={field.id} className={groupClass}>
                        {label}
                        <select
                          id={field.id}
                          value={value}
                          onChange={e => handleChange(field.id, e.target.value)}
                          required={inputRequired}
                          disabled={isDisabled}
                        >
                          <option value="">Select...</option>
                          {field.options?.map(opt => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        {field.hint && (
                          <small className="form-hint">{field.hint}</small>
                        )}
                        {showQuantity && (
                          <div className="form-group" style={{ marginTop: 8 }}>
                            <label htmlFor={quantityFieldId}>
                              Quantity{' '}
                              <span className="required">*</span>
                            </label>
                            <input
                              id={quantityFieldId}
                              type="number"
                              min="0"
                              value={quantityValue}
                              onChange={e =>
                                handleChange(quantityFieldId, e.target.value)
                              }
                              required={showQuantity}
                              disabled={isDisabled}
                            />
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (field.type === 'textarea') {
                    return (
                      <div key={field.id} className={groupClass}>
                        {label}
                        <textarea
                          id={field.id}
                          value={value}
                          onChange={e => handleChange(field.id, e.target.value)}
                          required={inputRequired}
                          rows={4}
                          disabled={isDisabled}
                        />
                        {field.hint && (
                          <small className="form-hint">{field.hint}</small>
                        )}
                      </div>
                    );
                  }

                  if (field.type === 'file') {
                    return (
                      <div key={field.id} className={groupClass}>
                        {label}
                        <input
                          id={field.id}
                          type="file"
                          accept="image/*"
                          onChange={e =>
                            handleFileUpload(field.id, e.target.files?.[0] || null)
                          }
                        />
                        {values[field.id] && (
                          <small className="form-hint">
                            File uploaded.
                          </small>
                        )}
                      </div>
                    );
                  }

                  // text / email / number etc.
                  if (field.type === 'datetime') {
                    return (
                      <div key={field.id} className={groupClass}>
                        {label}
                        <input
                          id={field.id}
                          type="datetime-local"
                          value={value}
                          onChange={e => handleChange(field.id, e.target.value)}
                          required={inputRequired}
                          disabled
                        />
                      </div>
                    );
                  }

                  return (
                    <div key={field.id} className={groupClass}>
                      {label}
                      <input
                        id={field.id}
                        type={field.type || 'text'}
                        value={value}
                        onChange={e => handleChange(field.id, e.target.value)}
                        required={inputRequired}
                        disabled={isDisabled}
                      />
                      {field.hint && (
                        <small className="form-hint">{field.hint}</small>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DynamicForm;


