def point_in_polygon(x, y, polygon, threshold):
    n = len(polygon)  # Number of vertices in the polygon
    inside = False  # Flag to track if the point is inside the polygon

    # Iterate through each edge of the polygon
    p1x, p1y = polygon[0]  # Start from the first vertex
    for i in range(n + 1):  # Loop over each edge (including the closing edge)
        p2x, p2y = polygon[i % n]  # End point of the current edge

        # Check if the point lies within the y-range of the edge
        if y > min(p1y, p2y) and y <= max(p1y, p2y):
            # Check if the point's x-coordinate is to the left of the edge
            if x <= max(p1x, p2x):
                # Check if the point lies to the left of the edge's intersection with a horizontal line through the point
                if p1y != p2y:
                    xinters = (y - p1y) * (p2x - p1x) / (p2y - p1y) + p1x
                # If the point lies on the edge or to the left of the intersection, toggle inside flag
                if p1x == p2x or x <= xinters:
                    inside = not inside  # Toggle the inside flag

        # Move to the next edge
        p1x, p1y = p2x, p2y

    if inside:
        return True  # If the point is inside the polygon, return True
    
    """# Check if the distance to any edge is within the threshold
    for i in range(n):
        p1x, p1y = polygon[i]
        p2x, p2y = polygon[(i + 1) % n]
        distance_to_edge = abs((p2y - p1y) * x - (p2x - p1x) * y + p2x * p1y - p2y * p1x) / ((p2y - p1y)**2 + (p2x - p1x)**2)**0.5
        if distance_to_edge <= threshold:
            return True  # If the point is within the threshold distance of any edge, return True"""

    return False  # Otherwise, return False

def check_match(inside, outside):
    for point in inside:
        x, y = point
        if not point_in_polygon(x, y, outside, 1):
            return False
    return True
