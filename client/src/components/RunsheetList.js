import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/axios';
import './RunsheetList.css';

const RunsheetList = () => {
  const [runsheets, setRunsheets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({
    shiftDate: '',
    bookOnTime: '',
    bookOffTime: '',
    trustStation: '',
    trustContract: '',
    trustCallsign: '',
    drugBagNumbers: '',
    drugBagSeals: '',
    vehicleRegistration: '',
    fleetNumber: '',
    startMileage: '',
    startFuel: '',
    crew1Name: '',
    crew1Pin: '',
    crew1Grade: '',
    crew2Name: '',
    crew2Pin: '',
    crew2Grade: '',
    mealBreak: '',
    eosDrugBag: '',
    eosMileage: '',
    eosBookOffTime: '',
    eosFuel: '',
    commentsNotes: '',
  });
  const [viewRow, setViewRow] = useState(null);

  const fetchRunsheets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/runsheets', {
        params: {
          page: currentPage,
          limit: 25,
          search: searchTerm
        }
      });
      setRunsheets(response.data.runsheets);
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching runsheets:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    fetchRunsheets();
  }, [fetchRunsheets]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleStartShiftSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSubmitting(true);
    try {
      await api.post('/api/runsheets', formValues);
      setFormSubmitting(false);
      setShowForm(false);
      setFormValues({
        shiftDate: '',
        bookOnTime: '',
        bookOffTime: '',
        trustStation: '',
        trustContract: '',
        trustCallsign: '',
        drugBagNumbers: '',
        drugBagSeals: '',
        vehicleRegistration: '',
        fleetNumber: '',
        startMileage: '',
        startFuel: '',
        crew1Name: '',
        crew1Pin: '',
        crew1Grade: '',
        crew2Name: '',
        crew2Pin: '',
        crew2Grade: '',
        mealBreak: '',
        eosDrugBag: '',
        eosMileage: '',
        eosBookOffTime: '',
        eosFuel: '',
        commentsNotes: '',
      });
      fetchRunsheets();
    } catch (err) {
      console.error('Error creating runsheet:', err);
      setFormError(
        err.response?.data?.error || 'Failed to create runsheet. Please try again.'
      );
      setFormSubmitting(false);
    }
  };

  return (
    <div className="runsheet-container">
      <div className="content-wrapper">
        <div className="runsheet-section">
          <div className="runsheet-header-row">
            <h2>Frontline Run Sheets</h2>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowForm((v) => !v)}
            >
              {showForm ? 'Close Start Shift' : 'Start Shift'}
            </button>
          </div>

          {showForm && (
            <div className="runsheet-form-card">
              <h3>Start Shift – Runsheet Details</h3>
              {formError && <div className="runsheet-form-error">{formError}</div>}
              <form onSubmit={handleStartShiftSubmit} className="runsheet-form-grid">
                <div className="runsheet-form-group">
                  <label>Shift Date</label>
                  <input
                    type="text"
                    name="shiftDate"
                    value={formValues.shiftDate}
                    onChange={handleFormChange}
                    placeholder="dd/mm/yyyy"
                    required
                  />
                </div>
                <div className="runsheet-form-group">
                  <label>Book on Time</label>
                  <input
                    type="text"
                    name="bookOnTime"
                    value={formValues.bookOnTime}
                    onChange={handleFormChange}
                    placeholder="e.g. 19:59"
                    required
                  />
                </div>
                <div className="runsheet-form-group">
                  <label>Book off Time</label>
                  <input
                    type="text"
                    name="bookOffTime"
                    value={formValues.bookOffTime}
                    onChange={handleFormChange}
                    placeholder="e.g. 06:45"
                  />
                </div>

                <div className="runsheet-form-group">
                  <label>Trust Station</label>
                  <input
                    type="text"
                    name="trustStation"
                    value={formValues.trustStation}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="runsheet-form-group">
                  <label>Trust Contract</label>
                  <input
                    type="text"
                    name="trustContract"
                    value={formValues.trustContract}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="runsheet-form-group">
                  <label>Trust Callsign</label>
                  <input
                    type="text"
                    name="trustCallsign"
                    value={formValues.trustCallsign}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="runsheet-form-group">
                  <label>Drug Bag Number(s)</label>
                  <input
                    type="text"
                    name="drugBagNumbers"
                    value={formValues.drugBagNumbers}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="runsheet-form-group">
                  <label>Drug Bag Seal(s)</label>
                  <input
                    type="text"
                    name="drugBagSeals"
                    value={formValues.drugBagSeals}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="runsheet-form-group">
                  <label>Vehicle Registration</label>
                  <input
                    type="text"
                    name="vehicleRegistration"
                    value={formValues.vehicleRegistration}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="runsheet-form-group">
                  <label>Fleet (EA) Number</label>
                  <input
                    type="text"
                    name="fleetNumber"
                    value={formValues.fleetNumber}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="runsheet-form-group">
                  <label>Start Mileage</label>
                  <input
                    type="text"
                    name="startMileage"
                    value={formValues.startMileage}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="runsheet-form-group">
                  <label>Start Fuel</label>
                  <input
                    type="text"
                    name="startFuel"
                    value={formValues.startFuel}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="runsheet-form-group">
                  <label>Crew 1 Name</label>
                  <input
                    type="text"
                    name="crew1Name"
                    value={formValues.crew1Name}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="runsheet-form-group">
                  <label>Crew 1 PIN</label>
                  <input
                    type="text"
                    name="crew1Pin"
                    value={formValues.crew1Pin}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="runsheet-form-group">
                  <label>Crew 1 Grade</label>
                  <input
                    type="text"
                    name="crew1Grade"
                    value={formValues.crew1Grade}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="runsheet-form-group">
                  <label>Crew 2 Name</label>
                  <input
                    type="text"
                    name="crew2Name"
                    value={formValues.crew2Name}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="runsheet-form-group">
                  <label>Crew 2 PIN</label>
                  <input
                    type="text"
                    name="crew2Pin"
                    value={formValues.crew2Pin}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="runsheet-form-group">
                  <label>Crew 2 Grade</label>
                  <input
                    type="text"
                    name="crew2Grade"
                    value={formValues.crew2Grade}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="runsheet-form-group">
                  <label>Meal Break</label>
                  <input
                    type="text"
                    name="mealBreak"
                    value={formValues.mealBreak}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="runsheet-form-group">
                  <label>(EOS) Drug Bag</label>
                  <input
                    type="text"
                    name="eosDrugBag"
                    value={formValues.eosDrugBag}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="runsheet-form-group">
                  <label>(EOS) Mileage</label>
                  <input
                    type="text"
                    name="eosMileage"
                    value={formValues.eosMileage}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="runsheet-form-group">
                  <label>(EOS) Book Off Time</label>
                  <input
                    type="text"
                    name="eosBookOffTime"
                    value={formValues.eosBookOffTime}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="runsheet-form-group">
                  <label>(EOS) Fuel</label>
                  <input
                    type="text"
                    name="eosFuel"
                    value={formValues.eosFuel}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="runsheet-form-group runsheet-form-group-full">
                  <label>Comments / Notes</label>
                  <textarea
                    name="commentsNotes"
                    value={formValues.commentsNotes}
                    onChange={handleFormChange}
                    rows={3}
                  />
                </div>

                <div className="runsheet-form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={formSubmitting}
                  >
                    {formSubmitting ? 'Saving...' : 'Save Runsheet'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by keyword"
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>

          {loading ? (
            <div className="loading">Loading runsheets...</div>
          ) : (
            <>
              <div className="results-info">
                Showing {runsheets.length > 0 ? ((currentPage - 1) * 25 + 1) : 0}-{Math.min(currentPage * 25, total)} of {total}
              </div>

              <div className="table-container">
                <table className="runsheet-table">
                  <thead>
                    <tr>
                      <th>Shift Date</th>
                      <th>Book on Time</th>
                      <th>Book off Time</th>
                      <th>Trust</th>
                      <th>Callsign</th>
                      <th>Shift Ended</th>
                      <th>Runsheet Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {runsheets.map((runsheet) => (
                      <tr key={runsheet.id}>
                        <td>{runsheet.shiftDate}</td>
                        <td>{runsheet.bookOnTime}</td>
                        <td>{runsheet.bookOffTime}</td>
                        <td>{runsheet.trust}</td>
                      <td>{runsheet.callsign}</td>
                        <td>{runsheet.shiftEnded ? 'True' : 'False'}</td>
                        <td>
                        <button
                          type="button"
                          className="btn-link"
                          onClick={() => setViewRow(runsheet)}
                        >
                          View
                        </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination">
                <button
                  className="btn btn-secondary"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="page-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn btn-secondary"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>

        {viewRow && (
          <div
            className="runsheet-view-overlay"
            onClick={() => setViewRow(null)}
            role="presentation"
          >
            <div
              className="runsheet-view-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="runsheet-view-header">
                <h3>Runsheet Details (ID {viewRow.id})</h3>
                <button
                  type="button"
                  className="runsheet-view-close"
                  onClick={() => setViewRow(null)}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <div className="runsheet-view-body">
                <section className="runsheet-view-section">
                  <h4>Shift Details</h4>
                  <dl>
                    <dt>Shift Date</dt>
                    <dd>{viewRow.shiftDate || '—'}</dd>
                    <dt>Book on Time</dt>
                    <dd>{viewRow.bookOnTime || '—'}</dd>
                    <dt>Book off Time</dt>
                    <dd>{viewRow.bookOffTime || '—'}</dd>
                    <dt>Trust Station</dt>
                    <dd>{viewRow.trustStation || '—'}</dd>
                    <dt>Trust Contract</dt>
                    <dd>{viewRow.trustContract || viewRow.trust || '—'}</dd>
                    <dt>Trust Callsign</dt>
                    <dd>{viewRow.trustCallsign || viewRow.callsign || '—'}</dd>
                  </dl>
                </section>

                <section className="runsheet-view-section">
                  <h4>Drug Bag</h4>
                  <dl>
                    <dt>Drug Bag Number(s)</dt>
                    <dd>{viewRow.drugBagNumbers || '—'}</dd>
                    <dt>Drug Bag Seal(s)</dt>
                    <dd>{viewRow.drugBagSeals || '—'}</dd>
                  </dl>
                </section>

                <section className="runsheet-view-section">
                  <h4>Vehicle</h4>
                  <dl>
                    <dt>Vehicle Registration</dt>
                    <dd>{viewRow.vehicleRegistration || '—'}</dd>
                    <dt>Fleet (EA) Number</dt>
                    <dd>{viewRow.fleetNumber || '—'}</dd>
                    <dt>Start Mileage</dt>
                    <dd>{viewRow.startMileage || '—'}</dd>
                    <dt>Start Fuel</dt>
                    <dd>{viewRow.startFuel || '—'}</dd>
                  </dl>
                </section>

                <section className="runsheet-view-section">
                  <h4>Crew</h4>
                  <dl>
                    <dt>Crew 1 Name</dt>
                    <dd>{viewRow.crew1Name || '—'}</dd>
                    <dt>Crew 1 PIN</dt>
                    <dd>{viewRow.crew1Pin || '—'}</dd>
                    <dt>Crew 1 Grade</dt>
                    <dd>{viewRow.crew1Grade || '—'}</dd>
                    <dt>Crew 2 Name</dt>
                    <dd>{viewRow.crew2Name || '—'}</dd>
                    <dt>Crew 2 PIN</dt>
                    <dd>{viewRow.crew2Pin || '—'}</dd>
                    <dt>Crew 2 Grade</dt>
                    <dd>{viewRow.crew2Grade || '—'}</dd>
                  </dl>
                </section>

                <section className="runsheet-view-section">
                  <h4>End of Shift (EOS)</h4>
                  <dl>
                    <dt>Meal Break</dt>
                    <dd>{viewRow.mealBreak || '—'}</dd>
                    <dt>(EOS) Drug Bag</dt>
                    <dd>{viewRow.eosDrugBag || '—'}</dd>
                    <dt>(EOS) Mileage</dt>
                    <dd>{viewRow.eosMileage || '—'}</dd>
                    <dt>(EOS) Book Off Time</dt>
                    <dd>{viewRow.eosBookOffTime || '—'}</dd>
                    <dt>(EOS) Fuel</dt>
                    <dd>{viewRow.eosFuel || '—'}</dd>
                  </dl>
                </section>

                <section className="runsheet-view-section">
                  <h4>Comments / Notes</h4>
                  <p>{viewRow.commentsNotes || '—'}</p>
                </section>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RunsheetList;

