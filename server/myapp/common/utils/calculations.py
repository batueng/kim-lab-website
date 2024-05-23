import numpy as np
from scipy.optimize import curve_fit


def calculate_distance(point1, point2):
    """Calculate Euclidean distance between two points."""
    return np.linalg.norm(point2 - point1)

def calculate_perimeter(coordinates):
    """Calculate the perimeter of a shape defined by coordinates."""

    # Convert the list of tuples to a NumPy array
    coordinates = np.array(coordinates)

    # Calculate the perimeter
    perimeter = 0.0
    num_points = len(coordinates)
    for i in range(num_points - 1):
        perimeter += calculate_distance(coordinates[i], coordinates[i+1])
    perimeter += calculate_distance(coordinates[-1], coordinates[0])  # Closing the shape
    return perimeter


def ellipse_equation(xy, h, k, a, b, theta):
    """Equation for ellipses"""
    x, y = xy
    cos_theta = np.cos(theta)
    sin_theta = np.sin(theta)
    x_prime = (x - h) * cos_theta + (y - k) * sin_theta
    y_prime = (x - h) * sin_theta - (y - k) * cos_theta
    return (x_prime**2 / a**2) + (y_prime**2 / b**2) - 1

def calculate_axes(coordinates, value_per_pixel):
    """Calculate the semi major and minor axes of ellipses"""
    xy_data = np.array(coordinates).T  # Transpose the coordinates
    # Extract x and y data
    x_data = xy_data[0]
    y_data = xy_data[1]

    # Estimate initial guesses for parameters
    h, k = np.mean(x_data), np.mean(y_data)  # Estimate center
    a = np.std(x_data)  # Estimate semi-major axis length
    b = np.std(y_data)  # Estimate semi-minor axis length
    theta = 0  # Initial guess for rotation angle (might need adjustment)

    # Initial guess for parameters (h, k, a, b, theta)
    initial_guess = (h, k, a, b, theta)

    # Perform curve fitting
    popt = curve_fit(ellipse_equation, (x_data, y_data), np.zeros_like(x_data), p0=initial_guess, maxfev=100000)[0]

    # Extract parameters
    a, b = popt[2], popt[3]

    return round(max(a, b) * value_per_pixel, 2), round(min(a, b) * value_per_pixel, 2)