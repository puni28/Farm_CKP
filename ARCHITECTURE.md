# Architecture & Extension Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FarmUI (Tkinter)                         │
│         Interactive Grid-based User Interface               │
└──────────────────────┬──────────────────────────────────────┘
                       │
         ┌─────────────┴──────────────┐
         │                            │
    ┌────▼────┐               ┌──────▼─────┐
    │ Farm    │               │ FarmDataStore
    │ (Logic) │               │ (Persistence)
    └────┬────┘               └──────┬─────┘
         │                            │
    ┌────▼────┐               ┌──────▼──────┐
    │ Tree    │               │ JSON Files  │
    │ (Data)  │               │ farm_data   │
    └─────────┘               └─────────────┘
```

## Module Dependencies

```
main.py
├── farm.py
│   └── tree.py
├── ui.py
│   ├── farm.py
│   │   └── tree.py
│   └── tkinter (stdlib)
└── data_store.py
    └── farm.py
        └── tree.py
```

## Design Patterns Used

### 1. **Model-View Separation**
- **Model**: `Tree`, `Farm` classes handle data and business logic
- **View**: `FarmUI` handles presentation
- Changes to data don't require UI changes and vice versa

### 2. **Separation of Concerns**
Each module has a single responsibility:
- `tree.py`: Tree entity representation
- `farm.py`: Grid management and queries
- `ui.py`: User interface
- `data_store.py`: Persistence

### 3. **Immutable Grid Structure**
- Grid coordinates are fixed at initialization
- Trees are mutable, grid is not
- Prevents coordinate corruption

### 4. **Dictionary-based Grid**
- Sparse grid (only stores occupied cells)
- Fast O(1) lookups by coordinate
- Memory efficient

## Extending the System

### Adding a New Tree Attribute

1. **Modify `Tree` class** in `src/tree.py`:
```python
def __init__(self, ..., health_score: float = 100.0):
    ...
    self.health_score = health_score

def update_health(self, score: float) -> None:
    self.health_score = max(0.0, min(100.0, score))

def to_dict(self) -> Dict[str, Any]:
    data = {
        ...
        'health_score': self.health_score
    }
    return data
```

2. **Update `Farm` class** in `src/farm.py`:
```python
def update_tree_health(self, coord: str, score: float) -> bool:
    tree = self.get_tree(coord)
    if tree:
        tree.update_health(score)
        return True
    return False
```

3. **Update `FarmUI`** in `src/ui.py`:
```python
# In detail panel update
("Health", f"{tree.health_score:.1f}%"),

# In update controls
ttk.Label(parent, text="Health Score (%):").pack(anchor=tk.W, padx=10)
self.health_var = tk.DoubleVar(value=100.0)
ttk.Spinbox(parent, from_=0, to=100, textvariable=self.health_var).pack()
```

4. **Update persistence** in `src/data_store.py`:
```python
# In load_from_file, after creating tree:
tree.health_score = tree_data.get('health_score', 100.0)
```

### Adding New Tree Types

Simply use them in the UI dropdown or programmatically:
```python
# In ui.py, update the Combobox values
values=["Mango", "Apple", "Teak", "Coconut", "Bamboo", "Oak", "Pine", "Maple"]

# Or add dynamically from a configuration
TREE_TYPES = [
    "Mango", "Apple", "Teak", "Coconut", 
    "Bamboo", "Oak", "Pine", "Maple"
]
ttk.Combobox(parent, values=TREE_TYPES, ...)
```

### Implementing Historical Tracking

Create a new file `src/history.py`:
```python
class TreeHistory:
    def __init__(self, tree: Tree):
        self.tree_id = tree.position
        self.snapshots = []
    
    def snapshot(self, timestamp: datetime):
        self.snapshots.append({
            'timestamp': timestamp,
            'age': self.tree.age,
            'status': self.tree.status.value,
            'yield': self.tree.yield_amount
        })
    
    def get_history(self) -> List[Dict]:
        return self.snapshots
```

### Adding CSV Export

Extend `src/data_store.py`:
```python
import csv

@staticmethod
def export_to_csv(farm: Farm, filepath: str) -> bool:
    try:
        with open(filepath, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['Position', 'Type', 'Age', 'Status', 'Yield'])
            for tree in farm.get_all_trees():
                writer.writerow([
                    tree.position,
                    tree.tree_type,
                    tree.age,
                    tree.status.value,
                    tree.yield_amount
                ])
        return True
    except Exception as e:
        print(f"Error exporting to CSV: {e}")
        return False
```

### Implementing Batch Operations

Add to `src/farm.py`:
```python
def batch_add_trees(self, trees_data: List[Tuple[str, str, int, float]]) -> int:
    """Add multiple trees and return count of successful additions."""
    count = 0
    for coord, tree_type, age, yield_val in trees_data:
        if self.add_tree(coord, tree_type, age, yield_val):
            count += 1
    return count

def batch_remove_trees(self, coordinates: List[str]) -> int:
    """Remove multiple trees and return count of successful removals."""
    count = 0
    for coord in coordinates:
        if self.remove_tree(coord):
            count += 1
    return count
```

### Creating a Web Interface

Replace `src/ui.py` with Flask/Django views while keeping `Farm` unchanged:
```python
from flask import Flask, render_template
from src.farm import Farm

app = Flask(__name__)
farm = Farm()

@app.route('/farm')
def show_farm():
    trees = farm.get_all_trees()
    stats = farm.get_statistics()
    return render_template('farm.html', trees=trees, stats=stats)

@app.route('/farm/add/<coord>/<tree_type>', methods=['POST'])
def add_tree(coord, tree_type):
    success = farm.add_tree(coord, tree_type)
    return {'success': success}
```

### Adding Database Support

Replace JSON with database in `src/data_store.py`:
```python
import sqlite3

@staticmethod
def save_to_database(farm: Farm, db_path: str) -> bool:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute('''CREATE TABLE IF NOT EXISTS trees
                      (position TEXT PRIMARY KEY, type TEXT, age INT, 
                       status TEXT, yield REAL)''')
    
    for tree in farm.get_all_trees():
        cursor.execute('INSERT OR REPLACE INTO trees VALUES (?, ?, ?, ?, ?)',
                      (tree.position, tree.tree_type, tree.age, 
                       tree.status.value, tree.yield_amount))
    
    conn.commit()
    conn.close()
    return True
```

## Configuration Options

### Customizing Grid Size

In `src/farm.py`:
```python
class Farm:
    GRID_ROWS = 40  # Change from 20
    GRID_COLS = 50  # Change from 31
```

### Customizing UI Appearance

In `src/ui.py`:
```python
class FarmUI:
    COLOR_EMPTY = "#ffffff"
    COLOR_ALIVE = "#00ff00"
    COLOR_DEAD = "#ff0000"
    COLOR_SELECTED = "#ffff00"
    CELL_SIZE = 50  # Larger cells
```

### Default Tree Types

Create `src/config.py`:
```python
DEFAULT_TREE_TYPES = [
    "Mango", "Apple", "Teak", "Coconut",
    "Bamboo", "Oak", "Pine", "Maple"
]

DEFAULT_SEASONS = ["Spring", "Summer", "Fall", "Winter"]
```

Use in `ui.py`:
```python
from src.config import DEFAULT_TREE_TYPES

ttk.Combobox(parent, values=DEFAULT_TREE_TYPES, ...)
```

## Testing Strategy

### Unit Tests
- Test `Tree` methods: create, update, to_dict
- Test `Farm` methods: add, remove, get, statistics
- Test coordinate conversion: _get_coordinate, _parse_coordinate

### Integration Tests
- Test Farm + Tree interactions
- Test UI + Farm data consistency
- Test persistence round-trips

### Example Test Extension
```python
def test_batch_operations(self):
    farm = Farm()
    trees = [("A0", "Mango", 5, 10), ("B0", "Apple", 3, 8)]
    count = farm.batch_add_trees(trees)
    self.assertEqual(count, 2)
    self.assertEqual(farm.get_total_trees(), 2)
```

## Performance Optimization

### Current Bottlenecks
1. **Grid rendering**: Recreates all cells on update
   - Solution: Update only changed cells
2. **Statistics calculation**: Iterates all trees
   - Solution: Cache statistics, invalidate on changes

### Optimization Examples

Lazy statistics:
```python
class Farm:
    def __init__(self):
        self._stats_cache = None
        self._stats_dirty = True
    
    def get_statistics(self):
        if self._stats_dirty:
            self._stats_cache = self._calculate_statistics()
            self._stats_dirty = False
        return self._stats_cache
    
    def add_tree(self, ...):
        ... # existing code
        self._stats_dirty = True
```

## Development Workflow

1. **Make changes to data model** (`tree.py`, `farm.py`)
2. **Update tests** (`tests.py`)
3. **Update UI** (`ui.py`)
4. **Update persistence** (`data_store.py`)
5. **Update documentation** (README.md, API_REFERENCE.md)
6. **Test end-to-end** (run demo.py)

## Version Control

Recommended `.gitignore`:
```
venv/
__pycache__/
*.pyc
.pytest_cache/
farm_data.json
farm_report.txt
.DS_Store
*.swp
```

## Future Roadmap

### Phase 1 (Current)
- ✅ Basic grid and tree management
- ✅ Interactive UI
- ✅ JSON persistence

### Phase 2
- [ ] Search and filtering
- [ ] Batch operations
- [ ] CSV export
- [ ] Advanced UI (matplotlib overlay)

### Phase 3
- [ ] Web interface
- [ ] Database backend
- [ ] Mobile app
- [ ] Real-time collaboration

### Phase 4
- [ ] Predictive analytics
- [ ] Weather integration
- [ ] Automated monitoring
- [ ] Reporting engine
