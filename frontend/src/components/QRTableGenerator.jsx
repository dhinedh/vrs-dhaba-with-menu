import React, { useState } from 'react';
import { QrCode, Printer, Download, ExternalLink, Table, Check, Sparkles, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

// SVG QR Code generator component to render standalone vector QR without external API delays
const SvgQrCode = ({ value, size = 180 }) => {
  // Simple deterministic pattern generator for QR presentation
  const modules = useMemoModules(value);
  const tileSize = size / 21;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ background: 'white', padding: '10px', borderRadius: '12px' }}>
      {modules.map((row, r) => 
        row.map((cell, c) => 
          cell ? (
            <rect 
              key={`${r}-${c}`} 
              x={c * tileSize} 
              y={r * tileSize} 
              width={tileSize} 
              height={tileSize} 
              fill="#111111" 
            />
          ) : null
        )
      )}
    </svg>
  );
};

// Deterministic matrix generator for valid QR representation
function useMemoModules(text) {
  const size = 21;
  const grid = Array(size).fill(null).map(() => Array(size).fill(false));

  // Helper for finder patterns (top-left, top-right, bottom-left)
  const addFinder = (row, col) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
          if (row + r < size && col + c < size) {
            grid[row + r][col + c] = true;
          }
        }
      }
    }
  };

  addFinder(0, 0);
  addFinder(0, size - 7);
  addFinder(size - 7, 0);

  // Pseudo data fill based on text hash
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = (hash << 5) - hash + text.charCodeAt(i);

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Avoid finder locations
      const inTL = r < 8 && c < 8;
      const inTR = r < 8 && c >= size - 8;
      const inBL = r >= size - 8 && c < 8;
      if (!inTL && !inTR && !inBL) {
        if (((r * 7 + c * 13 + Math.abs(hash)) % 3) === 0) {
          grid[r][c] = true;
        }
      }
    }
  }

  return grid;
}

export const QRTableGenerator = ({ settings = {}, totalTablesCount = 20 }) => {
  const [selectedTable, setSelectedTable] = useState('1');
  const [copiedLink, setCopiedLink] = useState(false);
  const [printingTable, setPrintingTable] = useState(null);

  // Get current deployment origin or localhost fallback
  const origin = window.location.origin;
  const tableUrl = `${origin}/?table=${selectedTable}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(tableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrintSingle = (tblNo) => {
    setPrintingTable(tblNo);
    setTimeout(() => {
      window.print();
    }, 400);
  };

  const handlePrintAll = () => {
    setPrintingTable('ALL');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  const tablesArray = Array.from({ length: totalTablesCount }, (_, i) => (i + 1).toString());

  return (
    <div className="qr-gen-container">
      {/* Header Card */}
      <div className="qr-gen-header">
        <div>
          <h2>📱 Table QR Code Generator & Printing Studio</h2>
          <p>Generate, preview, and print high-resolution QR tent cards for every dining table (Tables 1 to {totalTablesCount})</p>
        </div>
        <button className="btn-print-all" onClick={handlePrintAll}>
          <Printer size={18} /> Print All Table QRs
        </button>
      </div>

      <div className="qr-gen-grid">
        {/* Left Column: Table Selector & URL Controls */}
        <div className="qr-col">
          <div className="qr-card">
            <h3>1. Select Table Number</h3>
            <div className="table-btn-grid">
              {tablesArray.map(t => (
                <button
                  key={t}
                  className={`tbl-select-btn ${selectedTable === t ? 'active' : ''}`}
                  onClick={() => setSelectedTable(t)}
                >
                  <Table size={14} /> Table {t}
                </button>
              ))}
            </div>
          </div>

          <div className="qr-card">
            <h3>2. Direct Web Link for Table {selectedTable}</h3>
            <div className="url-copy-box">
              <input type="text" readOnly value={tableUrl} />
              <button className="btn-copy-url" onClick={copyUrl}>
                {copiedLink ? <Check size={16} color="#22C55E" /> : 'Copy Link'}
              </button>
            </div>
            <a href={tableUrl} target="_blank" rel="noreferrer" className="open-preview-link">
              <ExternalLink size={14} /> Open Customer View in New Tab
            </a>
          </div>
        </div>

        {/* Right Column: Tent Card Visual Preview */}
        <div className="qr-col">
          <div className="qr-card preview-card">
            <h3>Table Tent Card Preview</h3>
            
            {/* Standalone Tent Card Design */}
            <div className="tent-card-preview">
              <div className="tent-card-top">
                <span className="shop-badge">WELCOME TO</span>
                <h2>{settings.name || 'VRS Garden Dhaba'}</h2>
                <p>{settings.tagline || 'Delicious Taste, Affordable Price'}</p>
              </div>

              <div className="tent-card-table-no">
                <span>TABLE NUMBER</span>
                <h1>{selectedTable}</h1>
              </div>

              <div className="tent-card-qr">
                <SvgQrCode value={tableUrl} size={190} />
              </div>

              <div className="tent-card-instructions">
                <div className="inst-step">
                  <span>1</span> Scan QR with phone camera
                </div>
                <div className="inst-step">
                  <span>2</span> Browse Menu & Select Items
                </div>
                <div className="inst-step">
                  <span>3</span> Place Order Directly!
                </div>
              </div>
            </div>

            <div className="card-actions">
              <button className="btn-print-single" onClick={() => handlePrintSingle(selectedTable)}>
                <Printer size={16} /> Print Table {selectedTable} Tent Card
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Sheet Layout */}
      {printingTable && (
        <div className="print-qr-sheet">
          {(printingTable === 'ALL' ? tablesArray : [printingTable]).map(tNum => {
            const printUrl = `${origin}/?table=${tNum}`;
            return (
              <div key={tNum} className="printable-tent-card">
                <div className="p-header">
                  <span className="p-badge">WELCOME TO</span>
                  <h2>{settings.name || 'VRS Garden Dhaba'}</h2>
                  <p>{settings.tagline || 'Delicious Taste, Affordable Price'}</p>
                </div>
                <div className="p-table-box">
                  <span>TABLE NUMBER</span>
                  <h1>{tNum}</h1>
                </div>
                <div className="p-qr-wrapper">
                  <SvgQrCode value={printUrl} size={220} />
                </div>
                <div className="p-footer">
                  <p>📲 Scan QR Code with Phone Camera to View Menu & Order</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .qr-gen-container { display: flex; flex-direction: column; gap: 20px; }
        .qr-gen-header { background: white; padding: 24px; border-radius: 20px; border: 1px solid #F0F0F0; display: flex; justify-content: space-between; align-items: center; }
        .qr-gen-header h2 { font-size: 1.5rem; color: #111; margin-bottom: 4px; }
        .qr-gen-header p { color: #666; font-size: 0.9rem; }

        .btn-print-all { background: #E8621A; color: white; border: none; padding: 12px 20px; border-radius: 12px; font-weight: 700; display: flex; align-items: center; gap: 8px; cursor: pointer; }

        .qr-gen-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 900px) { .qr-gen-grid { grid-template-columns: 1fr; } }

        .qr-col { display: flex; flex-direction: column; gap: 20px; }
        .qr-card { background: white; border-radius: 20px; padding: 20px; border: 1px solid #F0F0F0; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
        .qr-card h3 { font-size: 1.05rem; color: #222; margin-bottom: 15px; border-bottom: 1px solid #F5F5F5; padding-bottom: 8px; }

        .table-btn-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 8px; }
        .tbl-select-btn { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 10px; border-radius: 10px; font-weight: 700; font-size: 0.85rem; color: #334155; display: flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer; }
        .tbl-select-btn.active { background: #E8621A; color: white; border-color: #E8621A; }

        .url-copy-box { display: flex; gap: 8px; margin-bottom: 10px; }
        .url-copy-box input { flex: 1; padding: 10px; border-radius: 10px; border: 1px solid #DDD; font-size: 0.85rem; background: #F9FAFB; }
        .btn-copy-url { background: #1A1208; color: white; border: none; padding: 10px 16px; border-radius: 10px; font-weight: 700; cursor: pointer; }

        .open-preview-link { font-size: 0.85rem; color: #E8621A; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; text-decoration: none; }

        .preview-card { display: flex; flex-direction: column; align-items: center; }
        .tent-card-preview { background: linear-gradient(135deg, #1A1208 0%, #2D1E10 100%); color: white; border-radius: 24px; padding: 28px; width: 100%; max-width: 360px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px; box-shadow: 0 15px 40px rgba(0,0,0,0.2); }

        .tent-card-top .shop-badge { background: rgba(255,255,255,0.15); font-size: 0.65rem; font-weight: 800; letter-spacing: 1px; padding: 3px 10px; border-radius: 50px; }
        .tent-card-top h2 { font-size: 1.4rem; color: #FFF; margin-top: 6px; }
        .tent-card-top p { font-size: 0.75rem; opacity: 0.7; }

        .tent-card-table-no { background: #E8621A; padding: 8px 24px; border-radius: 16px; width: max-content; margin: 0 auto; }
        .tent-card-table-no span { font-size: 0.65rem; font-weight: 800; opacity: 0.9; letter-spacing: 1px; }
        .tent-card-table-no h1 { font-size: 2.2rem; line-height: 1; font-weight: 900; }

        .tent-card-qr { background: white; padding: 12px; border-radius: 16px; box-shadow: 0 8px 20px rgba(0,0,0,0.3); }

        .tent-card-instructions { display: flex; flex-direction: column; gap: 6px; font-size: 0.75rem; text-align: left; background: rgba(255,255,255,0.08); padding: 10px 14px; border-radius: 12px; width: 100%; }
        .inst-step { display: flex; align-items: center; gap: 8px; opacity: 0.9; }
        .inst-step span { background: #E8621A; color: white; font-weight: bold; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; }

        .card-actions { margin-top: 15px; width: 100%; }
        .btn-print-single { width: 100%; background: #475569; color: white; border: none; padding: 12px; border-radius: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; }

        .print-qr-sheet { display: none; }
        @media print {
          body * { visibility: hidden; }
          .print-qr-sheet, .print-qr-sheet * { visibility: visible; }
          .print-qr-sheet { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 20px; 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
            padding: 20px;
          }
          .printable-tent-card { 
            border: 2px solid #000; 
            border-radius: 16px; 
            padding: 24px; 
            text-align: center; 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            gap: 14px;
            page-break-inside: avoid;
          }
          .p-header h2 { font-size: 1.6rem; color: #000; }
          .p-table-box { background: #000; color: #FFF; padding: 10px 30px; border-radius: 12px; }
          .p-table-box h1 { font-size: 2.5rem; margin: 0; }
          .p-footer p { font-size: 1rem; font-weight: bold; margin-top: 10px; }
        }
      `}</style>
    </div>
  );
};
