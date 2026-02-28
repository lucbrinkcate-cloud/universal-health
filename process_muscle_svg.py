#!/usr/bin/env python3
"""
SVG Muscle Anatomy Processor
Automatically splits the monolithic muscle SVG into categorized groups
for hover highlighting functionality.
"""

import re
import xml.etree.ElementTree as ET
from pathlib import Path

# Define muscle categories based on coordinate ranges
# These ranges are approximate for the given viewBox (0,0 to 484.5,1175)
MUSCLE_CATEGORIES = [
    # Upper body
    ("head_neck", "Head & Neck", 0, 180, 150, 400),
    ("trapezius", "Trapezius", 120, 280, 100, 400),
    ("deltoids", "Deltoids", 180, 350, 280, 450),
    ("pectorals", "Pectorals", 220, 400, 280, 420),
    ("biceps", "Biceps", 320, 420, 280, 380),
    ("triceps", "Triceps", 320, 420, 400, 480),
    ("forearms", "Forearms", 420, 520, 300, 450),

    # Torso
    ("abs", "Abdominals", 450, 600, 220, 350),
    ("obliques", "Obliques", 480, 620, 150, 220),
    ("obliques_right", "Obliques (R)", 480, 620, 350, 450),
    ("serratus", "Serratus", 320, 420, 200, 280),

    # Back
    ("lats", "Latissimus Dorsi", 300, 550, 80, 150),
    ("lats_right", "Latissimus Dorsi (R)", 300, 550, 400, 480),

    # Lower body
    ("glutes", "Glutes", 680, 800, 200, 350),
    ("glutes_right", "Glutes (R)", 680, 800, 350, 450),
    ("quadriceps", "Quadriceps", 750, 900, 220, 350),
    ("quadriceps_right", "Quadriceps (R)", 750, 900, 350, 450),
    ("hamstrings", "Hamstrings", 750, 900, 150, 220),
    ("hamstrings_right", "Hamstrings (R)", 750, 900, 400, 480),
    ("calves", "Calves", 900, 1050, 220, 350),
    ("calves_right", "Calves (R)", 900, 1050, 350, 450),
]

def parse_path_data(path_str):
    """Parse path data and extract individual subpaths."""
    # Split on M or m commands to get individual subpaths
    # Keep the M command with each subpath
    pattern = r'([Mm][^M]*)'
    subpaths = re.findall(pattern, path_str)
    return [sp.strip() for sp in subpaths if sp.strip()]

def get_subpath_bounds(subpath):
    """Get bounding box (min_x, max_x, min_y, max_y) of a subpath."""
    # Extract all coordinates from the path
    coords = re.findall(r'(-?\d+\.?\d*)', subpath)
    if len(coords) < 2:
        return None

    # Every pair is a coordinate (x, y)
    xs = [float(coords[i]) for i in range(0, len(coords), 2) if i+1 < len(coords)]
    ys = [float(coords[i+1]) for i in range(0, len(coords), 2) if i+1 < len(coords)]

    if not xs or not ys:
        return None

    return min(xs), max(xs), min(ys), max(ys)

def categorize_subpath(bounds):
    """Assign muscle category based on bounding box position."""
    if bounds is None:
        return None, None

    min_x, max_x, min_y, max_y = bounds
    center_x = (min_x + max_x) / 2
    center_y = (min_y + max_y) / 2

    for cat_id, cat_name, y_min, y_max, x_min, x_max in MUSCLE_CATEGORIES:
        if y_min <= center_y <= y_max and x_min <= center_x <= x_max:
            return cat_id, cat_name

    return None, None

def create_colored_path(subpath, muscle_id, muscle_name):
    """Create a colored path element with hover info."""
    # Use distinct colors for left/right sides
    if "_right" in muscle_id:
        fill_color = "#FF6B6B"  # Reddish for right side
    elif muscle_id in ["head_neck", "trapezius"]:
        fill_color = "#4ECDC4"  # Teal
    elif "deltoids" in muscle_id or "biceps" in muscle_id or "triceps" in muscle_id:
        fill_color = "#FFD93D"  # Yellow
    elif "pectorals" in muscle_id or "abs" in muscle_id:
        fill_color = "#6BCB77"  # Green
    elif "lats" in muscle_id or "obliques" in muscle_id:
        fill_color = "#FF8E8E"  # Pinkish
    elif "glutes" in muscle_id or "quadriceps" in muscle_id:
        fill_color = "#9B59B6"  # Purple
    elif "hamstrings" in muscle_id or "calves" in muscle_id:
        fill_color = "#3498DB"  # Blue
    else:
        fill_color = "#95A5A6"  # Gray default

    # Create group with path and title for tooltip
    group = f'  <g class="muscle-group" id="{muscle_id}" data-name="{muscle_name}">\n'
    group += f'    <path d="{subpath}" fill="{fill_color}" stroke="#000" stroke-width="0.3" opacity="0.8" class="muscle"/>\n'
    group += f'    <title>{muscle_name}</title>\n'
    group += '  </g>\n'
    return group

def process_svg(input_file, output_file):
    """Main processing function."""
    print(f"Reading {input_file}...")
    with open(input_file, 'r', encoding='utf-8') as f:
        svg_content = f.read()

    path_d = extract_path_data(svg_content)
    if not path_d:
        return

    print(f"Found path with {len(path_d)} characters")

    # Split into subpaths
    subpaths = parse_path_data(path_d)
    subpaths = parse_path_data(path_d)
    print(f"Split into {len(subpaths)} subpaths")

    # Process each subpath
    categorized = {}
    uncategorized = []
    total_categorized = 0

    for i, subpath in enumerate(subpaths):
        bounds = get_subpath_bounds(subpath)
        cat_id, cat_name = categorize_subpath(bounds)

        if cat_id:
            if cat_id not in categorized:
                categorized[cat_id] = (cat_name, [])
            categorized[cat_id][1].append(subpath)
            total_categorized += 1
        else:
            uncategorized.append(subpath)

    print(f"Categorized {total_categorized} subpaths into {len(categorized)} muscle groups")
    print(f"Remaining uncategorized: {len(uncategorized)}")

    # Build new SVG
    svg_header = f'''<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     width="484.53165mm"
     height="1175mm"
     viewBox="0 0 484.53165 1175"
     version="1.1"
     id="interactive-muscle-anatomy">
  <title>Interactive Muscle Anatomy</title>
  <desc>Hover over muscle groups to see their names. Click to highlight.</desc>

  <style>
    .muscle {{
      transition: all 0.2s ease;
      cursor: pointer;
    }}
    .muscle:hover {{
      opacity: 1 !important;
      filter: drop-shadow(0 0 5px rgba(255,255,255,0.8));
    }}
    .muscle-group {{
      opacity: 0.6;
    }}
    .tooltip {{
      position: absolute;
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 5px 10px;
      border-radius: 3px;
      font-family: Arial, sans-serif;
      font-size: 14px;
      pointer-events: none;
      display: none;
    }}
  </style>

  <script type="text/ecmascript"><![CDATA[
    var tooltip = null;
    function showTooltip(evt, name) {{
      if (!tooltip) {{
        tooltip = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        tooltip.setAttribute("class", "tooltip");
        document.documentElement.appendChild(tooltip);
      }}
      tooltip.innerHTML = '<div style="background:rgba(0,0,0,0.9);color:white;padding:5px 10px;border-radius:3px;">' + name + '</div>';
      tooltip.setAttribute("x", evt.clientX + 10);
      tooltip.setAttribute("y", evt.clientY + 10);
      tooltip.setAttribute("width", "auto");
      tooltip.setAttribute("height", "auto");
      tooltip.style.display = "block";
    }}
    function hideTooltip() {{
      if (tooltip) tooltip.style.display = "none";
    }}
  ]]></script>

  <g transform="translate(196.71685,444.16454)">
'''

    # Add categorized groups
    for cat_id, (cat_name, subpath_list) in sorted(categorized.items()):
        svg_header += f'    <!-- {cat_name} -->\n'
        for subpath in subpath_list:
            svg_header += create_colored_path(subpath, cat_id, cat_name)
        svg_header += '\n'

    # Add uncategorized as a single gray group
    if uncategorized:
        svg_header += '    <!-- Uncategorized -->\n'
        svg_header += '  <g class="muscle-group" id="uncategorized">\n'
        for subpath in uncategorized:
            svg_header += f'    <path d="{subpath}" fill="#BDC3C7" stroke="#000" stroke-width="0.3" opacity="0.5" class="muscle"/>\n'
        svg_header += '  </g>\n'

    svg_footer = '''  </g>
</svg>'''

    # Write output
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(svg_header + svg_footer)

    print(f"\nGenerated interactive SVG: {output_file}")
    print(f"Total muscle groups: {len(categorized)}")
    print(f"\nMuscle groups found:")
    for cat_id, (cat_name, subpaths) in sorted(categorized.items()):
        print(f"  - {cat_name} ({cat_id}): {len(subpaths)} subpaths")

    # Also create HTML wrapper
    html_file = output_file.replace('.svg', '.html')
    create_html_wrapper(output_file, html_file)
    print(f"\nOpen {html_file} in a browser to see the interactive anatomy!")

def create_html_wrapper(svg_file, html_file):
    """Create HTML file to display the interactive SVG."""
    html_content = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Muscle Anatomy</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        body {{
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
        }}
        .container {{
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            padding: 30px;
            max-width: 95vw;
            overflow: auto;
        }}
        h1 {{
            text-align: center;
            color: #333;
            margin-bottom: 10px;
            font-size: 2em;
        }}
        .instructions {{
            text-align: center;
            color: #666;
            margin-bottom: 20px;
            font-size: 1.1em;
        }}
        .svg-container {{
            text-align: center;
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
        }}
        .legend {{
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
            margin-top: 20px;
            padding: 15px;
            background: #f0f0f0;
            border-radius: 8px;
        }}
        .legend-item {{
            display: flex;
            align-items: center;
            font-size: 0.9em;
            color: #333;
        }}
        .legend-color {{
            width: 20px;
            height: 20px;
            border-radius: 3px;
            margin-right: 8px;
            border: 1px solid #333;
        }}
        svg {{
            max-width: 100%;
            height: auto;
            border: 1px solid #ddd;
            border-radius: 5px;
            background: white;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>Interactive Muscle Anatomy</h1>
        <p class="instructions">Hover over muscle groups to highlight and see their names</p>

        <div class="svg-container">
            <object type="image/svg+xml" data="{svg_file}" width="600" style="width: 100%; max-width: 600px;"></object>
        </div>

        <div class="legend">
            <div class="legend-item"><div class="legend-color" style="background:#4ECDC4"></div>Head & Neck</div>
            <div class="legend-item"><div class="legend-color" style="background:#FFD93D"></div>Arms</div>
            <div class="legend-item"><div class="legend-color" style="background:#6BCB77"></div>Chest/Upper Body</div>
            <div class="legend-item"><div class="legend-color" style="background:#FF8E8E"></div>Side Torso</div>
            <div class="legend-item"><div class="legend-color" style="background:#9B59B6"></div>Hips/Thighs</div>
            <div class="legend-item"><div class="legend-color" style="background:#3498DB"></div>Legs/Calves</div>
            <div class="legend-item"><div class="legend-color" style="background:#95A5A6"></div>Other</div>
        </div>
    </div>
</body>
</html>'''

    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(html_content)

if __name__ == "__main__":
    input_svg = "C:/Users/lucai/.local/share/opencode/tool-output/tool_c90a59e9c001fo1JCtlUw6F4vN"
    output_svg = "interactive_muscle_anatomy.svg"
    process_svg(input_svg, output_svg)