import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import uploadIcon from '../assets/upload-icon.svg';

const REQUIRED_COLUMNS = ['scenario', 'expected_outcome'];

const FileUploader = ({ testId, onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [parsedScenarios, setParsedScenarios] = useState(null);
  const fileInputRef = useRef(null);

  const validateColumns = (columns) => {
    return (
      columns.length === REQUIRED_COLUMNS.length &&
      REQUIRED_COLUMNS.every((col, idx) => columns[idx].trim() === col)
    );
  };

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([REQUIRED_COLUMNS]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'scenarios_template.xlsx');
  };

  const handleFile = (file) => {
    if (!file || !['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(file.type) && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error('Please upload a valid Excel file (.xlsx or .xls)');
      setFileName('');
      setParsedScenarios(null);
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array', cellText: false, cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
        if (!json.length) {
          toast.error('The file is empty.');
          setFileName('');
          setParsedScenarios(null);
          return;
        }
        const columns = json[0].map(col => (col || '').toString().trim());
        if (!validateColumns(columns)) {
          toast.error('The file must contain only the following columns: scenario, expected_outcome');
          setFileName('');
          setParsedScenarios(null);
          return;
        }
        if (json.length <= 1) {
          toast.error('The file does not contain any scenarios.');
          setFileName('');
          setParsedScenarios(null);
          return;
        }
        const scenarios = json.slice(1).map(row => {
          const obj = {};
          columns.forEach((col, idx) => {
            obj[col] = (row[idx] || '').toString();
          });
          return obj;
        });
        setParsedScenarios(scenarios);
        toast.success('File is valid and ready to upload!');
      } catch (err) {
        toast.error('Invalid file or contains unsupported characters.');
        setFileName('');
        setParsedScenarios(null);
      }
    };
    reader.onerror = () => {
      toast.error('Could not read the file.');
      setFileName('');
      setParsedScenarios(null);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = () => {
    if (!parsedScenarios) return;
    const payload = {
      test_id: testId,
      scenarios: parsedScenarios.map(s => ({
        description: s.scenario,
        expected_output: s.expected_outcome,
      })),
    };
    fetch('http://localhost:8080/api/upload-scenarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || 'An error occurred while uploading the file.');
        }
        toast.success('Scenarios uploaded successfully!');
        setFileName('');
        setParsedScenarios(null);
        if (onUpload) onUpload();
      })
      .catch((err) => {
        toast.error(err.message || 'An error occurred while uploading the file.');
      });
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      className={`file-uploader ${isDragging ? 'dragging' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept=".xlsx,.xls"
        style={{ display: 'none' }}
      />
      <img src={uploadIcon} alt="Upload" className="upload-icon" />
      {fileName ? (
        <div className="file-info">
          <span className="file-name">
            <span role="img" aria-label="file" className="file-emoji">📄</span>
            {fileName}
          </span>
          <button
            className="remove-file-btn"
            onClick={() => {
              setFileName('');
              setParsedScenarios(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            title="Remove file"
            aria-label="Remove file"
            type="button"
          >
            ×
          </button>
        </div>
      ) : (
        <p>Drag and drop an Excel file here or choose a file</p>
      )}
      <div className="file-uploader-actions">
        <button className="btn-primary" onClick={handleButtonClick}>
          Or choose a file
        </button>
        <button className="btn-secondary" onClick={handleDownloadTemplate}>
          Download Template
        </button>
        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={!parsedScenarios || !fileName}
        >
          Submit
        </button>
      </div>
      {/* Preview Table */}
      {parsedScenarios && (
        <div className="preview-table-wrapper">
          <h4>Preview:</h4>
          <table className="preview-table">
            <thead>
              <tr>
                {Object.keys(parsedScenarios[0]).map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {parsedScenarios.map((row, idx) => (
                <tr key={idx}>
                  {Object.values(row).map((val, i) => (
                    <td key={i}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FileUploader;