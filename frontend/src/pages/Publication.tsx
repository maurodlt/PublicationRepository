import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ChartBlock } from "../components/runtime/ChartBlock";
import { TableBlock } from "../components/runtime/TableBlock";

const Publication: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const [updateMessage, setUpdateMessage] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [openAlexEmail, setOpenAlexEmail] = useState("");

  const triggerBibtexUpload = () => {
    fileInputRef.current?.click();
  };

  const handleBibtexSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setImportMessage(null);
    setImportError(null);
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    const backendBase = import.meta.env.VITE_API_URL || "http://localhost:8000";
    try {
      const response = await axios.post(`${backendBase}/import/bibtex/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Import response:", response.data);
      const details = response.data?.created;
      const msg = `${response.data?.message || "Import successful"} (${details?.publications || 0} publications, ${details?.authors || 0} authors created)`;
      setImportMessage(msg);
      event.target.value = "";
      setRefreshKey((prev) => prev + 1);
      setTimeout(() => window.location.reload(), 500);
    } catch (error: any) {
      console.error("Import error:", error);
      const message = error?.response?.data?.detail || error?.message || "Unable to import bibtex file.";
      setImportError(message);
    }
  };

  const handleUpdateCitations = async () => {
    if (!openAlexEmail) {
      setUpdateError("Please enter an email for OpenAlex.");
      return;
    }

    setUpdateMessage(null);
    setUpdateError(null);
    setUpdating(true);

    const backendBase = import.meta.env.VITE_API_URL || "http://localhost:8000";

    try {
      const response = await axios.post(`${backendBase}/publication/update-citations/`, {
        email: openAlexEmail
      });

      const updatedCount = response.data?.updated_count ?? 0;
      setUpdateMessage(`Updated citations for ${updatedCount} publication${updatedCount === 1 ? "" : "s"}.`);
      setShowEmailModal(false);

      setTimeout(() => window.location.reload(), 500);

    } catch (error: any) {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Unable to update citations.";
      setUpdateError(message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div id="page-publication-5">
    <div id="il6ibh" style={{"display": "flex", "height": "100vh", "fontFamily": "Arial, sans-serif", "--chart-color-palette": "default"}}>
      <nav id="iz4k58" style={{"width": "250px", "background": "linear-gradient(135deg, #4b3c82 0%, #5a3d91 100%)", "color": "white", "padding": "20px", "overflowY": "auto", "display": "flex", "flexDirection": "column", "--chart-color-palette": "default"}}>
        <h2 id="i4ll5d" style={{"marginTop": "0", "fontSize": "24px", "marginBottom": "30px", "fontWeight": "bold", "--chart-color-palette": "default"}}>{"BESSER"}</h2>
        <a id="i73kg-2-6" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/home" {...{"title": "Home"}}>{"Home"}</a>
        <a id="i422j5" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "rgba(255,255,255,0.2)", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/publication">{"Publication"}</a>
        <a id="ij7w8k" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/institution">{"Institution"}</a>
        <a id="iu4htl" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/author">{"Author"}</a>
        <div id="insuxv" style={{"display": "flex", "flexDirection": "column", "flex": "1", "--chart-color-palette": "default"}} />
        <p id="izwvs3" style={{"marginTop": "auto", "paddingTop": "20px", "borderTop": "1px solid rgba(255,255,255,0.2)", "fontSize": "11px", "opacity": "0.8", "textAlign": "center", "--chart-color-palette": "default"}}>{"© 2026 BESSER. All rights reserved."}</p>
      </nav>
      <main id="iw1uav" style={{"flex": "1", "padding": "40px", "overflowY": "auto", "background": "#f5f5f5", "--chart-color-palette": "default"}}>
        <h1 id="irw7ee" style={{"marginTop": "0", "color": "#333", "fontSize": "32px", "marginBottom": "10px", "--chart-color-palette": "default"}}>{"Publication"}</h1>
        <h2 id="i9klrk">{"Add Publications"}</h2>
        <div id="i9uweu" style={{"display": "flex", "flexWrap": "wrap", "gap": "12px", "maxWidth": "1200px", "margin": "0 auto 12px", "padding": "0 20px", "--chart-color-palette": "default"}}>
          <button id="ivh5s3" className="action-button-component" style={{"display": "inline-flex", "alignItems": "center", "padding": "10px 18px", "background": "linear-gradient(90deg, #2563eb 0%, #1e40af 100%)", "color": "#fff", "textDecoration": "none", "borderRadius": "4px", "fontSize": "14px", "fontWeight": "600", "letterSpacing": "0.01em", "cursor": "pointer", "border": "none", "boxShadow": "0 1px 4px rgba(37,99,235,0.10)", "transition": "background 0.2s", "minWidth": "120px", "--chart-color-palette": "default"}} onClick={() => navigate("/journal")} {...{"type": "button", "data-action-type": "navigate", "data-confirmation": "false", "data-confirmation-message": "Are you sure?", "button-label": "Journal", "data-target-screen": "page-journal-0", "target-screen": "page:page-journal-0"}}>{"Journal"}</button>
          <button id="idp85y" className="action-button-component" style={{"display": "inline-flex", "alignItems": "center", "padding": "10px 18px", "background": "linear-gradient(90deg, #2563eb 0%, #1e40af 100%)", "color": "#fff", "textDecoration": "none", "borderRadius": "4px", "fontSize": "14px", "fontWeight": "600", "letterSpacing": "0.01em", "cursor": "pointer", "border": "none", "boxShadow": "0 1px 4px rgba(37,99,235,0.10)", "transition": "background 0.2s", "minWidth": "120px", "--chart-color-palette": "default"}} onClick={() => navigate("/book")} {...{"type": "button", "data-action-type": "navigate", "data-confirmation": "false", "data-confirmation-message": "Are you sure?", "button-label": "Book", "data-target-screen": "page-book-3", "target-screen": "page-book-3"}}>{"Book"}</button>
          <button id="i92wha" className="action-button-component" style={{"display": "inline-flex", "alignItems": "center", "padding": "10px 18px", "background": "linear-gradient(90deg, #2563eb 0%, #1e40af 100%)", "color": "#fff", "textDecoration": "none", "borderRadius": "4px", "fontSize": "14px", "fontWeight": "600", "letterSpacing": "0.01em", "cursor": "pointer", "border": "none", "boxShadow": "0 1px 4px rgba(37,99,235,0.10)", "transition": "background 0.2s", "minWidth": "120px", "--chart-color-palette": "default"}} onClick={() => navigate("/proceedings")} {...{"type": "button", "data-action-type": "navigate", "data-confirmation": "false", "data-confirmation-message": "Are you sure?", "button-label": "Proceedings", "data-target-screen": "page-proceedings-4", "target-screen": "page-proceedings-4"}}>{"Proceedings"}</button>
          <button id="iv0hvo" className="action-button-component" style={{"display": "inline-flex", "alignItems": "center", "padding": "10px 18px", "background": "linear-gradient(90deg, #2563eb 0%, #1e40af 100%)", "color": "#fff", "textDecoration": "none", "borderRadius": "4px", "fontSize": "14px", "fontWeight": "600", "letterSpacing": "0.01em", "cursor": "pointer", "border": "none", "boxShadow": "0 1px 4px rgba(37,99,235,0.10)", "transition": "background 0.2s", "minWidth": "120px", "--chart-color-palette": "default"}} onClick={() => navigate("/conference")} {...{"type": "button", "data-action-type": "navigate", "data-confirmation": "false", "data-confirmation-message": "Are you sure?", "button-label": "Conference", "data-target-screen": "page-conference-8", "target-screen": "page-conference-8"}}>{"Conference"}</button>
          <button id="i9izve-2" className="action-button-component" style={{"display": "inline-flex", "alignItems": "center", "padding": "10px 18px", "background": "linear-gradient(90deg, #2563eb 0%, #1e40af 100%)", "color": "#fff", "textDecoration": "none", "borderRadius": "4px", "fontSize": "14px", "fontWeight": "600", "letterSpacing": "0.01em", "cursor": "pointer", "border": "none", "boxShadow": "0 1px 4px rgba(37,99,235,0.10)", "transition": "background 0.2s", "minWidth": "120px", "--chart-color-palette": "default"}} onClick={() => navigate("/thesis")} {...{"type": "button", "data-action-type": "navigate", "data-confirmation": "false", "data-confirmation-message": "Are you sure?", "button-label": "Thesis", "data-target-screen": "page-thesis-2", "target-screen": "page-thesis-2"}}>{"Thesis"}</button>
          <button id="i9izve" className="action-button-component" style={{"display": "inline-flex", "alignItems": "center", "padding": "10px 18px", "background": "linear-gradient(90deg, #2563eb 0%, #1e40af 100%)", "color": "#fff", "textDecoration": "none", "borderRadius": "4px", "fontSize": "14px", "fontWeight": "600", "letterSpacing": "0.01em", "cursor": "pointer", "border": "none", "boxShadow": "0 1px 4px rgba(37,99,235,0.10)", "transition": "background 0.2s", "minWidth": "120px", "--chart-color-palette": "default"}} onClick={() => navigate("/others")} {...{"type": "button", "data-action-type": "navigate", "data-confirmation": "false", "data-confirmation-message": "Are you sure?", "button-label": "Other", "data-target-screen": "page-others-1", "target-screen": "page:page-others-1"}}>{"Other"}</button>
        </div>
        <div id="i9uweu-import" style={{"display": "flex", "flexWrap": "wrap", "gap": "12px", "maxWidth": "1200px", "margin": "0 auto 12px", "padding": "0 20px", "--chart-color-palette": "default"}}>
          <button id="import-bibtex-button" className="action-button-component" style={{"display": "inline-flex", "alignItems": "center", "padding": "10px 18px", "background": "linear-gradient(90deg, #10b981 0%, #047857 100%)", "color": "#fff", "textDecoration": "none", "borderRadius": "4px", "fontSize": "14px", "fontWeight": "600", "letterSpacing": "0.01em", "cursor": "pointer", "border": "none", "boxShadow": "0 1px 4px rgba(16,185,129,0.10)", "transition": "background 0.2s", "minWidth": "180px", "--chart-color-palette": "default"}} onClick={triggerBibtexUpload} disabled={updating} type="button">{"Import from bibtex"}</button>
          <button id="update-citations-button" className="action-button-component" style={{"display": "inline-flex", "alignItems": "center", "padding": "10px 18px", "background": "linear-gradient(90deg, #10b981 0%, #047857 100%)", "color": "#fff", "textDecoration": "none", "borderRadius": "4px", "fontSize": "14px", "fontWeight": "600", "letterSpacing": "0.01em", "cursor": "pointer", "border": "none", "boxShadow": "0 1px 4px rgba(16,185,129,0.10)", "transition": "background 0.2s", "minWidth": "180px", "--chart-color-palette": "default"}} onClick={() => setShowEmailModal(true)} disabled={updating} type="button">{updating ? "Updating citations..." : "Update citations"}</button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".bib"
            style={{ display: "none" }}
            onChange={handleBibtexSelection}
          />
        </div>
        {importMessage && (
          <div style={{ marginBottom: "12px", color: "#065f46", backgroundColor: "#dcfce7", padding: "12px", borderRadius: "4px" }}>
            ✓ {importMessage}
          </div>
        )}
        {importError && (
          <div style={{ marginBottom: "12px", color: "#b91c1c", backgroundColor: "#fee2e2", padding: "12px", borderRadius: "4px" }}>
            ✗ {importError}
          </div>
        )}
        {updateMessage && (
          <div style={{ marginBottom: "12px", color: "#065f46", backgroundColor: "#dcfce7", padding: "12px", borderRadius: "4px" }}>
            ✓ {updateMessage}
          </div>
        )}
        {updateError && (
          <div style={{ marginBottom: "12px", color: "#b91c1c", backgroundColor: "#fee2e2", padding: "12px", borderRadius: "4px" }}>
            ✗ {updateError}
          </div>
        )}
        <TableBlock key={refreshKey} id="table-publication-5" styles={{"width": "100%", "minHeight": "400px", "--chart-color-palette": "default"}} title="Publication List" options={{"showHeader": true, "stripedRows": false, "showPagination": true, "rowsPerPage": 5, "actionButtons": false, "columns": [{"label": "Title", "column_type": "field", "field": "title", "type": "str", "required": true}, {"label": "Author 1", "column_type": "lookup", "path": "author_1", "entity": "Author", "field": "last_name", "type": "list", "required": true}, {"label": "Year", "column_type": "field", "field": "year", "type": "int", "required": true}, {"label": "Citations", "column_type": "field", "field": "citations", "type": "int", "required": false}, {"label": "Institution 1", "column_type": "lookup", "path": "institution_1", "entity": "Institution", "field": "name", "type": "list", "required": true}], "formColumns": [{"column_type": "field", "field": "year", "label": "year", "type": "int", "required": true, "defaultValue": null}, {"column_type": "field", "field": "title", "label": "title", "type": "str", "required": true, "defaultValue": null}, {"column_type": "field", "field": "citations", "label": "citations", "type": "int", "required": false, "defaultValue": null}, {"column_type": "lookup", "path": "author_1", "field": "author_1", "lookup_field": "last_name", "entity": "Author", "type": "list", "required": true}, {"column_type": "lookup", "path": "institution_1", "field": "institution_1", "lookup_field": "country", "entity": "Institution", "type": "list", "required": true}]}} dataBinding={{"entity": "Publication", "endpoint": "/publication/"}} />
        <ChartBlock key={refreshKey} id="iyuv1u" styles={{"width": "100%", "minHeight": "400px", "--chart-color-palette": "default"}} chartType="line-chart" title="Number of Publications" color="#4CAF50" chart={{"lineWidth": 2, "curveType": "monotone", "showGrid": true, "showLegend": false, "showTooltip": true, "animate": true, "legendPosition": "top", "gridColor": "#e0e0e0", "dotSize": 5}} series={[{"name": "publications_count", "label": "publications_count", "color": "#4CAF50", "dataSource": "publication", "endpoint": "/publication/", "labelField": "year", "dataField": "year", "filter": "count"}]} />
        <ChartBlock key={refreshKey} id="citations-bar-chart" styles={{"width": "100%", "minHeight": "400px", "--chart-color-palette": "default"}} chartType="bar-chart" title="Citations per Publication" color="#FF6B6B" chart={{"showGrid": true, "showLegend": false, "showTooltip": true, "animate": true, "showXAxisLabels": true, "xAxisLabelAngle": -45, "xAxisHeight": 100}} series={[{"name": "citations", "label": "Citations", "endpoint": "/publication/citations/", "labelField": "title", "dataField": "citations"}]} />
      </main>
    </div>
    {updating && (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}>
        <div style={{ color: 'white', fontSize: '20px' }}>Updating citations...</div>
      </div>
    )}

    {showEmailModal && (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10000
      }}>
        <div style={{
          background: "white",
          padding: "24px",
          borderRadius: "8px",
          width: "400px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
        }}>
          <h3>OpenAlex Email Required</h3>
          <p style={{ fontSize: "14px", marginBottom: "12px" }}>
            Please provide your email address. OpenAlex requests this for polite API usage.
          </p>

          <input
            type="email"
            value={openAlexEmail}
            onChange={(e) => setOpenAlexEmail(e.target.value)}
            placeholder="your.email@example.com"
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "16px",
              borderRadius: "4px",
              border: "1px solid #ccc"
            }}
          />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button
              onClick={() => setShowEmailModal(false)}
              style={{
                padding: "8px 14px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                background: "#f5f5f5",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>

            <button
              onClick={handleUpdateCitations}
              style={{
                padding: "8px 14px",
                borderRadius: "4px",
                border: "none",
                background: "#2563eb",
                color: "white",
                cursor: "pointer"
              }}
            >
              Start update
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default Publication;
