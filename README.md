# Farm Land Management System

A comprehensive, interactive grid-based digital farm management system for tracking and managing trees across farm land.

## Features

### Core Features
- **Interactive Grid Interface**: 20 × 31 grid with unique coordinate labeling (A0, A1, B0, etc.)
- **Tree Management**: Add, update, and remove trees with detailed attributes
- **Real-time Visualization**: Color-coded display of tree status (alive/dead) and empty cells
- **Farm Statistics**: View comprehensive analytics including total trees, yield analysis, and health status
- **Data Persistence**: Save and load farm data from JSON files

### Tree Attributes
Each tree stores:
- **Type**: Category of tree (Mango, Apple, Teak, Coconut, Bamboo, Oak, etc.)
- **Age**: Tree age in years
- **Position**: Grid coordinate (e.g., A0, B12, Z19)
- **Status**: Health status (Alive/Dead)
- **Yield**: Total yield amount
- **Seasonal Yield**: Yield breakdown by season (extensible)

### Statistics & Analytics
- Total trees count
- Alive vs. dead tree counts
- Total yield across farm
- Average tree age
- Yield aggregated by tree type
- Empty cell count

## Project Structure

```
Farm_CKP/
├── src/
│   ├── __init__.py          # Package initialization
│   ├── main.py              # Application entry point
│   ├── tree.py              # Tree data model
│   ├── farm.py              # Farm grid management logic
│   ├── ui.py                # Tkinter-based interactive UI
│   └── data_store.py        # JSON persistence layer
├── README.md                # This file
└── venv/                    # Virtual environment
```

## Architecture & Design

### Modular Design
The system follows clean separation of concerns:
- **Data Layer** (`tree.py`, `farm.py`): Pure data models and business logic
- **UI Layer** (`ui.py`): Tkinter interface independent from data logic
- **Persistence Layer** (`data_store.py`): Handles file I/O
- **Main** (`main.py`): Application orchestration

### Extensibility
The architecture supports future enhancements:
- Add new tree types without modifying core logic
- Implement database persistence (replace JSON)
- Add seasonal tracking details
- Create export formats (CSV, PDF)
- Implement batch operations
- Add filtering and search capabilities

## Usage

### Installation

1. Activate the virtual environment:
```powershell
.\venv\Scripts\Activate.ps1
```

2. Run the application:
```powershell
python -m src.main
```

### Interactive Features

#### Selecting a Cell
- Click any cell in the grid to select it
- Selected cell highlights in gold
- Details panel updates with tree information (if any)

#### Adding a Tree
1. Select an empty cell
2. Choose tree type from dropdown
3. Set age and initial yield
4. Click "Add Tree"

#### Updating a Tree
1. Select a cell with a tree
2. Change status (Alive/Dead) using dropdown
3. Click "Update Tree"

#### Removing a Tree
1. Select a cell with a tree
2. Click "Remove Tree"

#### Viewing Statistics
1. Click "Show Statistics" button
2. View comprehensive farm analytics in popup

### Grid Coordinate System

- **Columns**: A-T (20 letters)
- **Rows**: 0-30 (31 total)
- **Format**: Letter + Number (e.g., A0, T30, J15)
- **Total Cells**: 620 (20 × 31)

### Color Coding

| Color | Meaning |
|-------|---------|
| Light Gray | Empty cell |
| Light Green | Alive tree |
| Light Red | Dead tree |
| Gold | Selected cell |

## Code Examples

### Using the Data Model Directly

```python
from src.farm import Farm
from src.tree import TreeStatus

# Create a farm
farm = Farm()

# Add a tree
farm.add_tree("A0", "Mango", age=5, yield_amount=45.5)

# Update tree status
farm.update_tree_status("A0", TreeStatus.DEAD)

# Get statistics
stats = farm.get_statistics()
print(f"Total trees: {stats['total_trees']}")
print(f"Total yield: {stats['total_yield']}")

# Get all alive trees
alive_trees = farm.get_alive_trees()
```

### Persistence

```python
from src.data_store import FarmDataStore

# Save farm to file
FarmDataStore.save_to_file(farm, "farm_backup.json")

# Load farm from file
FarmDataStore.load_from_file(farm, "farm_backup.json")

# Export statistics report
report = FarmDataStore.export_statistics(farm)
with open("farm_report.txt", "w") as f:
    f.write(report)
```

## Requirements

- Python 3.7+
- tkinter (included with Python)

## Future Enhancements

### Short-term
- [ ] Search/filter trees by type
- [ ] Batch operations (update multiple trees)
- [ ] Undo/redo functionality
- [ ] Keyboard shortcuts for common actions

### Medium-term
- [ ] CSV export/import
- [ ] Image overlay for farm maps
- [ ] Historical tracking (changes over time)
- [ ] Disease/pest management tracking

### Long-term
- [ ] Multi-farm management
- [ ] Web-based interface
- [ ] Mobile app companion
- [ ] Predictive analytics
- [ ] Integration with weather data
- [ ] Automated reports and alerts

## Design Principles

1. **Separation of Concerns**: Data, UI, and persistence are independent
2. **Modularity**: Each component has a single responsibility
3. **Extensibility**: Easy to add new features without breaking existing code
4. **Readability**: Clear naming and documentation throughout
5. **Testability**: Logic separated from UI for easy unit testing

## License

Open source - feel free to modify and extend.

## Notes

- The grid uses a letter-based column system that extends beyond Z (AA, AB, etc.)
- All coordinates are immutable after tree creation
- Yield values support decimal precision
- The system can handle up to 620 trees with current grid size
