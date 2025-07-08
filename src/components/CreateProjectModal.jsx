import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CreateProjectModal = ({ isOpen, onClose, onProjectCreated, onProjectUpdated, editProject }) => {
  const [name, setName] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [maxInteractions, setMaxInteractions] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editProject) {
      setName(editProject.title || '');
      setTenantId(editProject.tenant_id || '');
      setProjectId(editProject.project_id || '');
      setMaxInteractions(editProject.max_interactions || 10);
    } else {
      setName('');
      setTenantId('');
      setProjectId('');
      setMaxInteractions(10);
    }
  }, [editProject, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let response, updatedProject;
      if (editProject) {
        response = await fetch(`http://localhost:8080/projects/${editProject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name,
            tenant_id: tenantId,
            project_id: projectId,
            max_interactions: Number(maxInteractions),
          }),
        });
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(errorData || 'Failed to update project');
        }
        // Refetch the updated project (simulate, since backend PUT returns only a message)
        updatedProject = { ...editProject, title: name, tenant_id: tenantId, project_id: projectId, max_interactions: Number(maxInteractions) };
        toast.success('Project updated successfully!');
        onProjectUpdated(updatedProject);
      } else {
        response = await fetch('http://localhost:8080/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Name: name,
            TenantID: tenantId,
            ProjectID: projectId,
            MaxInteractions: Number(maxInteractions),
          }),
        });
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(errorData || 'Failed to create project');
        }
        const newProject = await response.json();
        toast.success('Project created successfully!');
        onProjectCreated(newProject);
      }
      onClose();
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create New Project</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Project Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="tenantId">Tenant ID</label>
            <input
              type="text"
              id="tenantId"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="projectId">Project ID</label>
            <input
              type="text"
              id="projectId"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="maxInteractions">Max Interactions</label>
            <input
              type="number"
              id="maxInteractions"
              value={maxInteractions}
              onChange={(e) => setMaxInteractions(e.target.value)}
              required
              min="1"
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal; 