import React from 'react';
import './ScenarioTable.css';

// --- SVG Icon Components ---
const FaPlay = () => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path></svg>
);
const FaStop = () => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48z"></path></svg>
);
const FiRefreshCw = () => (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
);
const MdErrorOutline = ({ size = 20 }) => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height={size} width={size} xmlns="http://www.w3.org/2000/svg"><path d="M11 15h2v2h-2v-2zm0-8h2v6h-2V7zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path></svg>
);

const RunningOrb = () => (
  <div className="running-orb">
    <div className="running-orb-ping"></div>
    <div className="running-orb-core"></div>
  </div>
);

const ScenarioTable = ({ scenarios, onAction }) => {
  // status color classes
  const getStatusClass = (status) => {
    switch (status) {
      case 'Pass': return 'status-pass';
      case 'Fail': return 'status-fail';
      case 'Requires Oversight': return 'status-oversight';
      case 'Running': return 'status-running';
      default: return 'status-notrun';
    }
  };

  const renderActionButton = (scenario) => {
    switch (scenario.status) {
      case 'Not Run':
        return (
          <button className="action-btn run" onClick={() => onAction(scenario, 'run')} title="Run Test">
            <FaPlay />
          </button>
        );
      case 'Running':
        return (
          <button className="action-btn stop" onClick={() => onAction(scenario, 'stop')} title="Stop Test">
            <FaStop />
          </button>
        );
      default:
        return (
          <div className="action-btn-group">
            {(scenario.status === 'Fail' || scenario.status === 'Requires Oversight') && (
              <button className="action-btn error" title="View Error">
                <MdErrorOutline size={20} />
              </button>
            )}
            <button className="action-btn rerun" onClick={() => onAction(scenario, 'rerun')} title="Rerun Test">
              <FiRefreshCw />
            </button>
          </div>
        );
    }
  };

  return (
    <div className="scenario-table-container">
      <h2 className="scenario-table-title">Test Scenarios</h2>
      <div className="scenario-table-wrapper">
        <table className="scenario-table">
          <thead>
            <tr>
              <th>Scenario</th>
              <th>Expected Outcome</th>
              <th>Status</th>
              <th className="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((scenario) => (
              <tr key={scenario.id}>
                <td>{scenario.description}</td>
                <td>{scenario.expected_output}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(scenario.status)}`}>
                    {scenario.status === 'Running' && <RunningOrb />}
                    {scenario.status}
                  </span>
                </td>
                <td className="actions-col">{renderActionButton(scenario)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScenarioTable; 