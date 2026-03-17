"""Unit tests for the farm management system."""

import unittest
from src.farm import Farm
from src.tree import Tree, TreeStatus


class TestTree(unittest.TestCase):
    """Test cases for Tree class."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.tree = Tree("Mango", "A0", 5, TreeStatus.ALIVE, 45.5)
    
    def test_tree_creation(self):
        """Test tree creation with default values."""
        tree = Tree("Apple", "B1")
        self.assertEqual(tree.tree_type, "Apple")
        self.assertEqual(tree.position, "B1")
        self.assertEqual(tree.age, 0)
        self.assertEqual(tree.status, TreeStatus.ALIVE)
        self.assertEqual(tree.yield_amount, 0.0)
    
    def test_update_age(self):
        """Test updating tree age."""
        self.tree.update_age(10)
        self.assertEqual(self.tree.age, 10)
        
        # Negative age should be clamped to 0
        self.tree.update_age(-5)
        self.assertEqual(self.tree.age, 0)
    
    def test_update_status(self):
        """Test updating tree status."""
        self.tree.update_status(TreeStatus.DEAD)
        self.assertEqual(self.tree.status, TreeStatus.DEAD)
    
    def test_update_yield(self):
        """Test updating yield."""
        self.tree.update_yield(100.5)
        self.assertEqual(self.tree.yield_amount, 100.5)
        
        # Negative yield should be clamped to 0.0
        self.tree.update_yield(-10.0)
        self.assertEqual(self.tree.yield_amount, 0.0)
    
    def test_seasonal_yield(self):
        """Test seasonal yield tracking."""
        self.tree.add_seasonal_yield("Spring", 15.0)
        self.tree.add_seasonal_yield("Summer", 20.0)
        
        self.assertEqual(self.tree.get_seasonal_yield("Spring"), 15.0)
        self.assertEqual(self.tree.get_seasonal_yield("Summer"), 20.0)
        self.assertEqual(self.tree.get_seasonal_yield("Fall"), 0.0)  # Non-existent season


class TestFarm(unittest.TestCase):
    """Test cases for Farm class."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.farm = Farm()
    
    def test_grid_initialization(self):
        """Test that grid is properly initialized."""
        self.assertEqual(len(self.farm.grid), 31 * 20)  # 620 cells
        
        # All cells should be empty initially
        for cell in self.farm.grid.values():
            self.assertIsNone(cell)
    
    def test_coordinate_generation(self):
        """Test coordinate generation."""
        self.assertEqual(self.farm._get_coordinate(0, 0), "A0")
        self.assertEqual(self.farm._get_coordinate(0, 19), "A19")
        self.assertEqual(self.farm._get_coordinate(25, 0), "Z0")
        self.assertEqual(self.farm._get_coordinate(26, 0), "AA0")
    
    def test_coordinate_parsing(self):
        """Test coordinate parsing."""
        self.assertEqual(self.farm._parse_coordinate("A0"), (0, 0))
        self.assertEqual(self.farm._parse_coordinate("A19"), (0, 19))
        self.assertEqual(self.farm._parse_coordinate("Z0"), (25, 0))
        self.assertEqual(self.farm._parse_coordinate("AA0"), (26, 0))
    
    def test_add_tree(self):
        """Test adding a tree."""
        success = self.farm.add_tree("A0", "Mango", 5, 45.5)
        self.assertTrue(success)
        
        tree = self.farm.get_tree("A0")
        self.assertIsNotNone(tree)
        self.assertEqual(tree.tree_type, "Mango")
    
    def test_add_tree_to_occupied_cell(self):
        """Test that adding to occupied cell fails."""
        self.farm.add_tree("A0", "Mango", 5)
        success = self.farm.add_tree("A0", "Apple", 3)
        self.assertFalse(success)
    
    def test_add_tree_to_invalid_cell(self):
        """Test that adding to invalid cell fails."""
        success = self.farm.add_tree("INVALID", "Mango", 5)
        self.assertFalse(success)
    
    def test_remove_tree(self):
        """Test removing a tree."""
        self.farm.add_tree("A0", "Mango", 5)
        success = self.farm.remove_tree("A0")
        self.assertTrue(success)
        self.assertIsNone(self.farm.get_tree("A0"))
    
    def test_remove_tree_from_empty_cell(self):
        """Test that removing from empty cell fails."""
        success = self.farm.remove_tree("A0")
        self.assertFalse(success)
    
    def test_update_tree_age(self):
        """Test updating tree age."""
        self.farm.add_tree("A0", "Mango", 5)
        success = self.farm.update_tree_age("A0", 10)
        self.assertTrue(success)
        self.assertEqual(self.farm.get_tree("A0").age, 10)
    
    def test_get_all_trees(self):
        """Test getting all trees."""
        self.farm.add_tree("A0", "Mango", 5)
        self.farm.add_tree("A1", "Apple", 3)
        self.farm.add_tree("B0", "Teak", 8)
        
        trees = self.farm.get_all_trees()
        self.assertEqual(len(trees), 3)
    
    def test_get_alive_and_dead_trees(self):
        """Test getting alive and dead trees."""
        self.farm.add_tree("A0", "Mango", 5)
        self.farm.add_tree("A1", "Apple", 3)
        self.farm.update_tree_status("A1", TreeStatus.DEAD)
        
        alive = self.farm.get_alive_trees()
        dead = self.farm.get_dead_trees()
        
        self.assertEqual(len(alive), 1)
        self.assertEqual(len(dead), 1)
    
    def test_total_yield(self):
        """Test calculating total yield."""
        self.farm.add_tree("A0", "Mango", 5, 45.5)
        self.farm.add_tree("A1", "Apple", 3, 28.0)
        
        total = self.farm.get_total_yield()
        self.assertAlmostEqual(total, 73.5)
    
    def test_yield_by_type(self):
        """Test yield aggregation by type."""
        self.farm.add_tree("A0", "Mango", 5, 45.5)
        self.farm.add_tree("A1", "Mango", 4, 30.0)
        self.farm.add_tree("B0", "Apple", 3, 28.0)
        
        yield_by_type = self.farm.get_yield_by_type()
        self.assertAlmostEqual(yield_by_type["Mango"], 75.5)
        self.assertAlmostEqual(yield_by_type["Apple"], 28.0)
    
    def test_statistics(self):
        """Test statistics generation."""
        self.farm.add_tree("A0", "Mango", 5, 45.5)
        self.farm.add_tree("A1", "Apple", 3, 28.0)
        
        stats = self.farm.get_statistics()
        self.assertEqual(stats['total_trees'], 2)
        self.assertEqual(stats['alive_count'], 2)
        self.assertEqual(stats['dead_count'], 0)
        self.assertAlmostEqual(stats['total_yield'], 73.5)


if __name__ == "__main__":
    unittest.main()
