from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from brake_model import brake_analysis

from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BrakeInputs(BaseModel):
    pedal_force: float
    pedal_ratio: float

    front_mc_diameter: float
    rear_mc_diameter: float

    front_piston_count: int
    rear_piston_count: int

    front_caliper_diameter: float
    rear_caliper_diameter: float

    front_rotor_radius: float
    rear_rotor_radius: float

    front_balance_percent: float

    vehicle_mass: float

    front_tire_radius: float
    rear_tire_radius: float

    front_pad_mu: float
    rear_pad_mu: float

    wheelbase: float
    cg_height: float

    tire_mu: float

    front_static_weight_percent: float

class BrakeResults(BaseModel):
    pushrod_force: float

    front_pressure: float
    rear_pressure: float

    front_clamp_force: float
    rear_clamp_force: float

    front_brake_torque: float
    rear_brake_torque: float

    front_bias: float
    rear_bias: float

    deceleration_g: float

    weight_transfer: float

    ideal_front_bias: float
    bias_error: float

    recommendation: str

    front_utilization: float
    rear_utilization: float

    front_warning: str
    rear_warning: str

    front_lockup: str
    rear_lockup: str

    dynamic_front_load: float
    dynamic_rear_load: float

    front_available_grip: float
    rear_available_grip: float

    front_required_force: float
    rear_required_force: float
    
@app.get("/")
def home():
    return {"message": "Brake Analysis API Running"}

@app.post("/calculate", response_model=BrakeResults)
def calculate(data: BrakeInputs):
    return brake_analysis(data.model_dump())