import React, { CSSProperties, useCallback, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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

const defaultSeriesColors = ["#4a90e2", "#10B981", "#F97316", "#F43F5E", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"];

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

const resolveColor = (
  explicit?: string,
  options?: Record<string, any>,
  styles?: CSSProperties
) =>
  explicit ||
  options?.barColor ||
  (styles && (styles as any)["--chart-bar-color"]) ||
  "#7f56d9";

export const BarChartComponent: React.FC<Props> = ({
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
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());

  // Transform data if using nested fields (dot notation) and no multi-series
  const isNestedField = (field: string) => field?.includes('.') || false;
  const chartData = React.useMemo(() => {
    if (series && series.length > 0) {
      return data;
    }
    if (!isNestedField(labelField) && !isNestedField(dataField)) {
      return data; // No transformation needed
    }
    return data.map((item: any) => ({
      name: isNestedField(labelField) ? getNestedValue(item, labelField) : item[labelField],
      value: isNestedField(dataField) ? getNestedValue(item, dataField) : item[dataField],
    }));
  }, [data, labelField, dataField, series]);

  // Use transformed field names if we did transformation
  const actualLabelField =
    series && series.length > 0
      ? "name"
      : (isNestedField(labelField) || isNestedField(dataField)) ? 'name' : labelField;
  const actualDataField =
    series && series.length > 0
      ? series[0]?.name || 'value'
      : (isNestedField(labelField) || isNestedField(dataField)) ? 'value' : dataField;

  const maxValue = Math.max(0, ...chartData.flatMap(d => {
    if (series && series.length > 0) {
      return series.map(s => d[s.name] || 0);
    } else {
      return [d[actualDataField] || 0];
    }
  }));
  const tickCount = Math.max(1, maxValue + 1);

  const containerStyle: CSSProperties = {
    width: "100%",
    height: "400px",
    marginBottom: "20px",
    ...styles,
  };

  const orientation = options?.orientation || "vertical";
  const showGrid = options?.showGrid ?? true;
  const showLegend = options?.showLegend ?? true;
  const showTooltip = options?.showTooltip ?? true;
  const showXAxisLabels = options?.showXAxisLabels ?? true;
  const xAxisLabelAngle = options?.xAxisLabelAngle ?? -45;
  const xAxisTick = options?.xAxisTick ?? (showXAxisLabels ? { angle: xAxisLabelAngle, textAnchor: xAxisLabelAngle < 0 ? "end" : "middle", fontSize: 12 } : false);
  const resolvedColor = resolveColor(color, options, styles);

  const renderBarLabel = useCallback((props: any) => {
    const { x, y, width, payload } = props;
    const labelText = payload?.name ?? "";
    if (!labelText) return null;
    return (
      <text
        x={x + width / 2}
        y={y + 16}
        fill={options?.barLabelColor ?? "#fff"}
        textAnchor="middle"
        fontSize={12}
        fontWeight={600}
      >
        {labelText}
      </text>
    );
  }, [options?.barLabelColor]);

  const handleLegendClick = useCallback((dataKey: string) => {
    setHiddenSeries((prev) => {
      const next = new Set(prev);
      if (next.has(dataKey)) {
        next.delete(dataKey);
      } else {
        next.add(dataKey);
      }
      return next;
    });
  }, []);

  const renderLegend = (props: any) => {
    const { payload } = props;
    if (!payload) return null;
    return (
      <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap", padding: "8px" }}>
        {payload.map((entry: any, index: number) => (
          <div
            key={`legend-${index}`}
            onClick={() => handleLegendClick(entry.dataKey)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              opacity: hiddenSeries.has(entry.dataKey) ? 0.4 : 1,
              textDecoration: hiddenSeries.has(entry.dataKey) ? "line-through" : "none",
            }}
          >
            <span style={{ width: 12, height: 12, backgroundColor: entry.color, borderRadius: 2 }} />
            <span style={{ fontSize: 13, color: "#374151" }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div id={id} style={containerStyle}>
      {title && <h3 style={{ textAlign: "center", marginBottom: "10px" }}>{title}</h3>}
      <ResponsiveContainer width="100%" height={360}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          layout={orientation === "horizontal" ? "vertical" : "horizontal"}
          barSize={options?.barWidth}
          barCategoryGap={options?.barGap}
        >
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke={options?.gridColor} />
          )}
          <XAxis
            type={orientation === "horizontal" ? "number" : "category"}
            dataKey={orientation === "horizontal" ? actualDataField : actualLabelField}
            tick={xAxisTick}
            axisLine={showXAxisLabels}
            tickLine={showXAxisLabels}
            interval={showXAxisLabels ? 0 : "preserveStart"}
            height={options?.xAxisHeight ?? 80}
          />
          <YAxis
            type={orientation === "horizontal" ? "category" : "number"}
            dataKey={orientation === "horizontal" ? actualLabelField : undefined}
            domain={orientation === "horizontal" ? undefined : [0, maxValue]}
            tickCount={orientation === "horizontal" ? undefined : tickCount}
          />
          {showTooltip && <Tooltip />}
          {showLegend && <Legend verticalAlign={legendPosition} content={renderLegend} />}
          {series && series.length > 0 ? (
            series.map((s, index) => (
              <Bar
                key={s.name || index}
                dataKey={s.name}
                name={s.name}
                fill={s.color || defaultSeriesColors[index % defaultSeriesColors.length]}
                stackId={options?.stacked ? "stack" : undefined}
                isAnimationActive={options?.animate ?? true}
                hide={hiddenSeries.has(s.name || "")}
                label={!showXAxisLabels ? renderBarLabel : undefined}
              />
            ))
          ) : (
            <Bar
              dataKey={actualDataField}
              fill={resolvedColor}
              stackId={options?.stacked ? "stack" : undefined}
              isAnimationActive={options?.animate ?? true}
              hide={hiddenSeries.has(actualDataField)}
              label={!showXAxisLabels ? renderBarLabel : undefined}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};