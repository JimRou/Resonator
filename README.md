

# Resonator
An elastic pendulum with a natural frequency fixed at 1 Hz is subjected to forced oscillation using an eccentric-driven motor. The simulation allows for the adjustment of the excitation frequency $f$ as well as the oscillator's damping coefficient $\lambda$.

## Numerical method used

The displacement $x(t)$ of the elastic pendulum is modeled via the differential equation:

$$
\ddot x+2\lambda\dot x+{\omega_0}^2 x={\omega_0}^2e(t)
$$

where $e(t)$ represents the displacement at the connection to the exciter, $\omega_0$ is the natural angular frequency of the pendulum, and $\lambda$ is a damping coefficient that accounts for friction (assumed to be linear with respect to velocity).

This differential equation is integrated numerically using Euler's method, with a time step of 20 ms.



https://github.com/user-attachments/assets/869b7555-c566-46fd-954f-4f3d7a86f7a3

