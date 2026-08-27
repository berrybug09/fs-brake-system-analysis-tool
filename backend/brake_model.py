import math
G = 9.81


#Main Functions
def circle_area(diameter):
    return (math.pi * (diameter/2)**2)

def line_pressure(force, area):
    return (force/area)

def clamp_force(pressure, piston_area):
    return (pressure * piston_area)

def brake_torque(clamp_force, rotor_radius, mu):
    return (clamp_force * rotor_radius * mu)

def wheel_force(brake_torque, tire_radius):
    return (brake_torque/tire_radius)

def vehicle_deceleration(force, mass):
    return (force/mass)

def weight_transfer(mass, deceleration, cg_height, wheelbase):
    return ((mass * deceleration * cg_height)/wheelbase)


def utilization_warning(utilization):
        if utilization > 100:
            return "LOCKUP"
        elif utilization > 95:
            return "HIGH"
        elif utilization > 85:
            return "MODERATE"
        else:
            return "LOW"
        
def rear_lift_status(dynamic_rear_load):
    if dynamic_rear_load <= 0:
        return "LIFT OFF"
    elif dynamic_rear_load < 100:
        return "CRITICAL"
    elif dynamic_rear_load < 250:
        return "WARNING"
    else:
        return "NORMAL"
    
def bias_sensitivity_analysis(data):
    results = []
    for balance in range(40, 91, 5):
        temp_data = data.copy()
        temp_data["front_balance_percent"] = balance
        hydraulic = hydraulic_analysis(temp_data)
        front_torque = hydraulic["front_brake_torque"]
        rear_torque = hydraulic["rear_brake_torque"]
        actual_bias = (front_torque/(front_torque + rear_torque)) * 100
        dynamics = vehicle_dynamics_analysis(temp_data, front_torque, rear_torque)
        ideal_bias = (dynamics["dynamic_front_load"]/(dynamics["dynamic_front_load"] + dynamics["dynamic_rear_load"])) * 100
        results.append({"balance": balance, "error": actual_bias - ideal_bias})
    return results

def rec_balance(bias_sensitivity):
    for i in range(len(bias_sensitivity) - 1):
        e1 = bias_sensitivity[i]["error"]
        e2 = bias_sensitivity[i + 1]["error"]
        if e1 * e2 <= 0:  # crosses zero
            b1 = bias_sensitivity[i]["balance"]
            b2 = bias_sensitivity[i + 1]["balance"]
            recommended = b1 + (0 - e1) * (b2 - b1) / (e2 - e1)
            return recommended
    return None


#Calculations
def brake_bias_recommendation(front_bias, ideal_front_bias):
    bias_error = front_bias - ideal_front_bias
    if bias_error < -3:
        recommendation = "Increase Front Brake Bias"
    elif bias_error > 3:
        recommendation = "Reduce Front Brake Bias"
    else:
        recommendation = "Bias Near Optimal"
    return bias_error, recommendation



def hydraulic_analysis(data):

    front_mc_area = circle_area(data["front_mc_diameter"])
    rear_mc_area = circle_area(data["rear_mc_diameter"])

    front_caliper_area = (data["front_piston_count"] * circle_area(data["front_caliper_diameter"]))
    rear_caliper_area = (data["rear_piston_count"] * circle_area(data["rear_caliper_diameter"]))

    pushrod_force = (data["pedal_force"] * data["pedal_ratio"])

    front_force = (pushrod_force * data["front_balance_percent"] / 100)
    rear_force = pushrod_force - front_force

    front_pressure = line_pressure(front_force, front_mc_area)
    rear_pressure = line_pressure(rear_force, rear_mc_area)

    front_clamp = clamp_force(front_pressure, front_caliper_area)
    rear_clamp = clamp_force(rear_pressure, rear_caliper_area)

    front_torque = brake_torque(front_clamp, data["front_rotor_radius"], data["front_pad_mu"])
    rear_torque = brake_torque(rear_clamp, data["rear_rotor_radius"], data["rear_pad_mu"])

    return {
        "pushrod_force": pushrod_force,

        "front_pressure": front_pressure,
        "rear_pressure": rear_pressure,

        "front_clamp_force": front_clamp,
        "rear_clamp_force": rear_clamp,

        "front_brake_torque": front_torque,
        "rear_brake_torque": rear_torque,
    }

def vehicle_dynamics_analysis(data, front_torque, rear_torque):

    front_wheel_force = wheel_force(front_torque, data["front_tire_radius"])
    rear_wheel_force = wheel_force(rear_torque, data["rear_tire_radius"])

    total_brake_force = (2 * front_wheel_force + 2 * rear_wheel_force)

    deceleration = vehicle_deceleration(total_brake_force, data["vehicle_mass"])

    deceleration_g = deceleration/G

    dynamic_transfer = weight_transfer(data["vehicle_mass"], deceleration, data["cg_height"], data["wheelbase"])

    vehicle_weight = data["vehicle_mass"] * G

    front_static_load = (vehicle_weight * data["front_static_weight_percent"]/100)
    rear_static_load = (vehicle_weight - front_static_load)

    dynamic_front_load = (front_static_load + dynamic_transfer)
    dynamic_rear_load = (rear_static_load - dynamic_transfer)

    rear_lift = rear_lift_status(dynamic_rear_load)

    return {
        "front_wheel_force": front_wheel_force,
        "rear_wheel_force": rear_wheel_force,
        "deceleration_g": deceleration_g,
        "weight_transfer": dynamic_transfer,
        "dynamic_front_load": dynamic_front_load,
        "dynamic_rear_load": dynamic_rear_load,
        "rear_lift": rear_lift,
    }

def tire_analysis(data, front_wheel_force, rear_wheel_force, dynamic_front_load, dynamic_rear_load):

    front_available_grip = (data["tire_mu"] * dynamic_front_load)
    rear_available_grip = (data["tire_mu"] * dynamic_rear_load)

    front_required_force = (2 * front_wheel_force)
    rear_required_force = (2 * rear_wheel_force)

    front_grip_margin = (front_available_grip - front_required_force)
    rear_grip_margin = (rear_available_grip - rear_required_force)

    if front_available_grip <= 0:
        front_utilization = 999
    else:
        front_utilization = (front_required_force/front_available_grip * 100)
    if rear_available_grip <= 0:
        rear_utilization = 999
    else:
        rear_utilization = (rear_required_force/rear_available_grip * 100)

    front_warning = utilization_warning(front_utilization)
    rear_warning = utilization_warning(rear_utilization)

    return {
        "front_available_grip": front_available_grip,
        "rear_available_grip": rear_available_grip,

        "front_required_force": front_required_force,
        "rear_required_force": rear_required_force,

        "front_grip_margin": front_grip_margin,
        "rear_grip_margin": rear_grip_margin,

        "front_utilization": front_utilization,
        "rear_utilization": rear_utilization,

        "front_warning": front_warning,
        "rear_warning": rear_warning,

        "front_lockup":
            "YES"
            if front_required_force > front_available_grip
            else "NO",

        "rear_lockup":
            "YES"
            if rear_required_force > rear_available_grip
            else "NO",
    }

def brake_analysis(data):
    hydraulic = hydraulic_analysis(data)
    pushrod_force = hydraulic["pushrod_force"]
    front_pressure = hydraulic["front_pressure"]
    rear_pressure = hydraulic["rear_pressure"]
    front_clamp = hydraulic["front_clamp_force"]
    rear_clamp = hydraulic["rear_clamp_force"]
    front_torque = hydraulic["front_brake_torque"]
    rear_torque = hydraulic["rear_brake_torque"]
    total_torque = front_torque + rear_torque
    front_bias = (front_torque / total_torque * 100)
    rear_bias = 100 - front_bias

    dynamics = vehicle_dynamics_analysis(data, front_torque, rear_torque)
    front_wheel_force = dynamics["front_wheel_force"]
    rear_wheel_force = dynamics["rear_wheel_force"]
    deceleration_g = dynamics["deceleration_g"]
    dynamic_transfer = dynamics["weight_transfer"]
    dynamic_front_load = dynamics["dynamic_front_load"]
    dynamic_rear_load = dynamics["dynamic_rear_load"]
    rear_lift = dynamics["rear_lift"]
    if dynamic_rear_load <= 0:
        ideal_front_bias = 100
    else:
        ideal_front_bias = (dynamic_front_load/(dynamic_front_load + dynamic_rear_load) * 100)
    bias_error, recommendation = brake_bias_recommendation(front_bias, ideal_front_bias)


    tire = tire_analysis(data, front_wheel_force, rear_wheel_force, dynamic_front_load, dynamic_rear_load)
    front_available_grip = tire["front_available_grip"]
    rear_available_grip = tire["rear_available_grip"]
    front_required_force = tire["front_required_force"]
    rear_required_force = tire["rear_required_force"]
    front_grip_margin = tire["front_grip_margin"]
    rear_grip_margin = tire["rear_grip_margin"]
    front_utilization = tire["front_utilization"]
    rear_utilization = tire["rear_utilization"]
    front_warning = tire["front_warning"]
    rear_warning = tire["rear_warning"]
    front_lockup = tire["front_lockup"]
    rear_lockup = tire["rear_lockup"]

    bias_sensitivity = bias_sensitivity_analysis(data)
    rec_front_balance = rec_balance(bias_sensitivity)

    return {
        "pushrod_force": pushrod_force,

        "front_pressure": front_pressure,
        "rear_pressure": rear_pressure,

        "front_clamp_force": front_clamp,
        "rear_clamp_force": rear_clamp,

        "front_brake_torque": front_torque,
        "rear_brake_torque": rear_torque,

        "front_bias": front_bias,
        "rear_bias": rear_bias,

        "deceleration_g": deceleration_g,

        "weight_transfer": dynamic_transfer,

        "ideal_front_bias": ideal_front_bias,
        "bias_error": bias_error,

        "recommendation": recommendation,

        "front_utilization": front_utilization,
        "rear_utilization": rear_utilization,

        "front_grip_margin": front_grip_margin,
        "rear_grip_margin": rear_grip_margin,

        "front_warning": front_warning,
        "rear_warning": rear_warning,

        "front_lockup": front_lockup,
        "rear_lockup": rear_lockup,

        "dynamic_front_load": dynamic_front_load,
        "dynamic_rear_load": dynamic_rear_load,

        "rear_lift": rear_lift,

        "front_available_grip": front_available_grip,
        "rear_available_grip": rear_available_grip,

        "front_required_force": front_required_force,
        "rear_required_force": rear_required_force,

        "bias_sensitivity": bias_sensitivity,
        "rec_front_balance": rec_front_balance,
    }