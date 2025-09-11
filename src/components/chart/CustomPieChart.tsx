import React, { useState } from "react";
import styled from "styled-components";
import { getVariantColor, VariantColor } from "../../utils";

export type PieChartData = {
  name: string;
  value: number;
  variant?: VariantColor;
  realPercentage?: number;
  visualPercentage?: number;
};

type CustomPieChartProps = {
  title: string;
  data: PieChartData[];
  showLegend?: boolean;
  size?: number;
  minVisualPercentage?: number;
};

const CustomPieChart: React.FC<CustomPieChartProps> = ({
  title,
  data,
  showLegend = true,
  size = 200,
  minVisualPercentage = 5,
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const validData = data.filter(item => item.value > 0);
  const hasValidData = validData.length > 0;
  const totalValue = hasValidData ? validData.reduce((sum, item) => sum + item.value, 0) : 0;
  
  let visualData = [...validData];
  
  if (hasValidData && validData.length > 1) {
    let cumulativeAdjustment = 0;
    
    visualData = validData.map(item => {
      const realPercentage = (item.value / totalValue) * 100;
      
      if (realPercentage < minVisualPercentage) {
        const adjustment = minVisualPercentage - realPercentage;
        cumulativeAdjustment += adjustment;
        
        return {
          ...item,
          visualPercentage: minVisualPercentage,
          realPercentage: realPercentage
        };
      }
      
      return {
        ...item,
        visualPercentage: realPercentage,
        realPercentage: realPercentage
      };
    });
    
    if (cumulativeAdjustment > 0) {
      const largerItems = visualData.filter(item => (item.realPercentage || 0) >= minVisualPercentage);
      const totalLargerPercentage = largerItems.reduce((sum, item) => sum + (item.realPercentage || 0), 0);
      
      if (totalLargerPercentage > 0) {
        visualData = visualData.map(item => {
          if ((item.realPercentage || 0) >= minVisualPercentage) {
            const adjustmentRatio = (item.realPercentage || 0) / totalLargerPercentage;
            const adjustment = cumulativeAdjustment * adjustmentRatio;
            
            return {
              ...item,
              visualPercentage: (item.visualPercentage || 0) - adjustment
            };
          }
          return item;
        });
      }
    }
  } else if (hasValidData) {
    visualData = validData.map(item => ({
      ...item,
      visualPercentage: 100,
      realPercentage: 100
    }));
  }
  
  let cumulativePercentage = 0;
  const coloredData = assignColors(visualData);

  const drawFullCircle = validData.length === 1;

  return (
    <ChartWrapper>
      <ChartHeader>
        <ChartTitle>{title}</ChartTitle>
      </ChartHeader>

      <ChartContent>
        {!hasValidData ? (
          <NoDataMessage>Não há dados disponíveis para exibição</NoDataMessage>
        ) : (
          <>
            <SvgContainer width={size} height={size} viewBox="0 0 32 32">
              {coloredData.map((item) => {
                if (drawFullCircle) {
                  return (
                    <FullCircle
                      key={item.name}
                      cx="16"
                      cy="16"
                      r="15"
                      variant={item.variant!}
                      onMouseEnter={() => setHoveredItem(`${item.name}: ${item.value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`)}
                      onMouseLeave={() => setHoveredItem(null)}
                    />
                  );
                }

                const percentage = item.visualPercentage || 0;
                const startAngle = (cumulativePercentage / 100) * 360;
                cumulativePercentage += percentage;
                const endAngle = (cumulativePercentage / 100) * 360;
                const pathData = describeArc(16, 16, 15, startAngle, endAngle);
                const realPercentage = item.realPercentage || 0;

                return (
                  <Slice
                    key={item.name}
                    variant={item.variant!}
                    d={pathData}
                    onMouseEnter={() => setHoveredItem(`${item.name}: ${item.value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})} (${realPercentage.toFixed(1)}%)`)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={realPercentage < minVisualPercentage ? "adjusted-slice" : ""}
                  />
                );
              })}
            </SvgContainer>

            {showLegend && (
              <LegendContainer>
                {coloredData.map((item) => {
                  const realPercentage = item.realPercentage || 0;
                  return (
                    <LegendItem key={item.name}>
                      <LegendColor variant={item.variant!} />
                      <LegendText>
                        {item.name}: {item.value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                        {` (${realPercentage.toFixed(1)}%)`}
                      </LegendText>
                    </LegendItem>
                  );
                })}
              </LegendContainer>
            )}
          </>
        )}
      </ChartContent>

      {hoveredItem && <Tooltip>{hoveredItem}</Tooltip>}
    </ChartWrapper>
  );
};

export default CustomPieChart;

function assignColors(data: PieChartData[]): PieChartData[] {
  const availableColors: VariantColor[] = ['success', 'info', 'warning', 'quaternary'];
  const colorUsageCount: Record<VariantColor, number> = {
    success: 0,
    info: 0,
    warning: 0,
    quaternary: 0,
    primary: 0,
    secondary: 0,
    tertiary: 0
  };

  return data.map((item) => {
    if (item.variant) {
      colorUsageCount[item.variant] = (colorUsageCount[item.variant] || 0) + 1;
      return item;
    }

    const sortedColors = availableColors.sort((a, b) => colorUsageCount[a] - colorUsageCount[b]);
    const leastUsedColor = sortedColors[0];
    colorUsageCount[leastUsedColor] += 1;

    return { ...item, variant: leastUsedColor };
  });
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    "L", x, y,
    "Z"
  ].join(" ");
}

const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  padding: 5px;
  align-items: center;
`;

const ChartHeader = styled.div`
  text-align: center;
  width: 100%;
  margin-bottom: 15px;
`;

const ChartTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.white};

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ChartContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 10px;
  flex-direction: column;
`;

const NoDataMessage = styled.div`
  color: ${({ theme }) => theme.colors.white};
  font-size: 1rem;
  text-align: center;
  padding: 20px;
`;

const SvgContainer = styled.svg`
  display: block;
  flex-shrink: 0;
`;

const LegendContainer = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 15px;
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

const Slice = styled.path<{ variant: VariantColor }>`
  fill: ${({ theme, variant }) => getVariantColor(theme, variant)};
  stroke: ${({ theme }) => theme.colors.gray};
  stroke-width: 0.5;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    filter: brightness(1.5);
  }
`;

const FullCircle = styled.circle<{ variant: VariantColor }>`
  fill: ${({ theme, variant }) => getVariantColor(theme, variant)};
  stroke: ${({ theme }) => theme.colors.gray};
  stroke-width: 0.5;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    filter: brightness(1.5);
  }
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