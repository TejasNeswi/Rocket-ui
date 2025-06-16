import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Line } from "react-chartjs-2";
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
  const [data, setData] = useState([]);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    fetch("/dummy_rocket_data_with_velocity.csv")
      .then((res) => res.text())
      .then((text) => {
        const lines = text.trim().split("\n");
        const parsed = lines.slice(1).map((line) => {
          const [timestamp, pitch, yaw, roll, altitude, velocity] = line.split(",").map(Number);
          return { timestamp, pitch, yaw, roll, altitude, velocity };
        });
        setData(parsed);
      });
  }, []);

  useEffect(() => {
    if (data.length === 0) return;
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % data.length);
    }, 400);
    return () => clearInterval(interval);
  }, [data]);

  if (data.length === 0) return <p style={{ color: '#ffffff' }}>Loading data...</p>;

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
            <RocketViewer data={data} frame={frame} />
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
                <AltitudeGraph data={data} currentFrame={frame} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <VelocityGraph data={data} currentFrame={frame} />
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
          <GraphDashboard data={data} currentFrame={frame} />
        </div>
      </div>
    </div>
  );
}
