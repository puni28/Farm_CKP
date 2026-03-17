# API Reference - Farm Management System

## Core Classes

### Tree Class (`src.tree`)

Represents a single tree with its attributes and methods.

#### Constructor
```python
Tree(tree_type: str, position: str, age: int = 0, status: TreeStatus = TreeStatus.ALIVE, yield_amount: float = 0.0, seasonal_yield: Optional[Dict[str, float]] = None)
```

#### Attributes
- `tree_type` (str): Type of tree (e.g., "Mango", "Apple")
- `position` (str): Grid coordinate (e.g., "A0", "B12")
- `age` (int): Age in years
- `status` (TreeStatus): ALIVE or DEAD
- `yield_amount` (float): Total yield
- `seasonal_yield` (Dict[str, float]): Yield by season

#### Methods

**update_age(new_age: int) -> None**
- Update tree age (negative values clamped to 0)
- Returns: None

**update_status(new_status: TreeStatus) -> None**
- Update tree health status
- Returns: None

**update_yield(amount: float) -> None**
- Update total yield (negative values clamped to 0.0)
- Returns: None

**add_seasonal_yield(season: str, amount: float) -> None**
- Add or update yield for a season
- Parameters:
  - `season`: Season name (e.g., "Spring", "Summer")
  - `amount`: Yield amount for that season
- Returns: None

**get_seasonal_yield(season: str) -> float**
- Get yield for a specific season
- Parameters:
  - `season`: Season name
- Returns: Yield amount (0.0 if season not found)

**to_dict() -> Dict[str, Any]**
- Convert tree to dictionary representation
- Returns: Dictionary with tree data

**__repr__() -> str**
- String representation
- Returns: Formatted string like "Tree(Mango, A0, Alive, Age: 5)"

---

### Farm Class (`src.farm`)

Manages a grid of trees and provides farm-level operations.

#### Class Constants
- `GRID_ROWS` = 31
- `GRID_COLS` = 20
- Total cells: 620

#### Constructor
```python
Farm()
```
Initializes an empty 31×20 grid.

#### Methods

**add_tree(coord: str, tree_type: str, age: int = 0, yield_amount: float = 0.0) -> bool**
- Add a tree to the grid
- Parameters:
  - `coord`: Grid coordinate (e.g., "A0")
  - `tree_type`: Type of tree
  - `age`: Initial age (default: 0)
  - `yield_amount`: Initial yield (default: 0.0)
- Returns: True if successful, False if cell occupied or invalid

**remove_tree(coord: str) -> bool**
- Remove tree from grid
- Parameters:
  - `coord`: Grid coordinate
- Returns: True if successful, False if cell empty or invalid

**get_tree(coord: str) -> Optional[Tree]**
- Get tree at coordinate
- Parameters:
  - `coord`: Grid coordinate
- Returns: Tree object or None if empty

**update_tree_age(coord: str, new_age: int) -> bool**
- Update tree age
- Parameters:
  - `coord`: Grid coordinate
  - `new_age`: New age value
- Returns: True if successful

**update_tree_status(coord: str, status: TreeStatus) -> bool**
- Update tree status
- Parameters:
  - `coord`: Grid coordinate
  - `status`: TreeStatus.ALIVE or TreeStatus.DEAD
- Returns: True if successful

**update_tree_yield(coord: str, yield_amount: float) -> bool**
- Update tree yield
- Parameters:
  - `coord`: Grid coordinate
  - `yield_amount`: New yield value
- Returns: True if successful

**add_seasonal_yield(coord: str, season: str, amount: float) -> bool**
- Add seasonal yield to tree
- Parameters:
  - `coord`: Grid coordinate
  - `season`: Season name
  - `amount`: Yield for season
- Returns: True if successful

**get_all_trees() -> List[Tree]**
- Get all trees in farm
- Returns: List of Tree objects

**get_alive_trees() -> List[Tree]**
- Get all alive trees
- Returns: List of alive Tree objects

**get_dead_trees() -> List[Tree]**
- Get all dead trees
- Returns: List of dead Tree objects

**get_total_trees() -> int**
- Get count of all trees
- Returns: Integer count

**get_total_yield() -> float**
- Calculate total yield across all trees
- Returns: Sum of all yields

**get_yield_by_type() -> Dict[str, float]**
- Get yield aggregated by tree type
- Returns: Dictionary like {"Mango": 75.5, "Apple": 28.0}

**get_statistics() -> Dict[str, any]**
- Get comprehensive farm statistics
- Returns: Dictionary containing:
  - `total_trees`: Total count
  - `alive_count`: Alive trees
  - `dead_count`: Dead trees
  - `total_yield`: Sum of all yields
  - `yield_by_type`: Yield by tree type
  - `average_age`: Average age of trees
  - `empty_cells`: Count of empty cells

**get_grid_info() -> Dict[str, int]**
- Get grid dimensions
- Returns: Dictionary with cols, rows, total_cells

#### Coordinate System Methods

**_get_coordinate(col: int, row: int) -> str** (Static)
- Convert column and row indices to coordinate
- Parameters:
  - `col`: Column index (0-19)
  - `row`: Row index (0-30)
- Returns: Coordinate string (e.g., "A0", "AA19")

**_parse_coordinate(coord: str) -> Tuple[int, int]** (Static)
- Parse coordinate string to indices
- Parameters:
  - `coord`: Coordinate string (e.g., "A0", "T30")
- Returns: Tuple of (col, row)

---

### TreeStatus Enum (`src.tree`)

```python
class TreeStatus(Enum):
    ALIVE = "Alive"
    DEAD = "Dead"
```

---

### FarmUI Class (`src.ui`)

Interactive Tkinter-based user interface.

#### Constructor
```python
FarmUI(farm: Farm)
```

#### Methods

**run() -> None**
- Launch the interactive UI
- Blocking call that starts the event loop

---

### FarmDataStore Class (`src.data_store`)

Handle farm data persistence.

#### Static Methods

**save_to_file(farm: Farm, filepath: str) -> bool**
- Save farm state to JSON file
- Parameters:
  - `farm`: Farm instance
  - `filepath`: Path to save to
- Returns: True if successful

**load_from_file(farm: Farm, filepath: str) -> bool**
- Load farm state from JSON file
- Parameters:
  - `farm`: Farm instance to populate
  - `filepath`: Path to load from
- Returns: True if successful

**export_statistics(farm: Farm) -> str**
- Export statistics as formatted text
- Parameters:
  - `farm`: Farm instance
- Returns: Formatted statistics string

---

## Usage Examples

### Basic Farm Operations
```python
from src.farm import Farm
from src.tree import TreeStatus

# Create farm
farm = Farm()

# Add trees
farm.add_tree("A0", "Mango", 5, 45.5)
farm.add_tree("B0", "Apple", 3, 28.0)

# Check status
total = farm.get_total_trees()  # Returns 2
alive = len(farm.get_alive_trees())  # Returns 2

# Update tree
farm.update_tree_status("A0", TreeStatus.DEAD)

# Get statistics
stats = farm.get_statistics()
print(stats['total_yield'])  # 73.5
```

### Working with Coordinates
```python
# Convert indices to coordinate
coord = farm._get_coordinate(0, 0)  # "A0"
coord = farm._get_coordinate(26, 0)  # "AA0"

# Parse coordinate
col, row = farm._parse_coordinate("B5")  # (1, 5)
```

### Seasonal Yield Tracking
```python
# Add seasonal data
farm.add_seasonal_yield("A0", "Spring", 15.0)
farm.add_seasonal_yield("A0", "Summer", 20.0)
farm.add_seasonal_yield("A0", "Fall", 10.5)

# Retrieve seasonal data
tree = farm.get_tree("A0")
spring_yield = tree.get_seasonal_yield("Spring")  # 15.0
```

### Data Persistence
```python
from src.data_store import FarmDataStore

# Save to file
FarmDataStore.save_to_file(farm, "backup.json")

# Load from file
FarmDataStore.load_from_file(farm, "backup.json")

# Export report
report = FarmDataStore.export_statistics(farm)
with open("report.txt", "w") as f:
    f.write(report)
```

### Querying Specific Trees
```python
# Get all mango trees
mango_trees = [t for t in farm.get_all_trees() if t.tree_type == "Mango"]

# Get trees older than 5 years
old_trees = [t for t in farm.get_all_trees() if t.age > 5]

# Get trees with yield over 50
high_yield = [t for t in farm.get_all_trees() if t.yield_amount > 50]
```

---

## Error Handling

All methods return boolean success indicators where applicable:
- `add_tree()` returns False if cell occupied
- `remove_tree()` returns False if cell empty
- `update_tree_*()` methods return False if tree doesn't exist

Check return values:
```python
if not farm.add_tree("A0", "Mango", 5):
    print("Failed to add tree - cell occupied")

if not farm.update_tree_age("Z99", 10):
    print("Failed to update - invalid coordinate")
```

---

## Constants & Defaults

| Constant | Value |
|----------|-------|
| GRID_ROWS | 20 |
| GRID_COLS | 31 |
| Default Age | 0 |
| Default Status | TreeStatus.ALIVE |
| Default Yield | 0.0 |

---

## Data Structures

### Tree Dictionary Format
```python
{
    'type': 'Mango',
    'position': 'A0',
    'age': 5,
    'status': 'Alive',
    'yield': 45.5,
    'seasonal_yield': {
        'Spring': 15.0,
        'Summer': 20.0,
        'Fall': 10.5
    }
}
```

### Statistics Dictionary Format
```python
{
    'total_trees': 10,
    'alive_count': 8,
    'dead_count': 2,
    'total_yield': 523.45,
    'yield_by_type': {
        'Mango': 150.5,
        'Apple': 200.0,
        'Teak': 172.95
    },
    'average_age': 5.2,
    'empty_cells': 610
}
```

---

## Thread Safety

The current implementation is not thread-safe. For multi-threaded access, implement locking:

```python
import threading

farm = Farm()
lock = threading.Lock()

def add_tree_safely(coord, tree_type, age, yield_val):
    with lock:
        return farm.add_tree(coord, tree_type, age, yield_val)
```

---

## Performance Notes

- Grid initialization: O(rows × cols) = O(620)
- Tree lookup: O(1) dictionary access
- All trees retrieval: O(n) where n = number of cells
- Statistics calculation: O(n) where n = number of trees

Grid is sparse - only occupied cells consume meaningful memory.
