"""Example usage and demonstration of the farm management system."""

from src.farm import Farm
from src.tree import TreeStatus
from src.data_store import FarmDataStore


def demo_basic_operations():
    """Demonstrate basic farm operations."""
    print("=" * 60)
    print("FARM MANAGEMENT SYSTEM - DEMONSTRATION")
    print("=" * 60)
    
    # Create a farm
    farm = Farm()
    
    # Add some trees
    print("\n1. Adding trees to the farm...")
    trees_to_add = [
        ("A0", "Mango", 5, 45.5, 2021),
        ("A1", "Apple", 3, 28.0, 2023),
        ("B0", "Teak", 8, 62.3, 2018),
        ("C5", "Coconut", 2, 15.0, 2024),
        ("D10", "Mango", 4, 35.2, 2022),
        ("E2", "Bamboo", 1, 10.5, 2025),
        ("F8", "Oak", 6, 55.0, 2020),
        ("G3", "Mango", 7, 50.0, 2019),
    ]
    
    for coord, tree_type, age, yield_amount, year_planted in trees_to_add:
        success = farm.add_tree(coord, tree_type, age, yield_amount, year_planted)
        status = "✓" if success else "✗"
        print(f"  {status} Added {tree_type} at {coord} (Age: {age}, Planted: {year_planted}, Yield: {yield_amount})")
    
    # Query trees
    print("\n2. Querying farm data...")
    print(f"  Total trees: {farm.get_total_trees()}")
    print(f"  Alive trees: {len(farm.get_alive_trees())}")
    print(f"  Dead trees: {len(farm.get_dead_trees())}")
    
    # Update tree status
    print("\n3. Updating tree status...")
    farm.update_tree_status("A1", TreeStatus.DEAD)
    print(f"  ✓ Marked Apple at A1 as Dead")
    
    # Add seasonal yield
    print("\n4. Adding seasonal yield information...")
    farm.add_seasonal_yield("A0", "Spring", 15.0)
    farm.add_seasonal_yield("A0", "Summer", 20.0)
    farm.add_seasonal_yield("A0", "Fall", 10.5)
    print(f"  ✓ Added seasonal yield for Mango at A0")
    
    # Get statistics
    print("\n5. Farm Statistics:")
    stats = farm.get_statistics()
    print(f"  Total trees: {stats['total_trees']}")
    print(f"  Alive: {stats['alive_count']}, Dead: {stats['dead_count']}")
    print(f"  Total yield: {stats['total_yield']:.2f}")
    print(f"  Average age: {stats['average_age']:.1f} years")
    print(f"  Empty cells: {stats['empty_cells']}")
    
    print("\n6. Yield by tree type:")
    for tree_type, yield_amount in stats['yield_by_type'].items():
        print(f"  {tree_type}: {yield_amount:.2f}")
    
    # Get specific tree
    print("\n7. Specific tree details:")
    tree = farm.get_tree("A0")
    if tree:
        print(f"  Position: {tree.position}")
        print(f"  Type: {tree.tree_type}")
        print(f"  Age: {tree.age} years")
        print(f"  Status: {tree.status.value}")
        print(f"  Total Yield: {tree.yield_amount}")
        if tree.seasonal_yield:
            print(f"  Seasonal Yield:")
            for season, amount in tree.seasonal_yield.items():
                print(f"    {season}: {amount}")
    
    # Save to file
    print("\n8. Saving farm data...")
    if FarmDataStore.save_to_file(farm, "farm_data.json"):
        print("  ✓ Farm data saved to farm_data.json")
    
    # Export statistics report
    print("\n9. Exporting statistics report...")
    report = FarmDataStore.export_statistics(farm)
    print(report)
    
    # Save report to file
    with open("farm_report.txt", "w") as f:
        f.write(report)
    print("  ✓ Report saved to farm_report.txt")
    
    print("\n" + "=" * 60)
    print("Demonstration complete! Run 'python -m src.main' to launch the UI.")
    print("=" * 60)


if __name__ == "__main__":
    demo_basic_operations()
