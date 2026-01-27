import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';
import './RunsheetList.css';

const RunsheetList = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [runsheets, setRunsheets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRunsheets();
  }, [currentPage, searchTerm]);

  const fetchRunsheets = async () => {
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
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="runsheet-container">
      <div className="content-wrapper">
        <div className="instructions">
          <p>You can view the run sheet instructions by clicking, <a href="#instructions">here</a>.</p>
        </div>

        <div className="runsheet-section">
          <h2>Runsheets</h2>
          
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
                          <button className="btn-link">View</button>
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
      </div>
    </div>
  );
};

export default RunsheetList;

