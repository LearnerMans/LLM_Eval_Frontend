import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast'; // Import the Toaster and toast function
import './App.css';
import FileUploader from './components/FileUploader';
import ProjectCard from './components/ProjectCard';
import CreateProjectModal from './components/CreateProjectModal';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ProjectPage from './components/ProjectPage';

function MainPage({ projects, filteredProjects, searchTerm, setSearchTerm, loading, error, isModalOpen, setIsModalOpen, handleProjectCreated, handleProjectUpdated, handleProjectDeleted, editProject, setEditProject }) {
  const navigate = useNavigate();
  return (
    <div className="app-container">
      <CreateProjectModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditProject(null); }}
        onProjectCreated={handleProjectCreated}
        onProjectUpdated={handleProjectUpdated}
        editProject={editProject}
      />
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
        <div>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            Create New Project
          </button>
        </div>
      </header>

      <main>
        <section className="projects-section">
          <div className="projects-header">
            <h2>Existing Projects</h2>
            <input 
              type="text"
              placeholder="Filter projects or scenarios..."
              className="filter-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading && <p>Loading projects...</p>}
          {error && <p className="error-message">Error: {error}</p>}
          
          <div className="project-grid">
            {!loading && !error && projects.map(project => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onClick={() => navigate(`/project/${project.id}`)}
                onEdit={(proj) => { setEditProject(proj); setIsModalOpen(true); }}
                onDelete={async (proj) => {
                  if (window.confirm(`Are you sure you want to delete project '${proj.title}'?`)) {
                    try {
                      const res = await fetch(`http://localhost:8080/projects/${proj.id}`, { method: 'DELETE' });
                      if (!res.ok && res.status !== 204) throw new Error('Failed to delete');
                      handleProjectDeleted(proj.id);
                      toast.success('Project deleted');
                    } catch (e) {
                      toast.error('Delete failed: ' + e.message);
                    }
                  }
                }}
              />
            ))}
          </div>
          {!loading && !error && projects.length === 0 && (
            <p>No projects found.</p>
          )}
        </section>
      </main>
    </div>
  )
}

function App() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:8080/projects');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProjects(data || []);
        console.log("Fetched projects:", data);
      } catch (e) {
        setError(e.message);
        toast.error(`Failed to fetch projects: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    console.log("Projects:", projects);
    const filtered = projects.filter(project => {
      const titleMatch = project.title.toLowerCase().includes(lowercasedFilter);
      const scenarioMatch = Array.isArray(project.scenarios) && project.scenarios.some(scenario => 
        scenario.Description.toLowerCase().includes(lowercasedFilter)
      );
      return titleMatch || scenarioMatch;
    });
    setFilteredProjects(filtered);
    console.log("Filtered projects:", filtered);
  }, [searchTerm, projects]);

  const handleProjectCreated = (newProject) => {
    setProjects([newProject, ...projects]);
  };
  const handleProjectUpdated = (updatedProject) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
    setEditProject(null);
  };
  const handleProjectDeleted = (id) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  return (
    <Routes>
      <Route path="/" element={
        <MainPage 
          projects={projects}
          filteredProjects={filteredProjects}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          loading={loading}
          error={error}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          handleProjectCreated={handleProjectCreated}
          handleProjectUpdated={handleProjectUpdated}
          handleProjectDeleted={handleProjectDeleted}
          editProject={editProject}
          setEditProject={setEditProject}
        />
      } />
      <Route path="/project/:id" element={<ProjectPage />} />
    </Routes>
  );
}

export default App