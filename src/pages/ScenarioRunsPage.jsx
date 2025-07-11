import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const StyleProvider = ({ children }) => {
  const styles = `
    :root {
      --font-family: 'Inter', system-ui, Avenir, Helvetica, Arial, sans-serif;
      --line-height: 1.5;
      --font-weight: 400;
      --background: #121212;
      --surface: #1E1E1E;
      --primary: #3B82F6;
      --primary-hover: #2563EB;
      --border: #3A3A3A;
      --text-primary: #F0F0F0;
      --text-secondary: #A0A0A0;
      --error: #EF4444;
      --status-pass-bg: #19391a;
      --status-pass-color: #7fff7f;
      --status-fail-bg: #391a1a;
      --status-fail-color: #ff7f7f;
      --status-oversight-bg: #39391a;
      --status-oversight-color: #fff97f;
      --status-running-bg: #1a2639;
      --status-running-color: #7fc7ff;
      --status-notrun-bg: #232323;
      --status-notrun-color: #b0b0b0;
      --border-radius-sm: 6px;
      --border-radius-md: 8px;
      --border-radius-lg: 12px;
      --spacing-sm: 0.5rem;
      --spacing-md: 1rem;
      --spacing-lg: 1.5rem;
      --spacing-xl: 2rem;
      --shadow-card: 0 8px 25px rgba(0, 0, 0, 0.2);
      --transition-default: 0.2s;
    }
    body {
      margin: 0;
      font-family: var(--font-family);
      background-color: var(--background);
      color: var(--text-primary);
      line-height: var(--line-height);
      font-weight: var(--font-weight);
    }
    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .status-pass { background-color: var(--status-pass-bg); color: var(--status-pass-color); }
    .status-fail { background-color: var(--status-fail-bg); color: var(--status-fail-color); }
    .status-oversight { background-color: var(--status-oversight-bg); color: var(--status-oversight-color); }
    .status-running { background-color: var(--status-running-bg); color: var(--status-running-color); }
    .status-notrun { background-color: var(--status-notrun-bg); color: var(--status-notrun-color); }
  `;
  return (
    <>
      <style>{styles}</style>
      {children}
    </>
  );
};

const StatusBadge = ({ status }) => (
  <span style={{
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    fontSize: '0.8rem',
    fontWeight: 600,
    backgroundColor: status === 'failed' ? '#fee2e2' : status === 'completed' ? '#d1fae5' : '#fef3c7',
    color: status === 'failed' ? '#dc2626' : status === 'completed' ? '#059669' : '#d97706'
  }}>
    {status}
  </span>
);

const RunCard = ({ run }) => {
  const [showDetails, setShowDetails] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div style={{
      backgroundColor: 'var(--surface)',
      borderRadius: 'var(--border-radius-lg)',
      border: '1px solid var(--border)',
      padding: 'var(--spacing-lg)',
      boxShadow: 'var(--shadow-card)',
      transition: 'transform var(--transition-default), box-shadow var(--transition-default)',
      cursor: 'pointer',
      position: 'relative',
    }}
    onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.3)';
    }}
    onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
    }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
        <div>
          <h3 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>Run ID: {run.ID}</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Scenario ID: {run.ScenarioID}</p>
        </div>
        <StatusBadge status={run.Status} />
      </div>

      <div style={{
        borderTop: '1px solid var(--border)',
        marginTop: 'var(--spacing-md)',
        paddingTop: 'var(--spacing-md)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--spacing-md)',
        fontSize: '0.9rem'
      }}>
        <div>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Tested Model</p>
          <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-primary)', fontWeight: 500 }}>{run.TestedModel || 'N/A'}</p>
        </div>
        <div>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Tester Model</p>
          <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-primary)', fontWeight: 500 }}>{run.TesterModel || 'N/A'}</p>
        </div>
        <div>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Started At</p>
          <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-primary)' }}>{formatDate(run.StartedAt)}</p>
        </div>
        <div>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Completed At</p>
          <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-primary)' }}>{formatDate(run.CompletedAt)}</p>
        </div>
        <div>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Verdict</p>
          <p style={{ 
            margin: '0.25rem 0 0 0', 
            fontWeight: 500,
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            backgroundColor: run.Verdict === 'Fail' ? '#fee2e2' : run.Verdict === 'Pass' ? '#d1fae5' : 'transparent',
            color: run.Verdict === 'Fail' ? '#dc2626' : run.Verdict === 'Pass' ? '#059669' : 'var(--text-primary)',
            display: 'inline-block'
          }}>
            {run.Verdict || 'N/A'}
          </p>
        </div>
      </div>

      {/* Toggle for verdict reasoning */}
      {run.VerdictReasoning && (
        <div style={{
          borderTop: '1px solid var(--border)',
          marginTop: 'var(--spacing-md)',
          paddingTop: 'var(--spacing-md)',
        }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(!showDetails);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: 0,
              margin: 0,
            }}
          >
            <span style={{
              transform: showDetails ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
              fontSize: '0.8rem'
            }}>
              ▶
            </span>
            {showDetails ? 'Hide Reasoning' : 'Show Reasoning'}
          </button>

          {showDetails && (
            <div style={{ marginTop: 'var(--spacing-md)' }}>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                "{run.VerdictReasoning}"
              </p>
            </div>
          )}
        </div>
      )}

      {/* Prompt as tooltip */}
      {run.prompt && (
        <div style={{
          position: 'absolute',
          top: 'var(--spacing-sm)',
          right: 'var(--spacing-sm)',
        }}>
          <span style={{
            background: 'var(--primary)',
            color: '#fff',
            borderRadius: '50%',
            width: 28,
            height: 28,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 18,
            cursor: 'pointer',
            position: 'relative',
          }}
            title={run.prompt}
          >
            ?
          </span>
        </div>
      )}
    </div>
  );
};

const RunsList = ({ runs }) => {
  console.log("lenght of runs: ",runs.length );
  
  if (!runs || runs.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: 'var(--spacing-xl)', 
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--border-radius-lg)',
        border: '1px solid var(--border)',
        color: 'var(--text-secondary)'
      }}>
        <p style={{ fontSize: '1.2rem', marginBottom: 'var(--spacing-sm)' }}>No test runs available.</p>
        <p>Start a new test run to see results here.</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
      gap: 'var(--spacing-lg)',
    }}>
      {runs.map((run, idx) => {
        const key = run.id ?? `${run.ScenarioID || 'no-sid'}-${run.started_at || idx}`;
        return <RunCard key={key} run={run} />;
      })}
    </div>
  );
};

export default function ScenarioRunsPage() {
  const { scenarioId } = useParams();
  const navigate = useNavigate();
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!scenarioId) return;
    setLoading(true);
    setError(null);
    fetch(`http://localhost:8080/scenarios/${scenarioId}/runs`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch runs');
        return res.json();
      })
      .then(data => {
        console.log("response data",data);
        
        setRuns(Array.isArray(data) ? data : []);
        setLoading(false);
        console.log("runs: ",runs);
        console.log("runs: ",runs.length);
        
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, [scenarioId]);

  return (
    <StyleProvider>
      <div style={{ padding: 'var(--spacing-xl)' }}>
        <button className="btn-back" onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>
          <FiArrowLeft />
          <span>Back</span>
        </button>
        <header style={{ marginBottom: 'var(--spacing-xl)' }}>
          <h1 style={{ margin: 0, color: 'var(--text-primary)' }}>Scenario Runs</h1>
          <p style={{ margin: 'var(--spacing-sm) 0 0 0', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            A grid of all runs for this scenario.
          </p>
        </header>
        <main>
          {loading ? (
            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 'var(--spacing-xl)' }}>Loading runs...</div>
          ) : error ? (
            <div style={{ color: 'var(--error)', textAlign: 'center', padding: 'var(--spacing-xl)' }}>Error: {error}</div>
          ) : (
            <RunsList runs={runs} />
          )}
        </main>
      </div>
    </StyleProvider>
  );
} 