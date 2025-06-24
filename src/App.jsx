import React from 'react';
import { Toaster } from 'react-hot-toast'; // Import the Toaster
import './App.css';
import FileUploader from './components/FileUploader';
import ProjectCard from './components/ProjectCard';

// Mock data for projects (remains the same)
const mockProjects = [
  {
    id: 1,
    title: 'E-commerce Checkout Flow',
    scenarios: [
      { id: 's1', scenario: 'User adds item to cart', expected_outcome: 'Cart count updates to 1' },
      { id: 's2', scenario: 'User proceeds to checkout with an empty cart', expected_outcome: 'An error message "Your cart is empty" is displayed' },
      { id: 's3', scenario: 'User enters an invalid coupon code', expected_outcome: 'An error message "Invalid coupon code" is shown' },
    ]
  },
  {
    id: 2,
    title: 'User Authentication Module',
    scenarios: [
      { id: 's4', scenario: 'User logs in with correct credentials', expected_outcome: 'User is redirected to the dashboard' },
      { id: 's5', scenario: 'User attempts login with incorrect password', expected_outcome: '"Invalid username or password" error is displayed' },
    ]
  },
  // ... other projects
];

function App() {

  const handleDownloadTemplate = () => {
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
    <div className="app-container">
      {/* Add the Toaster component here and configure its style */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1E1E1E', // --surface-color
            color: '#F0F0F0', // --text-primary
            border: '1px solid #3A3A3A', // --border-color
          },
          success: {
            iconTheme: {
              primary: '#10B981', // A nice green
              secondary: '#1E1E1E',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444', // A nice red
              secondary: '#1E1E1E',
            },
          },
        }}
      />
      
      <header className="app-header">
        <h1>Test Scenario Manager</h1>
        <button className="btn-primary" onClick={handleDownloadTemplate}>
          Download CSV Template
        </button>
      </header>

      <main>
        <section className="upload-section">
          <h2>Upload New Scenarios</h2>
          <FileUploader />
        </section>

        <section className="projects-section">
          <h2>Existing Projects</h2>
          <div className="project-grid">
            {mockProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App