import React, { useMemo } from "react";
import { Typography, Tooltip } from "antd"; // Import Tooltip
import * as Astronomy from "astronomy-engine";
import dayjs from "dayjs";

const { Text } = Typography;

interface NatalChartProps {
  dob: dayjs.Dayjs;
  tob: dayjs.Dayjs;
}

const ZODIAC_SIGNS = [
  { name: "Aries", symbol: "♈", color: "#FF5733", start: 0, desc: "The Ram" },
  {
    name: "Taurus",
    symbol: "♉",
    color: "#4CAF50",
    start: 30,
    desc: "The Bull",
  },
  {
    name: "Gemini",
    symbol: "♊",
    color: "#FFC107",
    start: 60,
    desc: "The Twins",
  },
  {
    name: "Cancer",
    symbol: "♋",
    color: "#B23EFF",
    start: 90,
    desc: "The Crab",
  },
  { name: "Leo", symbol: "♌", color: "#FF9800", start: 120, desc: "The Lion" },
  {
    name: "Virgo",
    symbol: "♍",
    color: "#8BC34A",
    start: 150,
    desc: "The Virgin",
  },
  {
    name: "Libra",
    symbol: "♎",
    color: "#03A9F4",
    start: 180,
    desc: "The Scales",
  },
  {
    name: "Scorpio",
    symbol: "♏",
    color: "#E91E63",
    start: 210,
    desc: "The Scorpion",
  },
  {
    name: "Sagittarius",
    symbol: "♐",
    color: "#9C27B0",
    start: 240,
    desc: "The Archer",
  },
  {
    name: "Capricorn",
    symbol: "♑",
    color: "#795548",
    start: 270,
    desc: "The Goat",
  },
  {
    name: "Aquarius",
    symbol: "♒",
    color: "#00BCD4",
    start: 300,
    desc: "The Water Bearer",
  },
  {
    name: "Pisces",
    symbol: "♓",
    color: "#3F51B5",
    start: 330,
    desc: "The Fish",
  },
];

const PLANETS = [
  { name: "Sun", key: Astronomy.Body.Sun, symbol: "☉", color: "#FFD700" },
  { name: "Moon", key: Astronomy.Body.Moon, symbol: "☽", color: "#E0E0E0" },
  {
    name: "Mercury",
    key: Astronomy.Body.Mercury,
    symbol: "☿",
    color: "#B0BEC5",
  },
  { name: "Venus", key: Astronomy.Body.Venus, symbol: "♀", color: "#F48FB1" },
  { name: "Mars", key: Astronomy.Body.Mars, symbol: "♂", color: "#EF5350" },
  {
    name: "Jupiter",
    key: Astronomy.Body.Jupiter,
    symbol: "♃",
    color: "#FFCA28",
  },
  { name: "Saturn", key: Astronomy.Body.Saturn, symbol: "♄", color: "#8D6E63" },
];

const NatalChart: React.FC<NatalChartProps> = ({ dob, tob }) => {
  // 1. Calculate Planetary Positions
  const planetaryPositions = useMemo(() => {
    const dateObj = dob
      .hour(tob.hour())
      .minute(tob.minute())
      .second(0)
      .toDate();

    return PLANETS.map((planet) => {
      const vector = Astronomy.GeoVector(planet.key, dateObj, true);
      let longitude = Math.atan2(vector.y, vector.x) * (180 / Math.PI);
      if (longitude < 0) longitude += 360;

      // Find which sign this planet is in
      const signIndex = Math.floor(longitude / 30);
      const signName = ZODIAC_SIGNS[signIndex]?.name || "";

      return {
        ...planet,
        degree: longitude,
        sign: signName,
      };
    });
  }, [dob, tob]);

  // SVG Config
  const size = 320;
  const center = size / 2;
  const radius = size / 2 - 10;
  const innerRadius = radius - 40;

  const getCoordinates = (degree: number, r: number) => {
    const radians = -degree * (Math.PI / 180);
    return {
      x: center + r * Math.cos(radians),
      y: center + r * Math.sin(radians),
    };
  };

  return (
    <div style={{ textAlign: "center", margin: "20px 0" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Zodiac Ring Background */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#b23eff"
          strokeWidth="1"
          opacity={0.3}
        />
        <circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill="none"
          stroke="#b23eff"
          strokeWidth="1"
          opacity={0.3}
        />

        {/* Render Zodiac Signs with Tooltips */}
        {ZODIAC_SIGNS.map((sign) => {
          const startCoords = getCoordinates(sign.start, radius);
          const textCoords = getCoordinates(sign.start + 15, radius - 20);

          return (
            <g key={sign.name}>
              <line
                x1={center}
                y1={center}
                x2={startCoords.x}
                y2={startCoords.y}
                stroke="#b23eff"
                strokeWidth="0.5"
                opacity={0.2}
              />

              <Tooltip title={`${sign.name}: ${sign.desc}`} color={sign.color}>
                <text
                  x={textCoords.x}
                  y={textCoords.y}
                  fill={sign.color}
                  fontSize="16"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontFamily: '"Cinzel Decorative", cursive',
                    cursor: "help",
                  }}
                >
                  {sign.symbol}
                </text>
              </Tooltip>
            </g>
          );
        })}

        {/* Render Planets with Rich Tooltips */}
        {planetaryPositions.map((planet, index) => {
          const planetRadius = innerRadius - 20 - (index % 2) * 15;
          const coords = getCoordinates(planet.degree, planetRadius);

          return (
            <Tooltip
              key={planet.name}
              title={
                <div style={{ textAlign: "center" }}>
                  <strong>{planet.name}</strong>
                  <div style={{ fontSize: "12px", opacity: 0.8 }}>
                    {Math.floor(planet.degree)}° in {planet.sign}
                  </div>
                </div>
              }
              color="#1B2735"
              overlayInnerStyle={{ border: `1px solid ${planet.color}` }}
            >
              <g style={{ cursor: "pointer" }}>
                <line
                  x1={center}
                  y1={center}
                  x2={coords.x}
                  y2={coords.y}
                  stroke={planet.color}
                  strokeWidth="1"
                  opacity={0.3}
                  strokeDasharray="2,2"
                />
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r="10"
                  fill="#1B2735"
                  stroke={planet.color}
                  strokeWidth="1"
                />
                <text
                  x={coords.x}
                  y={coords.y + 1}
                  fill={planet.color}
                  fontSize="14"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {planet.symbol}
                </text>
              </g>
            </Tooltip>
          );
        })}

        {/* Center Sun */}
        <circle cx={center} cy={center} r="5" fill="#ffd700" opacity={0.8} />
      </svg>

      <div style={{ marginTop: 10 }}>
        <Text style={{ color: "#bfa5d6", fontSize: "12px" }}>
          Hover over symbols for details
        </Text>
      </div>
    </div>
  );
};

export default NatalChart;
