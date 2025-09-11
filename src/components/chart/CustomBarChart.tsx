import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { getVariantColor, VariantColor } from "../../utils";

export type ChartSeries = {
  name: string;
  variant: VariantColor;
  data: number[];
};

export type BarChartData = {
  labels: string[];
  series: ChartSeries[];
};

type CustomBarChartProps = {
  title: string;
  data: BarChartData;
  showLegend?: boolean;
  showGridLines?: boolean;
  barWidth?: number;
  barGap?: number;
  groupGap?: number;
  height?: number;
};

const MIN_BAR_WIDTH = 1;
const MIN_BAR_GAP = 1;
const MIN_GROUP_GAP = 1;

const CustomBarChart: React.FC<CustomBarChartProps> = ({ 
  title, 
  data,
  showLegend = true,
  showGridLines = true,
  barWidth = 25,
  barGap = 3,
  groupGap = 25,
  height = 200,
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);
  const [chartHeight, setChartHeight] = useState(height);
  const maxValue = Math.max(...data.series.flatMap(series => series.data));
  const gridLines = showGridLines ? Array.from({ length: 5 }, (_, i) => maxValue * ((i + 1) / 5)) : [];

  const calculateIdealHeight = (width: number) => {
    const goldenRatio = 5;
    const baseHeight = width / goldenRatio;
    return Math.min(Math.max(baseHeight, 200), 600);
  };

  useEffect(() => {
    const updateDimensions = () => {
      if (chartContainerRef.current) {
        const containerWidth = chartContainerRef.current.offsetWidth;
        const availableWidth = containerWidth;
        setChartWidth(availableWidth);
        const idealHeight = calculateIdealHeight(availableWidth);
        setChartHeight(idealHeight);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const numGroups = data.labels.length;
  const numSeriesPerGroup = data.series.length;

  const calculateBarDimensions = () => {
    const availableWidth = chartWidth;
    let calculatedBarWidth = barWidth;
    let calculatedBarGap = barGap;
    let calculatedGroupGap = groupGap;

    const totalNeededWidth = numGroups * (
      (numSeriesPerGroup * calculatedBarWidth) + 
      ((numSeriesPerGroup - 1) * calculatedBarGap) + 
      calculatedGroupGap
    );

    if (totalNeededWidth > availableWidth) {
      const ratio = availableWidth / totalNeededWidth;
      calculatedBarWidth = Math.max(MIN_BAR_WIDTH, barWidth * ratio);
      calculatedBarGap = Math.max(MIN_BAR_GAP, barGap * ratio);
      calculatedGroupGap = Math.max(MIN_GROUP_GAP, groupGap * ratio);
    }

    return {
      barWidth: calculatedBarWidth,
      barGap: calculatedBarGap,
      groupGap: calculatedGroupGap
    };
  };

  const { barWidth: responsiveBarWidth, groupGap: responsiveGroupGap } = calculateBarDimensions();

  const totalChartWidth = data.labels.length * (data.series.length * (responsiveBarWidth + barGap) + responsiveGroupGap) - responsiveGroupGap;
  const hasData = data.labels.length > 0 && data.series.some(series => series.data.some(value => value > 0));

  if (!hasData) {
    return (
      <ChartContainer ref={chartContainerRef}>
        <ChartHeader>
          <ChartTitle>{title}</ChartTitle>
        </ChartHeader>
        <NoDataMessage>Não há dados disponíveis para exibição</NoDataMessage>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer ref={chartContainerRef}>
      <ChartHeader>
        <ChartTitle>{title}</ChartTitle>
        {showLegend && (
          <LegendContainer>
            {data.series.map((series) => (
              <LegendItem key={series.name}>
                <LegendColor variant={series.variant} />
                <LegendText>{series.name}</LegendText>
              </LegendItem>
            ))}
          </LegendContainer>
        )}
      </ChartHeader>

      <ScrollContainer>
        <ChartContent>
          <SvgContainer height={chartHeight} width={totalChartWidth + 10}>
            {showGridLines && (
              <GridContainer height={chartHeight} width="100%">
                {gridLines.map((value, i) => {
                  const y = chartHeight - (value / maxValue) * (chartHeight);
                  return (
                    <GridLine 
                      key={`line-${i}`}
                      x1={10}
                      y1={y} 
                      x2="100%" 
                      y2={y} 
                    />
                  );
                })}
              </GridContainer>
            )}

            <g transform={`translate(10, 0)`}>
              {data.labels.map((_label, groupIndex) => (
                <g key={groupIndex} transform={`translate(${groupIndex * (data.series.length * (responsiveBarWidth + barGap) + responsiveGroupGap)}, 0)`}>
                  {data.series.map((series, seriesIndex) => {
                    const x = seriesIndex * (responsiveBarWidth + barGap);
                    const value = series.data[groupIndex];
                    const barHeight = (value / maxValue) * (chartHeight);
                    const y = chartHeight - barHeight;

                    return (
                      <g
                        key={`${groupIndex}-${seriesIndex}`}
                        onMouseEnter={() => setHoveredItem(`${series.name}: R$ ${value.toLocaleString()}`)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        <Bar x={x} y={y} width={responsiveBarWidth} height={barHeight} variant={series.variant} />
                      </g>
                    );
                  })}
                </g>
              ))}

              <g transform={`translate(0, ${chartHeight + 20})`}>
                {data.labels.map((label, groupIndex) => {
                  const labelX = (groupIndex * (data.series.length * (responsiveBarWidth + barGap) + responsiveGroupGap)) + (data.series.length * (responsiveBarWidth + barGap)) / 2;
                  return (
                    <BarLabel
                      key={groupIndex}
                      x={labelX}
                      y={0}
                      transform={`rotate(-45, ${labelX}, 10)`}

                    >
                      {label}
                    </BarLabel>
                  );
                })}
              </g>
            </g>
          </SvgContainer>
        </ChartContent>
      </ScrollContainer>

      {hoveredItem && <Tooltip>{hoveredItem}</Tooltip>}
    </ChartContainer>
  );
};

export default CustomBarChart;

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  padding: 5px;
  align-items: center;
`;

const ScrollContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.tertiary};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  
    &:hover {
      background: rgba(255, 255, 255, 0.4);
    }
  }
`;

const ChartContent = styled.div`
  position: relative;
  display: inline-block;
  vertical-align: top;
  width: 100%;
  text-align: center;
`;

const SvgContainer = styled.svg.attrs<{ height: number, width: number }>(props => ({
  height: props.height + 50,
  width: props.width
}))`
  display: block;
  margin: 0 auto;
  width: 100%;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
  flex-direction: column;
  text-align: center;
`;

const LegendContainer = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px;
`;

const LegendColor = styled.div<{ variant: VariantColor }>`
  width: 16px;
  height: 16px;
  background-color: ${({ variant, theme }) => getVariantColor(theme, variant)};
  border-radius: 4px;
`;

const LegendText = styled.span`
  color: ${({ theme }) => theme.colors.white};
  font-size: 14px;
`;

const Tooltip = styled.div`
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: ${({ theme }) => theme.colors.white};
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  pointer-events: none;
  white-space: nowrap;
  z-index: 2;
`;

const GridLine = styled.line`
  stroke: ${({ theme }) => theme.colors.gray};
  stroke-dasharray: 4;
  width: 100%;
`;

const ChartTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.white};

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const BarLabel = styled.text`
  fill: ${({ theme }) => theme.colors.white};
  font-size: 14px;
  font-weight: bold;
  text-anchor: middle;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const GridContainer = styled.svg.attrs<{ height: number }>(props => ({
  width: "100%",
  height: props.height
}))`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
`;

const Bar = styled.rect<{ variant: VariantColor }>`
  fill: ${({ variant, theme }) => getVariantColor(theme, variant)};
  transition: all 0.3s ease;
  cursor: pointer;
  z-index: 2;

  &:hover {
    filter: brightness(1.75);
  }
`;

const NoDataMessage = styled.div`
  color: ${({ theme }) => theme.colors.white};
  font-size: 1rem;
  text-align: center;
  padding: 20px;
`;
