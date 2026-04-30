import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";

function FeedbackList(){
  const { isAdmin } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [subjects, setSubjects] = useState([]);
  const [avgRatings, setAvgRatings] = useState({});
  
  const itemsPerPage = 5;

  useEffect(() => {
    if (isAdmin) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    filterAndPaginateData();
  }, [data, selectedSubject, currentPage]);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/feedbacks");
      setData(res.data);
      
      // Extract unique subjects
      const uniqueSubjects = [...new Set(res.data.map(item => item.subject))];
      setSubjects(uniqueSubjects);
      
      // Calculate average ratings per subject
      const ratings = {};
      uniqueSubjects.forEach(subject => {
        const subjectFeedback = res.data.filter(item => item.subject === subject);
        const avgRating = (subjectFeedback.reduce((sum, item) => sum + parseInt(item.rating), 0) / subjectFeedback.length).toFixed(2);
        ratings[subject] = avgRating;
      });
      setAvgRatings(ratings);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndPaginateData = () => {
    let filtered = data;
    
    if (selectedSubject !== "all") {
      filtered = data.filter(item => item.subject === selectedSubject);
    }
    
    const startIdx = (currentPage - 1) * itemsPerPage;
    const paginatedData = filtered.slice(startIdx, startIdx + itemsPerPage);
    setFilteredData(paginatedData);
  };

  const totalPages = selectedSubject === "all" 
    ? Math.ceil(data.length / itemsPerPage)
    : Math.ceil(data.filter(item => item.subject === selectedSubject).length / itemsPerPage);

  if (!isAdmin) {
    return (
      <div className="alert alert-warning mt-4">
        <strong>Access Denied:</strong> Please login as admin to view feedback list
      </div>
    );
  }

  if (loading) {
    return <div className="text-center mt-4"><p>Loading feedback...</p></div>;
  }

  return(
    <div className="mt-5">
      <h3>📊 Admin Feedback Dashboard</h3>

      {/* Subject Filter */}
      <div className="mb-3">
        <label className="form-label"><strong>Filter by Subject:</strong></label>
        <select 
          className="form-select"
          value={selectedSubject}
          onChange={(e) => {
            setSelectedSubject(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">All Subjects</option>
          {subjects.map(subject => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
      </div>

      {/* Average Ratings Display */}
      {selectedSubject !== "all" && (
        <div className="card bg-light p-3 mb-4">
          <h5>Average Rating for <strong>{selectedSubject}</strong></h5>
          <div className="d-flex align-items-center gap-3">
            <div className="display-4 text-info">{avgRatings[selectedSubject]}/5</div>
            <div className="text-muted">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < Math.round(avgRatings[selectedSubject]) ? "text-warning" : "text-muted"}>★</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* All Subjects Average Ratings */}
      {selectedSubject === "all" && subjects.length > 0 && (
        <div className="card p-3 mb-4 bg-light">
          <h5>Average Ratings by Subject</h5>
          <div className="row">
            {subjects.map(subject => (
              <div key={subject} className="col-md-4 mb-2">
                <div className="p-2 border rounded">
                  <strong>{subject}</strong>
                  <div className="text-info">{avgRatings[subject]}/5</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feedback Table */}
      <div className="card p-3">
        <h5>All Feedback {selectedSubject !== "all" && `(${selectedSubject})`}</h5>
        {filteredData.length === 0 ? (
          <p className="text-muted">No feedback available</p>
        ) : (
          <>
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Subject</th>
                  <th>Rating</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item._id}>
                    <td><strong>{item.studentName}</strong></td>
                    <td><span className="badge bg-secondary">{item.subject}</span></td>
                    <td>
                      <span className="badge bg-warning text-dark">
                        {item.rating}⭐
                      </span>
                    </td>
                    <td>{item.comments || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <nav className="mt-3">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button 
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <li key={i + 1} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>

            {/* Info Footer */}
            <div className="text-center text-muted small mt-2">
              Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, (selectedSubject === "all" ? data : data.filter(item => item.subject === selectedSubject)).length)} of {(selectedSubject === "all" ? data : data.filter(item => item.subject === selectedSubject)).length}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FeedbackList;