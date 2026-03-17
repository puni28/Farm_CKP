"""Data persistence for farm data (JSON export/import)."""

import json
from typing import Dict, List, Any
from src.farm import Farm
from src.tree import TreeStatus


class FarmDataStore:
    """Handle saving and loading farm data to/from JSON."""
    
    @staticmethod
    def save_to_file(farm: Farm, filepath: str) -> bool:
        """
        Save farm data to a JSON file.
        
        Args:
            farm: Farm instance to save
            filepath: Path to save to
            
        Returns:
            True if successful
        """
        try:
            data = {
                'grid_info': farm.get_grid_info(),
                'trees': [tree.to_dict() for tree in farm.get_all_trees()]
            }
            
            with open(filepath, 'w') as f:
                json.dump(data, f, indent=2)
            
            return True
        except Exception as e:
            print(f"Error saving farm data: {e}")
            return False
    
    @staticmethod
    def load_from_file(farm: Farm, filepath: str) -> bool:
        """
        Load farm data from a JSON file.
        
        Args:
            farm: Farm instance to populate
            filepath: Path to load from
            
        Returns:
            True if successful
        """
        try:
            with open(filepath, 'r') as f:
                data = json.load(f)
            
            # Clear existing grid
            farm.grid.clear()
            farm._initialize_grid()
            
            # Load trees
            for tree_data in data.get('trees', []):
                status = TreeStatus.ALIVE if tree_data['status'] == 'Alive' else TreeStatus.DEAD
                year_planted = tree_data.get('year_planted', 2026)
                farm.add_tree(
                    tree_data['position'],
                    tree_data['type'],
                    tree_data['age'],
                    tree_data['yield'],
                    year_planted
                )
                
                # Add seasonal yield
                tree = farm.get_tree(tree_data['position'])
                if tree:
                    for season, amount in tree_data.get('seasonal_yield', {}).items():
                        tree.add_seasonal_yield(season, amount)
                    
                    # Update status if dead
                    if status == TreeStatus.DEAD:
                        tree.update_status(status)
            
            return True
        except Exception as e:
            print(f"Error loading farm data: {e}")
            return False
    
    @staticmethod
    def export_statistics(farm: Farm) -> str:
        """Export farm statistics as formatted text."""
        stats = farm.get_statistics()
        
        output = "=" * 50 + "\n"
        output += "FARM LAND MANAGEMENT REPORT\n"
        output += "=" * 50 + "\n\n"
        
        output += "OVERVIEW\n"
        output += "-" * 50 + "\n"
        output += f"Total Grid Size: {stats.get('total_cells', 0)} cells\n"
        output += f"Total Trees: {stats['total_trees']}\n"
        output += f"Alive Trees: {stats['alive_count']}\n"
        output += f"Dead Trees: {stats['dead_count']}\n"
        output += f"Empty Cells: {stats['empty_cells']}\n\n"
        
        output += "YIELD INFORMATION\n"
        output += "-" * 50 + "\n"
        output += f"Total Yield: {stats['total_yield']:.2f}\n"
        output += f"Average Age: {stats['average_age']:.1f} years\n\n"
        
        output += "YIELD BY TREE TYPE\n"
        output += "-" * 50 + "\n"
        for tree_type, yield_amount in stats['yield_by_type'].items():
            output += f"{tree_type}: {yield_amount:.2f}\n"
        
        output += "\n" + "=" * 50 + "\n"
        
        return output
