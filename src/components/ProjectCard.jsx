import React from 'react';
// Import some nice icons
import { FiBox, FiGitCommit, FiClock, FiMoreVertical, FiTag } from 'react-icons/fi';

const ProjectCard = ({ project, onClick, onEdit, onDelete }) => {
  // A helper to format the scenario count safely
  const getScenarioCount = () => {
    if (!project.scenarios) return 0;
    if (Array.isArray(project.scenarios)) return project.scenarios.length;
    return 'N/A';
  };

  return (
    <div className="project-card refined" onClick={onClick} style={{ cursor: 'pointer' }}> {/* We'll add a 'refined' class for new styles */}
      
      {/* --- Card Header --- */}
      <div className="card-header">
        <h3 className="project-title">{project.title}</h3>
        <button className="card-menu-btn" onClick={e => e.stopPropagation()}>
          <FiMoreVertical size={20} />
        </button>
      </div>

      {/* --- Main Stats Grid --- */}
      <div className="card-stats-grid">
        <div className="stat-item">
          <FiBox className="stat-icon" />
          <div className="stat-text">
            <span className="stat-value">{getScenarioCount()}</span>
            <span className="stat-label">Scenarios</span>
          </div>
        </div>
        <div className="stat-item">
          <FiGitCommit className="stat-icon" />
          <div className="stat-text">
            <span className="stat-value">{project.max_interactions ?? 'N/A'}</span>
            <span className="stat-label">Max Interactions</span>
          </div>
        </div>
      </div>
      
      {/* --- Meta Information --- */}
      <div className="card-meta">
          <div className="meta-item">
              <FiTag size={14} />
              <span>Project ID: {project.project_id}</span>
          </div>
           <div className="meta-item">
              <FiTag size={14} />
              <span>Tenant ID: {project.tenant_id}</span>
          </div>
      </div>

      {/* --- Card Footer --- */}
      <div className="card-footer">
        <div className="footer-date">
          <FiClock size={14} />
          <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
        </div>
        <div className="footer-actions">
           {/* You can add real buttons here later */}
           <button className="btn-secondary btn-small" onClick={e => { e.stopPropagation(); onClick && onClick(); }}>View</button>
           <button className="btn-secondary btn-small" onClick={e => { e.stopPropagation(); onEdit && onEdit(project); }}>Edit</button>
           <button 
             className="btn-secondary btn-small btn-delete"
             style={{ marginLeft: '1rem', borderColor: '#EF4444', color: '#EF4444' }}
             onClick={e => { e.stopPropagation(); onDelete && onDelete(project); }}
             aria-label="Delete project"
             title="Delete project"
           >
             Delete
           </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;