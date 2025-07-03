import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FileUploader from './FileUploader'; // Assuming FileUploader is in the same directory
import { FiArrowLeft } from 'react-icons/fi';
import { Toaster } from 'react-hot-toast';
import ScenarioTable from './ScenarioTable';
import { useEffect, useState } from 'react';

const ProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:8080/api/scenarios/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch scenarios');
        return res.json();
      })
      .then((data) => {
        setScenarios(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // Simulate status changes for demo (replace with real API calls for run/stop/rerun)
  const handleScenarioAction = (scenario, action) => {
    setScenarios((prev) =>
      prev.map((s) => {
        if (s.id === scenario.id) {
          if (action === 'run') {
            // Start running
            setTimeout(() => {
              setScenarios((current) =>
                current.map((sc) =>
                  sc.id === scenario.id
                    ? { ...sc, status: ['Pass', 'Fail', 'Requires Oversight'][Math.floor(Math.random() * 3)] }
                    : sc
                )
              );
            }, 3000);
            return { ...s, status: 'Running' };
          } else if (action === 'stop') {
            return { ...s, status: 'Fail' };
          } else if (action === 'rerun') {
            setTimeout(() => {
              setScenarios((current) =>
                current.map((sc) =>
                  sc.id === scenario.id
                    ? { ...sc, status: ['Pass', 'Fail', 'Requires Oversight'][Math.floor(Math.random() * 3)] }
                    : sc
                )
              );
            }, 3000);
            return { ...s, status: 'Running' };
          }
        }
        return s;
      })
    );
  };

  const handleDownloadTemplate = () => {
    // This logic remains the same
    const csvContent = "data:text/csv;charset=utf-8,scenario,expected_outcome\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "scenario_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    // REFINED: Using new container for better layout control
    <div className="project-page-container">
      <Toaster position="top-right" />
      {/* REFINED: A more descriptive and styled header */}
      <header className="project-header">
        <button className="btn-back" onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <FiArrowLeft size={20} />
          <span>Back to Projects</span>
        </button>
        <h1>Project Details</h1>
        <p>Managing scenarios for project ID: {id}</p>
      </header>

      <main>
        {/* REFINED: The uploader is now wrapped in a styled card */}
        <section className="upload-section-card">
          <h2>Upload New Scenarios</h2>
          <p className="section-description">
            Drop a CSV file below or click to select one. Use the template to ensure correct formatting.
          </p>
          <FileUploader testId={id} />
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button className="btn-primary" onClick={handleDownloadTemplate}>
              Download CSV Template
            </button>
          </div>
        </section>
        
        {/* Scenario Table Section */}
        <section>
          {loading ? (
            <div style={{ color: '#888', margin: '2rem 0' }}>Loading scenarios...</div>
          ) : error ? (
            <div style={{ color: 'red', margin: '2rem 0' }}>Error: {error}</div>
          ) : (
            <ScenarioTable scenarios={scenarios} onAction={handleScenarioAction} />
          )}
        </section>
      </main>
    </div>
  );
};

export default ProjectPage;