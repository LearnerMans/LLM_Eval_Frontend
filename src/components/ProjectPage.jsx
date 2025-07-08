import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FileUploader from './FileUploader'; // Assuming FileUploader is in the same directory
import { FiArrowLeft } from 'react-icons/fi';
import { Toaster } from 'react-hot-toast';
import ScenarioTable from './ScenarioTable';

// NOTE: The updated CSS file is assumed to be imported here or globally.
// import '../App.css';

const ProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // In a real app, you would fetch the project name. We'll construct it for this example.
  const [projectName, setProjectName] = useState(`Project ${id}`); 
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploader, setShowUploader] = useState(false);
  const [testStatus, setTestStatus] = useState(null);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [statusError, setStatusError] = useState(null);
  let pollInterval = null;

  const fetchScenarios = () => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:8080/api/scenarios/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch scenarios');
        return res.json();
      })
      .then((data) => {
        setScenarios(data);
        // If there are no scenarios, default to showing the uploader
        if (data.length === 0) {
          setShowUploader(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchScenarios();
    // In a real app, you might also fetch project details like the name
  }, [id]);

  // Simulate status changes for demo (replace with real API calls for run/stop/rerun)
  const handleScenarioAction = async (scenario, action) => {
    console.log(`[RUNNER] Action triggered:`, { scenarioId: scenario.id, action, scenario });
    if (action === 'run' || action === 'rerun') {
      try {
        const res = await fetch(`http://localhost:8080/scenarios/${scenario.id}/run`, { method: 'POST' });
        if (!res.ok) throw new Error('Failed to start scenario run');
        const data = await res.json();
        console.log('[RUNNER][BACKEND]', data);
        // Optionally refresh scenarios from backend here
        // fetchScenarios();
      } catch (err) {
        console.error('[RUNNER][BACKEND][ERROR]', err);
        // fallback to local simulation if backend fails
        setScenarios((prev) =>
          prev.map((s) => {
            if (s.id === scenario.id) {
              return { ...s, status: 'Running' };
            }
            return s;
          })
        );
        setTimeout(() => {
          setScenarios((current) =>
            current.map((sc) =>
              sc.id === scenario.id
                ? { ...sc, status: ['Pass', 'Fail', 'Requires Oversight'][Math.floor(Math.random() * 3)] }
                : sc
            )
          );
        }, 3000);
      }
    } else if (action === 'stop') {
      setScenarios((prev) =>
        prev.map((s) => (s.id === scenario.id ? { ...s, status: 'Fail' } : s))
      );
    }
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

  // Handle upload completion
  const handleUploadComplete = () => {
    fetchScenarios();
    setShowUploader(false); // Switch back to the table view after upload
  };

  // Function to start a test run
  const handleRunTest = async () => {
    setIsRunningTest(true);
    setTestStatus(null);
    setStatusError(null);
    console.log(`[RUN-TEST][FRONTEND] Initiating test run for project: ${id}`);
    try {
      const url = `http://localhost:8080/projects/${id}/run-test`;
      console.log(`[RUN-TEST][FRONTEND] Sending POST request to: ${url}`);
      const res = await fetch(url, {
        method: 'POST',
      });
      console.log(`[RUN-TEST][FRONTEND] Response status: ${res.status}`);
      if (!res.ok) throw new Error('Failed to start test run');
      const data = await res.json();
      console.log(`[RUN-TEST][FRONTEND] Response data:`, data);
      // Start polling for status
      pollTestStatus();
    } catch (err) {
      console.error(`[RUN-TEST][FRONTEND][ERROR]`, err);
      setStatusError(err.message);
      setIsRunningTest(false);
    }
  };

  // Function to poll test status
  const pollTestStatus = () => {
    pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:8080/projects/${id}/test-status`);
        if (!res.ok) throw new Error('Failed to get test status');
        const data = await res.json();
        setTestStatus(data.status);
        if (data.status === 'completed' || data.status === 'failed') {
          clearInterval(pollInterval);
          setIsRunningTest(false);
        }
      } catch (err) {
        setStatusError(err.message);
        clearInterval(pollInterval);
        setIsRunningTest(false);
      }
    }, 3000);
  };

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, []);

  return (
    <div className="project-page-container">
      <Toaster position="top-right" />
      
      <button className="btn-back" onClick={() => navigate('/')} style={{ marginBottom: '1rem' }}>
        <FiArrowLeft />
        <span>Back to Projects</span>
      </button>

      {/*
        FEEDBACK APPLIED: The header is refactored to better integrate information
        and create a clearer hierarchy, following the "Refactoring UI" principle
        of avoiding verbose, label-like text.
      */}
      <header className="project-header">
        {/* The Project ID is now part of the main heading for better context */}
        <h1>{projectName}</h1>
        {/* A subtitle provides context without using a "Label: value" format */}
        <p>Manage, run, and upload new test scenarios.</p>
        <button className="btn-primary" onClick={handleRunTest} disabled={isRunningTest} style={{marginTop: '1rem'}}>
          {isRunningTest ? 'Running Test...' : 'Run Test'}
        </button>
        {isRunningTest && <div style={{color: '#888', marginTop: '0.5rem'}}>Test Status: {testStatus || 'Starting...'}</div>}
        {statusError && <div style={{color: 'red', marginTop: '0.5rem'}}>Error: {statusError}</div>}
      </header>

      <main>
        {/* We only show the toggle button if there are scenarios to toggle to */}
        {scenarios.length > 0 && (
          <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
            <button className="btn-secondary" onClick={() => setShowUploader((prev) => !prev)}>
              {showUploader ? 'Show Scenarios' : 'Upload New Scenarios'}
            </button>
          </div>
        )}

        {/* Conditional rendering logic is now cleaner */}
        {showUploader ? (
          <section className="upload-section-card">
            <h2>Upload New Scenarios</h2>
            <p className="section-description">
              Drop a CSV file below or click to select one. Use the template to ensure correct formatting.
            </p>
            <FileUploader testId={id} onUpload={handleUploadComplete} />
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button className="btn-primary" onClick={handleDownloadTemplate}>
                Download CSV Template
              </button>
            </div>
          </section>
        ) : (
          <section>
            {loading ? (
              <div style={{ color: '#888', margin: '2rem 0' }}>Loading scenarios...</div>
            ) : error ? (
              <div style={{ color: 'red', margin: '2rem 0' }}>Error: {error}</div>
            ) : (
              <ScenarioTable scenarios={scenarios} onAction={handleScenarioAction} />
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default ProjectPage;