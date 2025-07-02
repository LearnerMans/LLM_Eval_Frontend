import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FileUploader from './FileUploader'; // Assuming FileUploader is in the same directory
import { FiArrowLeft } from 'react-icons/fi';

const ProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
          <FileUploader />
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button className="btn-primary" onClick={handleDownloadTemplate}>
              Download CSV Template
            </button>
          </div>
        </section>
        
        {/* You could add a list of existing scenarios here */}
      </main>
    </div>
  );
};

export default ProjectPage;