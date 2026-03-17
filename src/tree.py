"""Tree data model for the farm management system."""

from enum import Enum
from typing import Optional, Dict, Any


class TreeStatus(Enum):
    """Enumeration for tree health status."""
    ALIVE = "Alive"
    DEAD = "Dead"


class Tree:
    """Represents a single tree in the farm grid."""
    
    def __init__(
        self,
        tree_type: str,
        position: str,
        age: int = 0,
        status: TreeStatus = TreeStatus.ALIVE,
        yield_amount: float = 0.0,
        year_planted: int = 2026,
        seasonal_yield: Optional[Dict[str, float]] = None
    ):
        """
        Initialize a tree with the given attributes.
        
        Args:
            tree_type: Type of tree (e.g., 'Mango', 'Apple', 'Teak')
            position: Grid coordinate (e.g., 'A0', 'B12')
            age: Age in years
            status: TreeStatus enum value
            yield_amount: Total yield amount
            year_planted: Year the tree was planted
            seasonal_yield: Dictionary of seasonal yields {season: amount}
        """
        self.tree_type = tree_type
        self.position = position
        self.age = age
        self.status = status
        self.yield_amount = yield_amount
        self.year_planted = year_planted
        self.seasonal_yield = seasonal_yield or {}
    
    def update_age(self, new_age: int) -> None:
        """Update the tree's age."""
        self.age = max(0, new_age)
    
    def update_status(self, new_status: TreeStatus) -> None:
        """Update the tree's health status."""
        self.status = new_status
    
    def update_yield(self, amount: float) -> None:
        """Update the total yield amount."""
        self.yield_amount = max(0.0, amount)
    
    def add_seasonal_yield(self, season: str, amount: float) -> None:
        """Add or update yield for a specific season."""
        self.seasonal_yield[season] = max(0.0, amount)
    
    def get_seasonal_yield(self, season: str) -> float:
        """Get yield for a specific season."""
        return self.seasonal_yield.get(season, 0.0)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert tree data to dictionary."""
        return {
            'type': self.tree_type,
            'position': self.position,
            'age': self.age,
            'status': self.status.value,
            'yield': self.yield_amount,
            'year_planted': self.year_planted,
            'seasonal_yield': self.seasonal_yield.copy()
        }
    
    def __repr__(self) -> str:
        """String representation of the tree."""
        return f"Tree({self.tree_type}, {self.position}, {self.status.value}, Age: {self.age})"
