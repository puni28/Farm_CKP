# Getting Started Guide - Farm Management System

## Quick Start

### 1. Activate Virtual Environment
```powershell
.\venv\Scripts\Activate.ps1
```

### 2. Run the Application
```powershell
python -m src.main
```

The interactive UI will launch with a pre-loaded farm containing sample trees.

## Using the Application

### Grid Interface

The main window displays a 20×31 grid representing your farm land:

- **Column Labels (A-T)**: Across the top
- **Row Labels (0-30)**: Down the left side
- **Each Cell**: Represents one location on your farm

### Cell Colors

| Color | Meaning |
|-------|---------|
| Light Gray | Empty - no tree planted |
| Light Green | Alive tree - healthy |
| Light Red | Dead tree - needs removal or replanting |
| Gold/Yellow | Selected cell - currently highlighted |

### Basic Operations

#### 1. Select a Cell
Click any cell in the grid to select it. The right panel will update with details.

#### 2. Add a Tree
1. Select an empty cell (light gray)
2. In the "Add Tree" section on the right:
   - Choose a tree type from the dropdown
   - Enter the age (in years)
   - Enter the initial yield amount
3. Click "Add Tree"
4. The cell will now show in green (alive tree)

#### 3. View Tree Details
Select any cell with a tree. The right panel shows:
- Position (coordinate)
- Type
- Age
- Status (Alive/Dead)
- Yield
- Seasonal yield (if tracked)

#### 4. Update Tree Status
1. Select a cell with a tree
2. In the "Update Tree" section:
   - Select "Alive" or "Dead" from the dropdown
3. Click "Update Tree"
4. The cell color will change accordingly

#### 5. Remove a Tree
1. Select a cell with a tree
2. Click "Remove Tree"
3. The cell will become empty (light gray)

#### 6. View Statistics
Click "Show Statistics" at any time to see:
- Total number of trees
- Count of alive vs. dead trees
- Total yield across the farm
- Average age of trees
- Yield broken down by tree type
- Empty cell count

## Coordinate System

Coordinates are labeled as **Letter + Number**:

- **Letters (A-T)**: Represent columns (A through T)
  - A0, B0, C0, ... T0 (all 20 columns in row 0)

- **Numbers (0-30)**: Represent rows from top to bottom

### Examples
- **A0**: Top-left corner
- **T30**: Bottom-right corner (column T, row 30)
- **J15**: Middle area
- **A30**: Column A, bottom row

## Advanced Usage

### Command Line Demo

Run the demonstration script to see all features:
```powershell
python demo.py
```

This will:
- Add multiple trees
- Show query operations
- Display statistics
- Save farm data to JSON
- Export a statistics report

### Working with Files

#### Save Farm Data
The system automatically saves to `farm_data.json` when you use the demo.

#### Export Statistics
A report is exported to `farm_report.txt`:
```powershell
python demo.py
```

#### Manual Data Management
Create a Python script to manage data:

```python
from src.farm import Farm
from src.data_store import FarmDataStore

# Create farm
farm = Farm()

# Add trees
farm.add_tree("A0", "Mango", 5, 45.5)

# Save
FarmDataStore.save_to_file(farm, "my_farm.json")

# Later, load it back
FarmDataStore.load_from_file(farm, "my_farm.json")
```

## Common Tasks

### Add Multiple Trees
```python
from src.farm import Farm

farm = Farm()

# List of (coordinate, type, age, yield)
trees = [
    ("A0", "Mango", 5, 45.5),
    ("A1", "Apple", 3, 28.0),
    ("B0", "Teak", 8, 62.3),
]

for coord, tree_type, age, yield_val in trees:
    farm.add_tree(coord, tree_type, age, yield_val)
```

### Query All Trees of a Type
```python
mango_trees = [t for t in farm.get_all_trees() if t.tree_type == "Mango"]
print(f"Mango trees: {len(mango_trees)}")
```

### Calculate Yield by Type
```python
stats = farm.get_statistics()
yield_by_type = stats['yield_by_type']

for tree_type, total_yield in yield_by_type.items():
    print(f"{tree_type}: {total_yield:.2f}")
```

### Find Dead Trees
```python
dead_trees = farm.get_dead_trees()
for tree in dead_trees:
    print(f"Dead tree: {tree.tree_type} at {tree.position}")
```

### Track Tree Age
```python
# Get average age
stats = farm.get_statistics()
avg_age = stats['average_age']
print(f"Average tree age: {avg_age:.1f} years")
```

## Troubleshooting

### Application Won't Launch
**Problem**: "No module named 'src'"
**Solution**: Make sure you're in the Farm_CKP directory:
```powershell
cd c:\Users\prath\Python\Farm_CKP
python -m src.main
```

### Grid Not Displaying Properly
**Problem**: Grid is too large or scrolling issues
**Solution**: The grid includes scrollbars. Use them to navigate.

### Data Not Saving
**Problem**: Can't save farm data
**Solution**: Check file permissions. The farm_data.json file will be created in the current directory.

### Tree Details Not Showing
**Problem**: Selected a cell but details don't update
**Solution**: Make sure to click directly on the grid cell button, not around it.

## Tips & Tricks

1. **Select cells quickly**: Click any cell to update the detail panel immediately
2. **Check empty cells**: Look for gray cells to find planting spots
3. **Organize by type**: Plant trees of the same type together for easier management
4. **Track seasonal data**: Use the Python API to add seasonal yield information
5. **Export regularly**: Use the demo script to export data backups

## File Structure

Generated files:
- `farm_data.json`: Backup of farm state
- `farm_report.txt`: Statistics report

## Next Steps

- Explore different tree types
- Track seasonal yields
- Use the Python API for batch operations
- Export data to share with others
- Extend the system with custom features

For more information, see [README.md](README.md)
