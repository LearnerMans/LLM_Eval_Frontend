import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

// --- Helper Components ---

// Icon for the Tester LLM (User)
const TesterLlmIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon robot-icon-1">
        <rect x="5" y="7" width="14" height="14" rx="2" ry="2"></rect>
        <path d="M9 11v2"></path>
        <path d="M15 11v2"></path>
        <path d="M9 17h6"></path>
        <path d="M5 7V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2"></path>
        <path d="M12 3v-1.5"></path>
    </svg>
);

// Icon for the Tested LLM (Model)
const TestedLlmIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon robot-icon-2">
    <path d="M15 7h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2v4h-2V7h2z"></path>
    <path d="M9 7H7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2v4h2V7H9z"></path>
    <circle cx="12" cy="4" r="2"></circle>
</svg>
);

// Badge for displaying evaluation status (Pass/Fail)
const EvaluationBadge = ({ result }) => {
    if (!result) return null;
    const lowerCaseResult = result.toLowerCase();
    let badgeClass = 'status-badge';
    if (lowerCaseResult === 'pass') badgeClass += ' status-pass';
    else if (lowerCaseResult === 'fail') badgeClass += ' status-fail';
    else badgeClass += ' status-notrun';
    return (
        <span className={badgeClass}>{result}</span>
    );
};

// Component to render a single interaction turn
const InteractionTurn = ({ interaction }) => {
    const { user_message, llm_response, evaluation_result, evaluation_reasoning, turn_number } = interaction;
    const [isReasoningVisible, setIsReasoningVisible] = useState(false);
    const toggleReasoning = () => setIsReasoningVisible(prev => !prev);

    return (
        <div className="interaction-card">
            {/* Turn Header with Evaluation */}
            <div className="interaction-header">
                <h3 className="interaction-turn">Turn {turn_number}</h3>
                {evaluation_result && <EvaluationBadge result={evaluation_result} />}
            </div>
            {/* Main content: Tester and Tested messages */}
            <div className="interaction-content">
                {/* Tester LLM Message (User) */}
                <div className="interaction-message tester">
                    <div className="interaction-icon-text">
                        <TesterLlmIcon />
                        <div className="interaction-message-content">
                            <h4 className="interaction-role">Tester LLM</h4>
                            <p className="interaction-text">{user_message}</p>
                        </div>
                    </div>
                </div>
                {/* Tested LLM Response (Model) */}
                <div className="interaction-message tested">
                    <div className="interaction-icon-text">
                        <TestedLlmIcon />
                        <div className="interaction-message-content">
                            <h4 className="interaction-role">Tested LLM</h4>
                            <p className="interaction-text">{llm_response}</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Evaluation Reasoning Section (Toggleable) */}
            {evaluation_reasoning && (
                <div className="interaction-reasoning-section">
                    <h4 className="interaction-reasoning-title">Evaluation Reasoning</h4>
                    {!isReasoningVisible ? (
                        <button
                            onClick={toggleReasoning}
                            className="interaction-reasoning-toggle show"
                            aria-expanded={isReasoningVisible}
                        >
                            <span>Show</span>
                            <span className="arrow">▼</span>
                        </button>
                    ) : (
                        <div className="interaction-reasoning-box">
                            <p className="interaction-reasoning-text">{evaluation_reasoning}</p>
                            <button
                                onClick={toggleReasoning}
                                className="interaction-reasoning-toggle hide"
                                aria-expanded={isReasoningVisible}
                            >
                                <span>Hide</span>
                                <span className="arrow">▲</span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default function InteractionsPage({ runId: propRunId }) {
    const [runId, setRunId] = useState(propRunId || null);
    const [interactions, setInteractions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Try to extract projectId from the first interaction's scenario_id if available
    const projectId = interactions.length > 0 ? interactions[0].scenario_id : null;

    useEffect(() => {
        if (!runId) {
            const match = window.location.pathname.match(/interactions\/(\d+)/);
            if (match) setRunId(match[1]);
        }
    }, [runId]);

    useEffect(() => {
        if (!runId) return;
        setLoading(true);
        setError(null);
        fetch(`http://localhost:8080/api/interactions/${runId}`)
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch interactions');
                return res.json();
            })
            .then((data) => {
                setInteractions(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [runId]);

    return (
        <div className="interactions-page">
            <div className="interactions-container">
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <button className="btn-back" onClick={() => navigate(-1)}>
                        &#8592; Back
                    </button>
                    <button className="btn-primary" onClick={() => navigate('/')}>Home</button>
                    {projectId && (
                        <button className="btn-primary" onClick={() => navigate(`/project/${projectId}`)}>
                            Go to Project
                        </button>
                    )}
                </div>
                <header className="interactions-header">
                    <h1 className="interactions-title">Interaction Details</h1>
                    <p className="interactions-subtitle">
                        Reviewing interactions for Run ID: <span className="interactions-runid">{runId || '...'}</span>
                    </p>
                </header>
                {loading && <div className="interactions-loading">Loading interactions...</div>}
                {error && <div className="interactions-error">{error}</div>}
                <main>
                    {interactions.map((interaction, idx) => {
                        const mapped = {
                            id: interaction.id ?? interaction.ID ?? idx,
                            turn_number: interaction.turn_number ?? interaction.TurnNumber,
                            scenario_id: interaction.scenario_id ?? interaction.ScenarioID,
                            user_message: interaction.user_message ?? interaction.UserMessage,
                            llm_response: interaction.llm_response ?? interaction.LLMResponse,
                            evaluation_result: interaction.evaluation_result ?? interaction.EvaluationResult,
                            evaluation_reasoning: interaction.evaluation_reasoning ?? interaction.EvaluationReasoning,
                        };
                        let key = mapped.id;
                        if (key === undefined || key === null) {
                            key = `${mapped.scenario_id ?? 'no-sid'}-${mapped.turn_number ?? 'no-turn'}-${idx}`;
                        }
                        return (
                            <InteractionTurn 
                                key={key}
                                interaction={mapped} 
                            />
                        );
                    })}
                    {!loading && interactions.length === 0 && !error && (
                        <div className="interactions-empty">No interactions found for this run.</div>
                    )}
                </main>
            </div>
        </div>
    );
} 