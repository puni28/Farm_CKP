"""Farm data model managing the grid of trees."""

from typing import Optional, Dict, List, Tuple
from src.tree import Tree, TreeStatus


class Farm:
    """Manages a grid-based farm with trees."""
    
    # Grid dimensions
    GRID_ROWS = 31  # Numbers: 0-30
    GRID_COLS = 20  # Letters: A-T (20 total)
    
    def __init__(self):
        """Initialize the farm with an empty grid."""
        self.grid: Dict[str, Optional[Tree]] = {}
        self._initialize_grid()
    
    def _initialize_grid(self) -> None:
        """Initialize all grid cells as empty."""
        for col in range(self.GRID_COLS):
            for row in range(self.GRID_ROWS):
                coord = self._get_coordinate(col, row)
                self.grid[coord] = None
    
    @staticmethod
    def _get_coordinate(col: int, row: int) -> str:
        """Convert column and row indices to coordinate string (e.g., 'A0', 'Z19', 'AA0')."""
        col_letter = ""
        n = col
        while n >= 0:
            col_letter = chr(ord('A') + (n % 26)) + col_letter
            n = n // 26 - 1
        return f"{col_letter}{row}"
    
    @staticmethod
    def _parse_coordinate(coord: str) -> Tuple[int, int]:
        """Parse coordinate string to column and row indices."""
        # Extract letters and numbers
        i = 0
        while i < len(coord) and coord[i].isalpha():
            i += 1
        
        col_letter = coord[:i]
        row = int(coord[i:])
        
        # Convert column letters to index
        col = 0
        for char in col_letter:
            col = col * 26 + (ord(char) - ord('A') + 1)
        col -= 1
        
        return col, row
    
    def add_tree(
        self,
        coord: str,
        tree_type: str,
        age: int = 0,
        yield_amount: float = 0.0,
        year_planted: int = 2026
    ) -> bool:
        """
        Add a tree to the grid at the given coordinate.
        
        Args:
            coord: Grid coordinate (e.g., 'A0')
            tree_type: Type of tree
            age: Age in years
            yield_amount: Initial yield amount
            year_planted: Year tree was planted
            
        Returns:
            True if successful, False if cell already occupied or invalid coordinate
        """
        if coord not in self.grid:
            return False
        
        if self.grid[coord] is not None:
            return False
        
        tree = Tree(tree_type, coord, age, TreeStatus.ALIVE, yield_amount, year_planted)
        self.grid[coord] = tree
        return True
    
    def remove_tree(self, coord: str) -> bool:
        """
        Remove a tree from the grid.
        
        Args:
            coord: Grid coordinate
            
        Returns:
            True if successful, False if cell was empty
        """
        if coord not in self.grid:
            return False
        
        if self.grid[coord] is None:
            return False
        
        self.grid[coord] = None
        return True
    
    def get_tree(self, coord: str) -> Optional[Tree]:
        """Get the tree at a given coordinate."""
        return self.grid.get(coord)
    
    def update_tree_age(self, coord: str, new_age: int) -> bool:
        """Update a tree's age. Returns True if successful."""
        tree = self.get_tree(coord)
        if tree:
            tree.update_age(new_age)
            return True
        return False
    
    def update_tree_status(self, coord: str, status: TreeStatus) -> bool:
        """Update a tree's status. Returns True if successful."""
        tree = self.get_tree(coord)
        if tree:
            tree.update_status(status)
            return True
        return False
    
    def update_tree_yield(self, coord: str, yield_amount: float) -> bool:
        """Update a tree's yield. Returns True if successful."""
        tree = self.get_tree(coord)
        if tree:
            tree.update_yield(yield_amount)
            return True
        return False
    
    def add_seasonal_yield(self, coord: str, season: str, amount: float) -> bool:
        """Add seasonal yield to a tree. Returns True if successful."""
        tree = self.get_tree(coord)
        if tree:
            tree.add_seasonal_yield(season, amount)
            return True
        return False
    
    def get_all_trees(self) -> List[Tree]:
        """Get list of all trees in the farm."""
        return [tree for tree in self.grid.values() if tree is not None]
    
    def get_total_trees(self) -> int:
        """Get total number of trees."""
        return len(self.get_all_trees())
    
    def get_alive_trees(self) -> List[Tree]:
        """Get list of all alive trees."""
        return [tree for tree in self.get_all_trees() if tree.status == TreeStatus.ALIVE]
    
    def get_dead_trees(self) -> List[Tree]:
        """Get list of all dead trees."""
        return [tree for tree in self.get_all_trees() if tree.status == TreeStatus.DEAD]
    
    def get_total_yield(self) -> float:
        """Get total yield across all trees."""
        return sum(tree.yield_amount for tree in self.get_all_trees())
    
    def get_yield_by_type(self) -> Dict[str, float]:
        """Get total yield grouped by tree type."""
        yield_by_type = {}
        for tree in self.get_all_trees():
            if tree.tree_type not in yield_by_type:
                yield_by_type[tree.tree_type] = 0.0
            yield_by_type[tree.tree_type] += tree.yield_amount
        return yield_by_type
    
    def get_statistics(self) -> Dict[str, any]:
        """Get comprehensive farm statistics."""
        all_trees = self.get_all_trees()
        alive = self.get_alive_trees()
        dead = self.get_dead_trees()
        
        return {
            'total_trees': len(all_trees),
            'alive_count': len(alive),
            'dead_count': len(dead),
            'total_yield': self.get_total_yield(),
            'yield_by_type': self.get_yield_by_type(),
            'average_age': sum(t.age for t in all_trees) / len(all_trees) if all_trees else 0,
            'empty_cells': len([c for c in self.grid.values() if c is None])
        }
    
    def get_grid_info(self) -> Dict[str, int]:
        """Get grid dimensions information."""
        return {
            'cols': self.GRID_COLS,
            'rows': self.GRID_ROWS,
            'total_cells': self.GRID_COLS * self.GRID_ROWS
        }
