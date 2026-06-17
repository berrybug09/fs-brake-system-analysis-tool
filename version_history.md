# Brake System Analysis Tool - Changelog

All notable changes to this project will be documented in this file.

---

## Version 2.1.0 - User Interface and Visualization Update

Date: 16 June 2026

### Overview

Much more updated and debugged user interface update introducing 'tabs' to separate engineering calculations from graphs/charts. The software interface has been redesigned for improved usability, clearer presentation of results(earlier the readability was poor), and a more professional engineering software appearance while retaining all analytical capabilities introduced in Version 2.0.0.

### Features Added

* Dedicated Analysis tab
* Dedicated Charts tab
* Brake Bias Analysis visualization
* Tire Utilization visualization
* Interactive tab navigation
* Engineering-style desktop software interface
* Improved results presentation
* Improved chart layout
* Visual brake bias comparison indicators
* Visual tire utilization indicators

### Inputs Added

None

### Outputs Added

* Brake Bias Analysis chart
* Tire Utilization chart
* Visual Actual vs Ideal Bias comparison
* Tire utilization severity visualization

### Improvements

* Improved user experience
* Improved information organization
* Improved readability of engineering results
* Improved chart accessibility
* Better separation between calculations and visualizations
* More professional engineering software appearance
* Improved navigation workflow
* Improved results interpretation

### Features Retained

* Tire utilization analysis
* Front and rear tire utilization severity indicators
* Ideal brake bias calculations
* Brake bias error calculations
* Automated brake setup recommendations
* Front and rear lock-up prediction
* Dynamic weight transfer calculations
* Hydraulic pressure calculations
* Clamp force calculations
* Brake torque calculations
* Brake bias calculations
* React frontend architecture
* FastAPI backend architecture
* REST API communication

### Remaining Limitations

* No aerodynamic effects
* No speed-dependent vehicle dynamics
* No thermal analysis
* Limited graphical visualizations
* No rear wheel lift detection
* No brake efficiency calculations
* Assumes equal piston diameters within each caliper

---

## Planned Version 2.5.0

### Target Features

* Aerodynamic downforce integration
* Speed-dependent load transfer
* Advanced vehicle dynamics modeling
* Dynamic brake bias recommendations

---

## Planned Version 3.0.0

### Target Features

* Brake thermal analysis
* Rotor temperature estimation
* Brake fade risk prediction

---

## Planned Version 4.0.0

### Target Features

* Interactive graphs
* Tire utilization plots
* Brake bias plots
* Pedal force vs deceleration graphs
* Design optimization dashboard

---

## Older Updates

### V1.0.0
Date: 04 June 2026
First functional version of the Brake System Analysis Tool developed for Formula Student brake system calculations.

### V1.1.0
Date: 05 June 2026
Major update introducing multi-piston caliper support, enhanced brake system modeling, improved GUI organization, and tire lock-up prediction capabilities.

### V1.2.0
Date: 06 June 2026
Introduced brake bias optimization capabilities, tire utilization analysis, and automated setup recommendations to improve Formula Student brake system tuning and validation.

### V2.0.0
Complete architecture overhaul from python only tkinter to React+FastAPI based web application. 

