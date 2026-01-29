# OPD Token Allocation System

A backend service that manages OPD (Outpatient Department) tokens for doctors by allocating patients into fixed time slots while handling real-world constraints such as priority patients, emergencies, cancellations, waiting lists, and doctor delays.

This project simulates how a hospital OPD system works behind the scenes.

---

## Features

- Fixed doctor time slots with capacity limits
- Priority-based token allocation
- Emergency patient override
- Automatic waiting list management
- Token reallocation on cancellation
- Doctor delay handling with token shifting
- Schedule visualization API for debugging and demo

---

## Priority Rules

Patients are handled based on the following priority order  
(lower number = higher priority):

1. Emergency  
2. Paid Priority  
3. Follow-up  
4. Online Booking  
5. Walk-in  

Higher-priority patients can displace lower-priority patients when a slot is full.

---

## Architecture Overview

```text
Client (Postman)
     |
     v
Routes  →  Controllers  →  Services  →  In-memory Store
                         (Business Logic)
