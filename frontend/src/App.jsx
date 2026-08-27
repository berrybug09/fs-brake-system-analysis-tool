import {useEffect, useState} from "react";
import axios from "axios";
import "./App.css";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine} from "recharts";

function App() {
  const [activeTab, setActiveTab] = useState("analysis");

  const [inputs, setInputs] = useState({
    pedal_force: "",
    pedal_ratio: "",
    front_mc_diameter: "",
    rear_mc_diameter: "",
    front_piston_count: "",
    rear_piston_count: "",
    front_caliper_diameter: "",
    rear_caliper_diameter: "",
    front_rotor_radius: "",
    rear_rotor_radius: "",
    front_balance_percent: "",
    vehicle_mass: "",
    front_tire_radius: "",
    rear_tire_radius: "",
    front_pad_mu: "",
    rear_pad_mu: "",
    wheelbase: "",
    cg_height: "",
    tire_mu: "",
    front_static_weight_percent: "",
  });

  const [result, setResult] = useState(null);

  function handleChange(e) {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  }

  async function calculate() {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/calculate",
        Object.fromEntries(
          Object.entries(inputs).map(([key, value]) => [
            key,
            Number(value),
          ])
        )
      );

      setResult(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const columns = [
    [
      { name: "pedal_force", label: "Pedal Force (N)" },
      { name: "front_mc_diameter", label: "Front MC Diameter (mm)" },
      { name: "front_piston_count", label: "Front Piston Count" },
      { name: "front_rotor_radius", label: "Front Rotor Radius (mm)" },
      { name: "front_tire_radius", label: "Front Tire Radius (mm)" },
      
    ],

    [
      { name: "pedal_ratio", label: "Pedal Ratio" },
      { name: "rear_mc_diameter", label: "Rear MC Diameter (mm)" },
      { name: "rear_piston_count", label: "Rear Piston Count" },
      { name: "rear_rotor_radius", label: "Rear Rotor Radius (mm)" },
      { name: "rear_tire_radius", label: "Rear Tire Radius (mm)" },
      
    ],

    [
      { name: "vehicle_mass", label: "Vehicle Mass (kg)" },
      { name: "front_balance_percent", label: "Front Balance (%)" },
      { name: "front_caliper_diameter", label: "Front Piston Diameter (mm)" },
      { name: "wheelbase", label: "Wheelbase (m)" },
      { name: "front_pad_mu", label: "Front Pad Mu" },
    ],

    [
      { name: "tire_mu", label: "Tire Mu" },
      { name: "front_static_weight_percent", label: "Front Weight Distribution (%)" },
      { name: "rear_caliper_diameter", label: "Rear Piston Diameter (mm)" },
      { name: "cg_height", label: "CG Height (m)" },
      { name: "rear_pad_mu", label: "Rear Pad Mu" },
    ],
  ];

  return (
  <div className="app-container">

    <h1>Formula Student Brake System Analysis Tool</h1>

    {/* Tabs always visible */}
    <div className="tab-bar">
      <button
        className={activeTab === "analysis" ? "tab active" : "tab"}
        onClick={() => setActiveTab("analysis")}
      >
        Analysis
      </button>

      <button
        className={activeTab === "charts" ? "tab active" : "tab"}
        onClick={() => setActiveTab("charts")}
      >
        Charts
      </button>
    </div>

    {activeTab === "analysis" && (
      <>
        <div className="input-grid">
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="column">
              {column.map((field) => (
                <div key={field.name} className="input-row">
                  <label>{field.label}</label>

                  <input
                    type="number"
                    name={field.name}
                    value={inputs[field.name]}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        <button
          className="calculate-btn"
          onClick={calculate}
        >
          Calculate
        </button>

        {result && (
          <div className="results-box">

            <div className="results-header">
              <span>Hydraulic and Braking Results</span>
              <span>Vehicle Dynamics Results</span>
              <span> Tire Performance Analysis</span>
            </div>

            <div className="results-content">

              {/* Hydraulics */}
              <div>

                <div className="result-row">
                  <span>Pushrod Force</span>
                  <strong>{result.pushrod_force?.toFixed(2)} N</strong>
                </div>

                <div className="result-row">
                  <span>Front Pressure</span>
                  <strong>{result.front_pressure?.toFixed(2)} N/mm²</strong>
                </div>

                <div className="result-row">
                  <span>Rear Pressure</span>
                  <strong>{result.rear_pressure?.toFixed(2)} N/mm²</strong>
                </div>

                <div className="result-row">
                  <span>Front Clamp Force</span>
                  <strong>{result.front_clamp_force?.toFixed(2)} N</strong>
                </div>

                <div className="result-row">
                  <span>Rear Clamp Force</span>
                  <strong>{result.rear_clamp_force?.toFixed(2)} N</strong>
                </div>

                <div className="result-row">
                  <span>Front Brake Torque</span>
                  <strong>{(result.front_brake_torque/1000)?.toFixed(2)} N·m</strong>
                </div>

                <div className="result-row">
                  <span>Rear Brake Torque</span>
                  <strong>{(result.rear_brake_torque/1000)?.toFixed(2)} N·m</strong>
                </div>

                <div className="result-row">
                  <span>Front Bias</span>
                  <strong>{result.front_bias?.toFixed(2)} %</strong>
                </div>

                <div className="result-row">
                  <span>Rear Bias</span>
                  <strong>{result.rear_bias?.toFixed(2)} %</strong>
                </div>

              </div>

              {/* Vehicle Dynamics */}
              <div>

                <div className="result-row">
                  <span>Deceleration</span>
                  <strong>{result.deceleration_g?.toFixed(2)} g</strong>
                </div>

                <div className="result-row">
                  <span>Weight Transfer</span>
                  <strong>{result.weight_transfer?.toFixed(2)} N</strong>
                </div>

                <div className="result-row">
                  <span>Dynamic Front Load</span>
                  <strong>{result.dynamic_front_load?.toFixed(2)} N</strong>
                </div>

                <div className="result-row">
                  <span>Dynamic Rear Load</span>
                  <strong>{result.dynamic_rear_load?.toFixed(2)} N</strong>
                </div>

                <div className="result-row">
                  <span>Rear Lift</span>
                  <strong>{result.rear_lift}</strong>
                </div>

                <div className="result-row">
                  <span>Ideal Front Bias</span>
                  <strong>{result.ideal_front_bias?.toFixed(2)} %</strong>
                </div>

                <div className="result-row">
                  <span>Bias Error</span>
                  <strong>{result.bias_error?.toFixed(2)} %</strong>
                </div>

                <div className="result-row">
                  <span>Recommendation</span>
                  <strong>{result.recommendation}</strong>
                </div>

                <div className="result-row">
                  <span>Recommended Balance Bar</span>
                  <strong>{result.rec_front_balance?.toFixed(2)} %</strong>
                </div>

                <div className="result-row">
                  <span>Front Lock-Up Risk</span>
                  <strong className={result.front_lockup === "YES"?"warning-text":""}>
                    {result.front_lockup}
                  </strong>
                </div>

                <div className="result-row">
                  <span>Rear Lock-Up Risk</span>
                  <strong className={result.rear_lockup === "YES"?"warning-text":""}>
                    {result.rear_lockup}
                  </strong>
                </div>

              </div>

              {/* Tire Analysis */}
              <div>

                <div className="result-row">
                  <span>Front Available Grip</span>
                  <strong>{result.front_available_grip?.toFixed(2)} N</strong>
                </div>

                <div className="result-row">
                  <span>Rear Available Grip</span>
                  <strong>{result.rear_available_grip?.toFixed(2)} N</strong>
                </div>

                <div className="result-row">
                  <span>Front Required Force</span>
                  <strong>{result.front_required_force?.toFixed(2)} N</strong>
                </div>

                <div className="result-row">
                  <span>Rear Required Force</span>
                  <strong>{result.rear_required_force?.toFixed(2)} N</strong>
                </div>

                <div className="result-row">
                  <span>Front Grip Margin</span>
                  <strong>{result.front_grip_margin?.toFixed(2)} N</strong>
                </div>

                <div className="result-row">
                  <span>Rear Grip Margin</span>
                  <strong>{result.rear_grip_margin?.toFixed(2)} N</strong>
                </div>

                <div className="result-row">
                  <span>Front Tire Utilization</span>
                  <strong>
                    {result.front_utilization?.toFixed(2)} %
                    {" "}
                    ({result.front_warning})
                  </strong>
                </div>

                <div className="result-row">
                  <span>Rear Tire Utilization</span>
                  <strong>
                    {result.rear_utilization?.toFixed(2)} %
                    {" "}
                    ({result.rear_warning})
                  </strong>
                </div>
                

              </div>

            </div>

          </div>
        )}
      </>
    )}

    {activeTab === "charts" && (
      <div className="chart-grid">

        {!result ? (
          <div className="results-box">
            <p>Run a calculation first.</p>
          </div>
        ) : (
          <>
            <div className="chart-panel">

              <h3>Brake Bias Analysis</h3>

              <p>
                Actual Bias: {result.front_bias?.toFixed(2)}%
              </p>

              <p>
                Ideal Bias: {result.ideal_front_bias?.toFixed(2)}%
              </p>

              <div className="bias-bar">

                <div
                  className="bias-marker actual-marker"
                  style={{
                    left: `${Math.max(0,Math.min(result.front_bias, 100))}%`,
                  }}
                />

                <div
                  className="bias-marker ideal-marker"
                  style={{
                    left: `${Math.min(result.ideal_front_bias, 98.5)}%`,
                  }}
                />

              </div>

              <div className="bias-legend">
                <span className="legend-actual">■ Actual</span>
                <span className="legend-ideal">■ Ideal</span>
              </div>

            </div>

            <div className="chart-panel">

              <h3>Tire Utilization</h3>

              <p>
                Front Tire: {result.front_utilization?.toFixed(1)}%
              </p>

              <div className="util-bar">
                <div
                  className={
                    result.front_utilization > 100
                      ? "util-fill util-critical"
                      : result.front_utilization > 95
                      ? "util-fill util-warning"
                      : "util-fill util-normal"
                  }
                  style={{
                    width: `${Math.min(result.front_utilization, 100)}%`,
                  }}
                />
              </div>

              <p>
                Rear Tire: {result.rear_utilization?.toFixed(1)}%
              </p>

              <div className="util-bar">
                <div
                  className={
                    result.rear_utilization > 100
                      ? "util-fill util-critical"
                      : result.rear_utilization > 95
                      ? "util-fill util-warning"
                      : "util-fill util-normal"
                  }
                  style={{
                    width: `${Math.min(result.rear_utilization, 100)}%`,
                  }}
                />
              </div>

              <div className="util-legend">
                <span className="legend-normal">■ Safe (&lt;95%)</span>
                <span className="legend-warning">■ High (95–100%)</span>
                <span className="legend-critical">■ Lock-Up Risk (&gt;100%)</span>
              </div>

            </div>

            <div className="chart-panel">
              <h3>Brake Bias Sensitivity</h3>
              
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={result.bias_sensitivity}
                  margin={{top:20, right:30, left:20, bottom:20}}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="balance"
                    type="number"
                    domain={[40, 80]}
                    label={{value: "Brake Balance (%)", position: "insideBottom", offset: -10, fill: "black"}}
                  />

                  <YAxis
                    label={{value: "Bias Error (%)", angle: -90, position: "insideLeft", fill: "black"}}
                  />

                  <Tooltip />
                  
                  <ReferenceLine
                    x={result.rec_front_balance}
                    stroke="green"
                    strokeWidth={3}
                    label={{value: "Recommended", position: "top", fill: "green"}}
                  />

                  <ReferenceLine
                    x={65}
                    stroke="red"
                    strokeWidth={3}
                    label={{value: "Current", position: "insideBottom", fill: "red"}}
                  />

                  <Line
                    type="monotone"
                    dataKey="error"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
                </>
        )}
      </div>
    )}
  </div>
);
}
export default App;