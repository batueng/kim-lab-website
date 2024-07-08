import numpy as np
from scipy.optimize import curve_fit
from scipy.spatial import ConvexHull

def calculate_area(coordinates):
    """Calculate the diameter"""
    x = []
    y = []
    for coord in coordinates:
        x.append(coord[0])
        y.append(coord[1])
    area = 0.5*np.abs(np.dot(x, np.roll(y, 1)) - np.dot(y, np.roll(x, 1)))
    return area