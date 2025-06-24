import React from 'react';

const ProjectCard = ({ project }) => {
  return (
    <div className="project-card">
      <h3 className="project-title">{project.title}</h3>
      <ul className="scenario-list">
        {project.scenarios.map((item) => (
          <li key={item.id} className="scenario-item">
            <p className="scenario-description">
              <strong>Scenario:</strong> {item.scenario}
            </p>
            <p className="scenario-outcome">
              <strong>Expected Outcome:</strong> {item.expected_outcome}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectCard;