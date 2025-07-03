import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Line, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Rocket({ pitch, yaw, roll }) {
  return (
    <group
      rotation={[
        (pitch * Math.PI) / 180,
        (yaw * Math.PI) / 180,
        (roll * Math.PI) / 180,
      ]}
    >
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 4, 32]} />
        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 2.2, 0]}>
        <coneGeometry args={[0.2, 0.6, 32]} />
        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.2, -2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.1, 0.6, 0.2]} />
        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.2, -2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.1, 0.6, 0.2]} />
        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, -2, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.1, 0.6, 0.2]} />
        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, -2, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.1, 0.6, 0.2]} />
        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function RocketViewer({ data, frame }) {
  const current = data[frame] || data[0];
  return (
    <Canvas style={{ height: "500px", background: "#000000" }} camera={{ position: [0, 0, 10] }}>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <OrbitControls />
      <Rocket {...current} />
    </Canvas>
  );
}

function SingleGraph({ label, dataPoints, color, backgroundColor, labels }) {
  const chartData = {
    labels,
    datasets: [
      {
        label,
        data: dataPoints,
        borderColor: color,
        backgroundColor,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#ffffff'
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff'
        }
      }
    }
  };

  return <Line data={chartData} options={options} />;
}

function PathGraph({ data, currentFrame }) {
  const windowSize = 30;
  const start = Math.max(0, currentFrame - windowSize + 1);
  const end = currentFrame + 1;
  const windowData = data.slice(start, end);

  // Interpolate points between each pair (linear interpolation, 4 points between each pair)
  const interpolatedData = [];
  const numInterp = 4; // number of points to interpolate between each pair
  for (let i = 0; i < windowData.length - 1; i++) {
    const p1 = windowData[i];
    const p2 = windowData[i + 1];
    interpolatedData.push({ x: p1.pitch, y: p1.roll });
    for (let j = 1; j <= numInterp; j++) {
      const t = j / (numInterp + 1);
      interpolatedData.push({
        x: p1.pitch + (p2.pitch - p1.pitch) * t,
        y: p1.roll + (p2.roll - p1.roll) * t,
      });
    }
  }
  if (windowData.length > 0) {
    interpolatedData.push({ x: windowData[windowData.length - 1].pitch, y: windowData[windowData.length - 1].roll });
  }

  const scatterData = {
    datasets: [
      {
        label: "Path",
        data: interpolatedData,
        backgroundColor: "#00ff00",
        borderColor: "#00ff00",
        showLine: true,
        pointRadius: 2,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#ffffff",
        },
      },
      title: {
        display: true,
        text: "Path (Pitch vs Roll, Interpolated)",
        color: "#00ff00",
        font: {
          size: 18,
        },
      },
    },
    scales: {
      x: {
        min: -50,
        max: 50,
        title: {
          display: true,
          text: "Pitch",
          color: "#ffffff",
          font: { size: 14 },
        },
        grid: { color: "rgba(255,255,255,0.1)" },
        ticks: { color: "#ffffff" },
      },
      y: {
        min: -50,
        max: 50,
        title: {
          display: true,
          text: "Roll",
          color: "#ffffff",
          font: { size: 14 },
        },
        grid: { color: "rgba(255,255,255,0.1)" },
        ticks: { color: "#ffffff" },
      },
    },
  };
  return (
    <div style={{ height: "300px", width: "100%", marginTop: "20px" }}>
      <Scatter data={scatterData} options={options} />
    </div>
  );
}

function GraphDashboard({ data, currentFrame }) {
  const windowSize = 30;
  const start = Math.max(0, currentFrame - windowSize + 1);
  const end = currentFrame + 1;
  const windowData = data.slice(start, end);
  const labels = windowData.map((d) => d.timestamp);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <SingleGraph
        label="Pitch"
        dataPoints={windowData.map((d) => d.pitch)}
        color="#00ff00"
        backgroundColor="rgba(0, 255, 0, 0.1)"
        labels={labels}
      />
      <SingleGraph
        label="Yaw"
        dataPoints={windowData.map((d) => d.yaw)}
        color="#00ff00"
        backgroundColor="rgba(0, 255, 0, 0.1)"
        labels={labels}
      />
      <SingleGraph
        label="Roll"
        dataPoints={windowData.map((d) => d.roll)}
        color="#00ff00"
        backgroundColor="rgba(0, 255, 0, 0.1)"
        labels={labels}
      />
    </div>
  );
}

function AltitudeGraph({ data, currentFrame }) {
  const windowSize = 30;
  const start = Math.max(0, currentFrame - windowSize + 1);
  const end = currentFrame + 1;
  const windowData = data.slice(start, end);

  const maxAltitude = Math.max(...windowData.map(d => d.altitude));
  const yAxisPadding = maxAltitude * 0.2; // Add 20% padding to y-axis

  const chartData = {
    labels: windowData.map(d => d.timestamp.toFixed(1)),
    datasets: [
      {
        label: 'Altitude (mm)',
        data: windowData.map(d => d.altitude),
        borderColor: '#00ff00',
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
        borderWidth: 3,
        pointRadius: 4,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#ffffff',
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: 'Altitude vs Time',
        color: '#00ff00',
        font: {
          size: 18
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff',
          font: {
            size: 12
          }
        },
        title: {
          display: true,
          text: 'Time (s)',
          color: '#ffffff',
          font: {
            size: 14
          }
        }
      },
      y: {
        min: 0,
        max: maxAltitude + yAxisPadding,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff',
          font: {
            size: 12
          }
        },
        title: {
          display: true,
          text: 'Altitude (mm)',
          color: '#ffffff',
          font: {
            size: 14
          }
        }
      }
    }
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

function VelocityGraph({ data, currentFrame }) {
  const windowSize = 30;
  const start = Math.max(0, currentFrame - windowSize + 1);
  const end = currentFrame + 1;
  const windowData = data.slice(start, end);

  const maxVelocity = Math.max(...windowData.map(d => d.velocity));
  const yAxisPadding = maxVelocity * 0.2; // Add 20% padding to y-axis

  const chartData = {
    labels: windowData.map(d => d.timestamp.toFixed(1)),
    datasets: [
      {
        label: 'Velocity (m/s)',
        data: windowData.map(d => d.velocity),
        borderColor: '#00ff00',
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
        borderWidth: 3,
        pointRadius: 4,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#ffffff',
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: 'Velocity vs Time',
        color: '#00ff00',
        font: {
          size: 18
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff',
          font: {
            size: 12
          }
        },
        title: {
          display: true,
          text: 'Time (s)',
          color: '#ffffff',
          font: {
            size: 14
          }
        }
      },
      y: {
        min: 0,
        max: maxVelocity + yAxisPadding,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff',
          font: {
            size: 12
          }
        },
        title: {
          display: true,
          text: 'Velocity (m/s)',
          color: '#ffffff',
          font: {
            size: 14
          }
        }
      }
    }
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default function App() {
  const [orientationData, setOrientationData] = useState([]); // logs.csv
  const [altVelData, setAltVelData] = useState([]); // dummy_rocket_data_with_velocity.csv
  const [frame, setFrame] = useState(0);

  // Fetch orientation data (logs.csv)
  useEffect(() => {
    fetch("/logs.csv")
      .then((res) => res.text())
      .then((text) => {
        const lines = text.trim().split("\n");
        const parsed = lines.slice(1).map((line) => {
          const [timestamp, pitch, roll, yaw] = line.split(",").map(Number);
          return { timestamp, pitch, roll, yaw };
        });
        setOrientationData(parsed);
      });
  }, []);

  // Fetch altitude/velocity data (dummy_rocket_data_with_velocity.csv)
  useEffect(() => {
    fetch("/dummy_rocket_data_with_velocity.csv")
      .then((res) => res.text())
      .then((text) => {
        const lines = text.trim().split("\n");
        const parsed = lines.slice(1).map((line) => {
          const [timestamp, pitch, yaw, roll, altitude, velocity] = line.split(",").map(Number);
          return { timestamp, pitch, yaw, roll, altitude, velocity };
        });
        setAltVelData(parsed);
      });
  }, []);

  // Synchronize frame index
  const minLength = Math.min(orientationData.length, altVelData.length);
  useEffect(() => {
    if (minLength === 0) return;
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % minLength);
    }, 400);
    return () => clearInterval(interval);
  }, [minLength]);

  if (orientationData.length === 0 || altVelData.length === 0)
    return <p style={{ color: '#ffffff' }}>Loading data...</p>;

  // Compose a single object for RocketViewer (uses pitch, yaw, roll)
  const rocketFrame = orientationData[frame] || orientationData[0];

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#000000',
      minHeight: '100vh',
      color: '#ffffff'
    }}>
      <h2 style={{ 
        fontSize: '1.5rem', 
        fontWeight: 'bold', 
        marginBottom: '40px',
        textAlign: 'center',
        color: '#00ff00',
        textShadow: '0 0 10px rgba(0, 255, 0, 0.5)'
      }}>
        Rocket Movement Visualization
      </h2>
      <div style={{ 
        display: 'flex', 
        gap: '40px',
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: '100%',
        maxWidth: '1200px',
        marginTop: '40px'
      }}>
        <div style={{ 
          flex: '2',
          display: 'flex',
          flexDirection: 'column',
          gap: '40px'
        }}>
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '500px',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)',
            marginTop: '60px'
          }}>
            <RocketViewer data={[rocketFrame]} frame={0} />
          </div>
          <div style={{
            backgroundColor: 'rgba(0, 255, 0, 0.1)',
            borderRadius: '10px',
            padding: '30px',
            border: '1px solid rgba(0, 255, 0, 0.3)',
            boxShadow: '0 0 20px rgba(0, 255, 0, 0.2)',
            marginTop: '20px'
          }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              marginBottom: '30px',
              textAlign: 'center',
              color: '#00ff00',
              textShadow: '0 0 10px rgba(0, 255, 0, 0.5)'
            }}>
              Altitude and Velocity Graphs
            </h3>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'row', 
              gap: '30px',
              justifyContent: 'space-between'
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <AltitudeGraph data={altVelData} currentFrame={frame} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <VelocityGraph data={altVelData} currentFrame={frame} />
              </div>
            </div>
          </div>
        </div>
        <div style={{ 
          flex: '1',
          minWidth: '300px',
          padding: '20px',
          backgroundColor: 'rgba(0, 255, 0, 0.1)',
          borderRadius: '10px',
          border: '1px solid rgba(0, 255, 0, 0.3)',
          boxShadow: '0 0 20px rgba(0, 255, 0, 0.2)'
        }}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            marginBottom: '20px',
            textAlign: 'center',
            color: '#00ff00',
            textShadow: '0 0 10px rgba(0, 255, 0, 0.5)'
          }}>
            Orientation Graphs
          </h3>
          <GraphDashboard data={orientationData} currentFrame={frame} />
        </div>
      </div>
      {/* Path Graph Section */}
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        marginTop: '40px',
        backgroundColor: 'rgba(0, 255, 0, 0.08)',
        borderRadius: '10px',
        border: '1px solid rgba(0, 255, 0, 0.2)',
        boxShadow: '0 0 20px rgba(0, 255, 0, 0.1)',
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          marginBottom: '30px',
          textAlign: 'center',
          color: '#00ff00',
          textShadow: '0 0 10px rgba(0, 255, 0, 0.5)'
        }}>
          Path Graph
        </h3>
        <PathGraph data={orientationData} currentFrame={frame} />
      </div>
    </div>
  );
}
