import React from "react";
import { ChartBlock } from "../components/runtime/ChartBlock";
import { MetricCardBlock } from "../components/runtime/MetricCardBlock";

const Home: React.FC = () => {
  return (
    <div id="home-1772710591859">
    <div id="iquz0j" style={{"display": "flex", "height": "100vh", "fontFamily": "Arial, sans-serif", "--chart-color-palette": "default"}}>
      <nav id="i7e63k" style={{"width": "250px", "background": "linear-gradient(135deg, #4b3c82 0%, #5a3d91 100%)", "color": "white", "padding": "20px", "overflowY": "auto", "display": "flex", "flexDirection": "column", "--chart-color-palette": "default"}}>
        <h2 id="im3myi" style={{"marginTop": "0", "fontSize": "24px", "marginBottom": "30px", "fontWeight": "bold", "--chart-color-palette": "default"}}>{"BESSER"}</h2>
        <a id="i6mjab" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/home" {...{"title": "Home"}}>{"Home"}</a>
        <a id="ial6lk" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/publication">{"Publication"}</a>
        <a id="iuws46" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/institution">{"Institution"}</a>
        <a id="io09yk" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/author">{"Author"}</a>
        <div id="ijggw1" style={{"display": "flex", "flexDirection": "column", "flex": "1", "--chart-color-palette": "default"}} />
        <p id="ix9ith" style={{"marginTop": "auto", "paddingTop": "20px", "borderTop": "1px solid rgba(255,255,255,0.2)", "fontSize": "11px", "opacity": "0.8", "textAlign": "center", "--chart-color-palette": "default"}}>{"© 2026 BESSER. All rights reserved."}</p>
      </nav>
      <main id="ixma8w" style={{"flex": "1", "padding": "40px", "overflowY": "auto", "background": "#f5f5f5", "--chart-color-palette": "default"}}>
        <div id="i6tk9h" className="gjs-row" style={{"display": "flex", "padding": "10px", "width": "100%", "--chart-color-palette": "default", "flexWrap": "wrap"}} />
        <div id="ielhee" style={{"padding": "20px", "backgroundColor": "#4b3c82", "--chart-color-palette": "default"}}>
          <div id="ir40dw" style={{"maxWidth": "1400px", "margin": "0 auto", "--chart-color-palette": "default"}}>
            <div id="i4hk3e" style={{"marginBottom": "30px"}}>
              <h1 id="i8xl81" style={{"color": "white", "margin": "0 0 10px 0", "fontSize": "32px", "--chart-color-palette": "default"}}>{"Home"}</h1>
            </div>
            <div id="i28iki" className="kpi-row" style={{"display": "grid", "gridTemplateColumns": "repeat(auto-fit, minmax(250px, 1fr))", "gap": "20px", "marginBottom": "30px", "--chart-color-palette": "default"}}>
              <MetricCardBlock id="il2m24" styles={{"width": "100%", "minHeight": "140px", "--chart-color-palette": "default"}} metric={{"metricTitle": "Total Publications", "format": "number", "valueColor": "#2c3e50", "valueSize": 32, "showTrend": true, "positiveColor": "#27ae60", "negativeColor": "#e74c3c", "value": 0, "trend": 12}} dataBinding={{"entity": "Publication", "endpoint": "/publication/count/", "data_field": "count"}} />
              <MetricCardBlock id="total-citations-card" styles={{"width": "100%", "minHeight": "140px", "--chart-color-palette": "default"}} metric={{"metricTitle": "Total Citations", "format": "number", "valueColor": "#2c3e50", "valueSize": 32, "showTrend": true, "positiveColor": "#27ae60", "negativeColor": "#e74c3c", "value": 0, "trend": 12}} dataBinding={{"entity": "Publication", "endpoint": "/publication/total-citations/", "data_field": "total_citations"}} />
              <MetricCardBlock id="ireuzc" styles={{"width": "100%", "minHeight": "140px", "--chart-color-palette": "default"}} metric={{"metricTitle": "Number of Authors", "format": "number", "valueColor": "#2c3e50", "valueSize": 32, "showTrend": true, "positiveColor": "#27ae60", "negativeColor": "#e74c3c", "value": 0, "trend": 12}} dataBinding={{"entity": "Author", "endpoint": "/author/count/", "data_field": "count"}} />
            </div>
            <div id="iefld4" className="charts-row" style={{"display": "grid", "gridTemplateColumns": "repeat(auto-fit, minmax(500px, 1fr))", "gap": "20px", "marginBottom": "20px", "--chart-color-palette": "default"}}>
              <div id="i85rfi" style={{"background": "white", "padding": "25px", "borderRadius": "10px", "boxShadow": "0 4px 6px rgba(0,0,0,0.1)", "--chart-color-palette": "default"}}>
                <ChartBlock id="ixoxwk" styles={{"width": "100%", "minHeight": "400px", "--chart-line-color": "#4CAF50", "--chart-color-palette": "default"}} chartType="line-chart" title="Number of Publications" color="#4CAF50" chart={{"lineWidth": 2, "curveType": "monotone", "showGrid": true, "showLegend": false, "showTooltip": true, "animate": true, "legendPosition": "top", "gridColor": "#e0e0e0", "dotSize": 5}} series={[{"name": "Series_1", "label": "Series 1", "color": "#4CAF50", "dataSource": "publication", "endpoint": "/publication/", "labelField": "year", "dataField": "year", "filter": "count"}]} />
              </div>
              <div id="i8x6q3" style={{"background": "white", "padding": "25px", "borderRadius": "10px", "boxShadow": "0 4px 6px rgba(0,0,0,0.1)", "--chart-color-palette": "default"}}>
                <ChartBlock id="idu33o" styles={{"width": "100%", "minHeight": "400px", "--chart-color-palette": "default"}} chartType="pie-chart" title="Types of Publications" color="#8884d8" chart={{"showTooltip": true, "showLegend": true, "legendPosition": "right"}} series={[{"name": "Journal", "label": "Journal", "color": "#FF6B6B", "dataSource": "journal", "endpoint": "/journal/"}, {"name": "Book", "label": "Book", "color": "#4ECDC4", "dataSource": "book", "endpoint": "/book/"}, {"name": "Proceedings", "label": "Proceedings", "color": "#45B7D1", "dataSource": "proceedings", "endpoint": "/proceedings/"}, {"name": "Conference", "label": "Conference", "color": "#FFA07A", "dataSource": "conference", "endpoint": "/conference/"}, {"name": "Thesis", "label": "Thesis", "color": "#98D8C8", "dataSource": "thesis", "endpoint": "/thesis/"}, {"name": "Others", "label": "Others", "color": "#F7DC6F", "dataSource": "others", "endpoint": "/others/"}]} dataBinding={{"entity": "Publication", "endpoint": "/publication/", "label_field": "type", "data_field": "type"}} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>    </div>
  );
};

export default Home;
