def is_point_in_box(point, box):
    """
    Check if a point is inside a given box.
    
    :param point: A tuple (x, y)
    :param box: A tuple (left, top, right, bottom)
    :return: True if the point is inside the box, otherwise False
    """
    x, y = point
    left, top, right, bottom = box
    return left <= x <= right and top <= y <= bottom

def is_shape_in_box(shape, box):
    """
    Check if all points of a shape are inside a given box.
    
    :param shape: A list of tuples [(x1, y1), (x2, y2), ...]
    :param box: A tuple (left, top, right, bottom)
    :return: True if all points are inside the box, otherwise False
    """
    return all(is_point_in_box(point, box) for point in shape)

