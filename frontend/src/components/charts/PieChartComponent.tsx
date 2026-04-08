import React, { CSSProperties } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface SeriesConfig {
  name: string;
  color?: string;
}

interface Props {
  id: string;
  title?: string;
  color?: string;
  data: any[];
  labelField: string;
  dataField: string;
  series?: SeriesConfig[];
  options?: Record<string, any>;
  styles?: CSSProperties;
}

const defaultPalette = ["#5850EC", "#0EA5E9", "#10B981", "#F97316", "#F43F5E"];

// Helper to get nested values using dot notation (e.g., "measures.value")
const getNestedValue = (obj: any, path: string): any => {
  if (!obj || !path) return undefined;
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    if (Array.isArray(current)) {
      current = current[0];
      if (current === undefined) return undefined;
    }
    current = current[part];
  }
  return current;
};

export const PieChartComponent: React.FC<Props> = ({
  id,
  title,
  color,
  data,
  labelField,
  dataField,
  series,
  options,
  styles,
}) => {
  // Transform data if using nested fields (dot notation)
  const isNestedField = (field: string) => field?.includes('.') || false;
  const chartData = React.useMemo(() => {
    if (!isNestedField(labelField) && !isNestedField(dataField)) {
      return data; // No transformation needed
    }
    return data.map((item: any) => ({
      name: isNestedField(labelField) ? getNestedValue(item, labelField) : item[labelField],
      value: isNestedField(dataField) ? getNestedValue(item, dataField) : item[dataField],
    }));
  }, [data, labelField, dataField]);

  // Determine which color palette to use
  const styleColorPalette = styles && (styles as any)['--chart-color-palette'];
  const styleBarColor = styles && (styles as any)['--chart-bar-color'];
  
  let pieColors: string[];
  if (series && series.length > 0) {
    pieColors = series.map((s) => s.color || defaultPalette[0]);
  } else if (color && color !== 'default') {
    pieColors = [color];
  } else if (styleColorPalette === 'default') {
    pieColors = defaultPalette;
  } else if (styleBarColor && styleBarColor !== '#CCCCCC') {
    pieColors = [styleBarColor];
  } else {
    pieColors = defaultPalette;
  }

  const showLegend = options?.showLegend ?? true;
  const showTooltip = options?.showTooltip ?? true;
  const showLabels = options?.showLabels ?? true;

  const containerStyle: CSSProperties = {
    width: "100%",
    height: "400px",
    marginBottom: "20px",
    ...styles,
    minHeight: styles?.minHeight || "400px",
  };

  // Early return if no data or empty data array
  if (!chartData || chartData.length === 0) {
    return (
      <div id={id} style={containerStyle}>
        {title && <h3 style={{ textAlign: "center" }}>{title}</h3>}
        <div style={{ textAlign: "center", paddingTop: "160px" }}>No data available</div>
      </div>
    );
  }

  return (
    <div id={id} style={containerStyle}>
      {title && <h3 style={{ textAlign: "center" }}>{title}</h3>}
      <ResponsiveContainer width="100%" height={350}>
        <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={options?.innerRadius}
            outerRadius={options?.outerRadius || "70%"}
            paddingAngle={options?.paddingAngle || 2}
            startAngle={options?.startAngle || 0}
            endAngle={options?.endAngle || 360}
            label={showLabels}
            labelLine={showLabels}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`${id}-slice-${index}`}
                fill={pieColors[index % pieColors.length]}
              />
            ))}
          </Pie>
          {showTooltip && <Tooltip />}
          {showLegend && <Legend />}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};