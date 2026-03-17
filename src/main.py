"""Main entry point for the farm management system."""

from src.farm import Farm
from src.ui import FarmUI


def main():
    """Initialize and run the farm management system."""
    # Create a new farm
    farm = Farm()
    
    # Add some sample data for demonstration
    _add_sample_data(farm)
    
    # Launch the UI
    ui = FarmUI(farm)
    ui.run()


def _add_sample_data(farm: Farm) -> None:
    """Add sample data to the farm for demonstration."""
    sample_trees = [
        ("A0", "Mango", 5, 45.5, 2021),
        ("A1", "Apple", 3, 28.0, 2023),
        ("B0", "Teak", 8, 62.3, 2018),
        ("C5", "Coconut", 2, 15.0, 2024),
        ("D10", "Mango", 4, 35.2, 2022),
        ("E2", "Bamboo", 1, 10.5, 2025),
        ("F8", "Oak", 6, 55.0, 2020),
    ]
    
    for coord, tree_type, age, yield_amount, year_planted in sample_trees:
        farm.add_tree(coord, tree_type, age, yield_amount, year_planted)


if __name__ == "__main__":
    main()
