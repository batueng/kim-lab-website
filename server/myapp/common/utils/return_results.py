from ultralytics import YOLO
from PIL import Image
from common.utils.calculations import *
from common.utils.check_match import *
from common.utils.get_matches import *

# Load the models
inner_model = YOLO('common/utils/models/inner.pt')
outer_model = YOLO('common/utils/models/outer.pt')

def check_valid(shape):
    for x, y in shape:
        if x == 0 or x == 640 or y == 0 or y == 640:
            return False
    return True

def tiff_to_jpg(input_path, output_path):
    try:
        # Open the TIFF file
        with Image.open(input_path) as img:
            # Crop the below to not mess with the scale
            box = (0, 0, 2496, 2496)
            cropped_img = img.crop(box)
            # Resize to 640x640
            resized_img = cropped_img.resize((640,640))
            # Convert and save as JPEG
            resized_img.convert("RGB").save(output_path, "JPEG")
    except Exception as e:
        print(f"Error: {e}")

def return_results(filename, scale_value):
    sole_filename = filename.split("/")[-1]
    new_filename = f'common/tmp/processed/{sole_filename}.jpg'
    tiff_to_jpg(filename, new_filename)
    inner_result = inner_model(new_filename, verbose=False)
    outer_result = outer_model(new_filename, verbose=False)
    
    inner_masks = inner_result[0].masks
    outer_masks = outer_result[0].masks
    outer_boxes = outer_result[0].boxes
    inner_shapes = []
    outer_shapes = []
    test = []

    for mask in inner_masks:
        if check_valid(mask.xy[0]):
            inner_shapes.append(mask.xy[0])

    for i, mask in enumerate(outer_masks):
        if check_valid(mask.xy[0]):
            test.append((outer_boxes[i].xyxy[0], mask.xy[0]))
            outer_shapes.append(mask.xy[0])
    matches = []
    for outer_box, outer_shape in test:
        for inner_shape in inner_shapes:
            if is_shape_in_box(inner_shape, outer_box, 0):
                matches.append((inner_shape, outer_shape))
    """for outer in outer_shapes:
        for inner in inner_shapes:
            if check_match(inner, outer):
                matches.append((inner, outer))
                break"""
    results = []
    value_per_pixel = scale_value / 60
    i = 0
    for inner, outer in matches:
        inner_area = calculate_area(inner)
        outer_area= calculate_area(outer)
        inner_diameter = 2 * np.sqrt(inner_area/np.pi) * value_per_pixel
        outer_diameter = 2 * np.sqrt(outer_area/np.pi) * value_per_pixel
        ratio = outer_diameter / inner_diameter
        results.append({
            "id": i,
            "ratio": round(ratio, 2),
            "inner": inner.tolist(),
            "outer": outer.tolist(),
            "inner_diameter": round(inner_diameter, 2),
            "outer_diameter": round(outer_diameter, 2)
        })
        i += 1
    return new_filename, results
    """except Exception as e:
        print(f"error at {filename}", e)"""