"""UI and rendering for the farm management system."""

import tkinter as tk
from tkinter import ttk, messagebox
from typing import Optional, Callable
from src.farm import Farm
from src.tree import Tree, TreeStatus


class FarmUI:
    """Interactive UI for farm management using Tkinter."""
    
    # Colors for different cell states
    COLOR_EMPTY = "#f0f0f0"
    COLOR_SELECTED = "#FFD700"  # Gold
    
    # Colors for different tree types
    TREE_COLORS = {
        "Mango": "#FF6B6B",      # Red
        "Apple": "#4ECDC4",      # Teal
        "Teak": "#8B6914",       # Brown
        "Coconut": "#FFE66D",    # Yellow
        "Bamboo": "#95E77D",     # Light Green
        "Oak": "#6B4423",        # Dark Brown
    }
    
    # Grid rendering constants
    CELL_SIZE = 40
    LABEL_WIDTH = 25
    
    def __init__(self, farm: Farm):
        """Initialize the UI with a farm instance."""
        self.farm = farm
        self.root = tk.Tk()
        self.root.title("Farm Land Management System")
        self.root.geometry("1200x800")
        
        self.selected_coord: Optional[str] = None
        self.cell_buttons: dict = {}
        
        self._setup_ui()
    
    def _setup_ui(self) -> None:
        """Set up the main UI layout."""
        # Main container
        main_frame = ttk.Frame(self.root)
        main_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Grid display on the left
        grid_frame = ttk.LabelFrame(main_frame, text="Farm Grid (31 × 20)")
        grid_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=(0, 10))
        
        # Create scrollable grid
        self._create_scrollable_grid(grid_frame, "Farm Grid (20 × 31)")
        
        # Control panel on the right
        control_frame = ttk.Frame(main_frame, width=300)
        control_frame.pack(side=tk.RIGHT, fill=tk.BOTH, padx=10)
        control_frame.pack_propagate(False)
        
        self._create_control_panel(control_frame)
    
    def _create_scrollable_grid(self, parent: ttk.Widget, title: str = "Farm Grid") -> None:
        """Create a scrollable grid display."""
        # Canvas with scrollbars
        canvas = tk.Canvas(parent, highlightthickness=0)
        scrollbar_y = ttk.Scrollbar(parent, orient=tk.VERTICAL, command=canvas.yview)
        scrollbar_x = ttk.Scrollbar(parent, orient=tk.HORIZONTAL, command=canvas.xview)
        
        grid_container = ttk.Frame(canvas)
        grid_container.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )
        
        canvas.create_window((0, 0), window=grid_container, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar_y.set, xscrollcommand=scrollbar_x.set)
        
        # Pack scrollbars and canvas
        scrollbar_y.pack(side=tk.RIGHT, fill=tk.Y)
        scrollbar_x.pack(side=tk.BOTTOM, fill=tk.X)
        canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        
        # Create grid
        self._render_grid(grid_container)
    
    def _render_grid(self, parent: ttk.Widget) -> None:
        """Render the farm grid with buttons, row numbers, and East/Road side labels."""
        grid_info = self.farm.get_grid_info()
        cols = grid_info['cols']
        rows = grid_info['rows']
        
        # Create frame for grid
        grid_frame = ttk.Frame(parent)
        grid_frame.pack()
        
        # Create a container for the grid with side labels
        grid_container = ttk.Frame(grid_frame)
        grid_container.pack()
        
        # Left label "East"
        left_label_frame = ttk.Frame(grid_container)
        left_label_frame.pack(side=tk.LEFT)
        
        ttk.Label(left_label_frame, text="East", font=("Arial", 10, "bold"), justify=tk.CENTER).pack()
        
        # Grid cells container with headers
        cells_frame = ttk.Frame(grid_container)
        cells_frame.pack(side=tk.LEFT)
        
        # Create header row with column letters
        header_frame = ttk.Frame(cells_frame)
        header_frame.pack()
        
        # Column headers (A, B, C, ...)
        for col in range(cols):
            col_label = self.farm._get_coordinate(col, 0)[:-1]  # Get letter part
            tk.Label(header_frame, text=col_label, width=3, height=1, justify=tk.CENTER, bg="gray90", font=("Arial", 9)).pack(side=tk.LEFT, padx=1, pady=1)
        
        # Create grid cells rows
        for row in range(rows):
            row_frame_container = ttk.Frame(cells_frame)
            row_frame_container.pack()
            
            # Row number - use tk.Label to match button sizing
            tk.Label(row_frame_container, text=str(row), width=3, height=1, justify=tk.CENTER).pack(side=tk.LEFT, padx=1, pady=1)
            
            # Cells
            for col in range(cols):
                coord = self.farm._get_coordinate(col, row)
                btn = tk.Button(
                    row_frame_container,
                    width=3,
                    height=1,
                    command=lambda c=coord: self._on_cell_click(c)
                )
                btn.pack(side=tk.LEFT, padx=1, pady=1)
                self.cell_buttons[coord] = btn
        
        # Right label "Road"
        right_label_frame = ttk.Frame(grid_container)
        right_label_frame.pack(side=tk.LEFT)
        
        ttk.Label(right_label_frame, text="Road", font=("Arial", 10, "bold"), justify=tk.CENTER).pack()
        
        self._update_grid_display()
    
    def _update_grid_display(self) -> None:
        """Update colors of all grid cells based on farm state and tree type."""
        for coord, btn in self.cell_buttons.items():
            tree = self.farm.get_tree(coord)
            
            if coord == self.selected_coord:
                bg_color = self.COLOR_SELECTED
            elif tree is None:
                bg_color = self.COLOR_EMPTY
            else:
                # Get color based on tree type
                tree_type = tree.tree_type
                bg_color = self.TREE_COLORS.get(tree_type, "#90EE90")  # Default light green
                
                # Dim color if tree is dead
                if tree.status == TreeStatus.DEAD:
                    bg_color = self._dim_color(bg_color)
            
            btn.config(bg=bg_color)
    
    @staticmethod
    def _dim_color(color: str) -> str:
        """Dim a color by reducing its brightness (for dead trees)."""
        # Convert hex to RGB, reduce brightness, convert back
        color = color.lstrip('#')
        rgb = tuple(int(color[i:i+2], 16) for i in (0, 2, 4))
        dimmed = tuple(max(0, int(c * 0.5)) for c in rgb)
        return '#{:02x}{:02x}{:02x}'.format(*dimmed)
    
    def _on_cell_click(self, coord: str) -> None:
        """Handle grid cell click."""
        self.selected_coord = coord
        self._update_grid_display()
        self._update_detail_panel()
    
    def _create_control_panel(self, parent: ttk.Widget) -> None:
        """Create the right-side control panel."""
        # Title
        ttk.Label(parent, text="Tree Details", font=("Arial", 12, "bold")).pack(pady=10)
        
        # Legend section
        ttk.Separator(parent, orient=tk.HORIZONTAL).pack(fill=tk.X, pady=5)
        ttk.Label(parent, text="Color Legend", font=("Arial", 11, "bold")).pack(pady=5)
        
        legend_frame = ttk.Frame(parent)
        legend_frame.pack(fill=tk.X, padx=10, pady=5)
        
        for tree_type, color in self.TREE_COLORS.items():
            item_frame = ttk.Frame(legend_frame)
            item_frame.pack(fill=tk.X, pady=2)
            
            # Color box
            color_box = tk.Label(item_frame, bg=color, width=3, height=1)
            color_box.pack(side=tk.LEFT, padx=5)
            
            # Tree type label
            ttk.Label(item_frame, text=tree_type).pack(side=tk.LEFT, padx=5)
        
        ttk.Separator(parent, orient=tk.HORIZONTAL).pack(fill=tk.X, pady=5)
        self.detail_frame = ttk.LabelFrame(parent, text="Selected Cell: None")
        self.detail_frame.pack(fill=tk.BOTH, expand=True, pady=5)
        
        # Placeholder labels for tree details
        self.detail_labels = {}
        for key in ['Position', 'Type', 'Age', 'Status', 'Yield']:
            ttk.Label(self.detail_frame, text=f"{key}: -").pack(anchor=tk.W, padx=10, pady=3)
        
        # Add tree section
        ttk.Separator(parent, orient=tk.HORIZONTAL).pack(fill=tk.X, pady=10)
        ttk.Label(parent, text="Add Tree", font=("Arial", 11, "bold")).pack()
        
        self.tree_type_var = tk.StringVar(value="Mango")
        ttk.Combobox(
            parent,
            textvariable=self.tree_type_var,
            values=["Mango", "Apple", "Teak", "Coconut", "Bamboo", "Oak"],
            state="readonly",
            width=20
        ).pack(pady=5)
        
        ttk.Label(parent, text="Age (years):").pack(anchor=tk.W, padx=10)
        self.age_var = tk.IntVar(value=0)
        ttk.Spinbox(parent, from_=0, to=100, textvariable=self.age_var, width=20).pack(pady=3)
        
        ttk.Label(parent, text="Year Planted:").pack(anchor=tk.W, padx=10)
        self.year_planted_var = tk.IntVar(value=2026)
        ttk.Spinbox(parent, from_=1900, to=2026, textvariable=self.year_planted_var, width=20).pack(pady=3)
        
        ttk.Label(parent, text="Yield:").pack(anchor=tk.W, padx=10)
        self.yield_var = tk.DoubleVar(value=0.0)
        ttk.Spinbox(parent, from_=0, to=1000, textvariable=self.yield_var, width=20).pack(pady=3)
        
        ttk.Button(parent, text="Add Tree", command=self._add_tree).pack(pady=5)
        ttk.Button(parent, text="Delete Tree", command=self._remove_tree, width=20).pack(pady=5, fill=tk.X, padx=10)
        
        # Update tree section
        ttk.Separator(parent, orient=tk.HORIZONTAL).pack(fill=tk.X, pady=10)
        ttk.Label(parent, text="Update Tree", font=("Arial", 11, "bold")).pack()
        
        ttk.Label(parent, text="Status:").pack(anchor=tk.W, padx=10)
        self.status_var = tk.StringVar(value="Alive")
        ttk.Combobox(
            parent,
            textvariable=self.status_var,
            values=["Alive", "Dead"],
            state="readonly",
            width=20
        ).pack(pady=3)
        
        ttk.Button(parent, text="Update Tree", command=self._update_tree).pack(pady=5)
        
        # Statistics section
        ttk.Separator(parent, orient=tk.HORIZONTAL).pack(fill=tk.X, pady=10)
        ttk.Label(parent, text="Farm Statistics", font=("Arial", 11, "bold")).pack()
        
        ttk.Button(parent, text="Show Statistics", command=self._show_statistics).pack(pady=5)
    
    def _update_detail_panel(self) -> None:
        """Update the detail panel with selected tree information."""
        tree = self.farm.get_tree(self.selected_coord)
        self.detail_frame.config(text=f"Selected Cell: {self.selected_coord}")
        
        # Clear existing labels
        for widget in self.detail_frame.winfo_children():
            widget.destroy()
        
        if tree is None:
            ttk.Label(self.detail_frame, text="Empty cell - no tree", foreground="gray").pack(pady=20)
        else:
            details = [
                ("Position", tree.position),
                ("Type", tree.tree_type),
                ("Age", f"{tree.age} years"),
                ("Year Planted", str(tree.year_planted)),
                ("Status", tree.status.value),
                ("Yield", f"{tree.yield_amount:.1f}")
            ]
            
            for key, value in details:
                ttk.Label(self.detail_frame, text=f"{key}: {value}").pack(anchor=tk.W, padx=10, pady=3)
            
            # Show seasonal yield if any
            if tree.seasonal_yield:
                ttk.Label(self.detail_frame, text="Seasonal Yield:", font=("Arial", 9, "bold")).pack(anchor=tk.W, padx=10, pady=(10, 3))
                for season, amount in tree.seasonal_yield.items():
                    ttk.Label(self.detail_frame, text=f"  {season}: {amount:.1f}", foreground="blue").pack(anchor=tk.W, padx=20)
    
    def _add_tree(self) -> None:
        """Add a tree to the selected cell."""
        if self.selected_coord is None:
            messagebox.showwarning("No Selection", "Please select a cell first.")
            return
        
        success = self.farm.add_tree(
            self.selected_coord,
            self.tree_type_var.get(),
            self.age_var.get(),
            self.yield_var.get(),
            self.year_planted_var.get()
        )
        
        if success:
            self._update_grid_display()
            self._update_detail_panel()
            messagebox.showinfo("Success", f"Tree added at {self.selected_coord}")
        else:
            messagebox.showerror("Error", "Cell already occupied or invalid.")
    
    def _remove_tree(self) -> None:
        """Remove the tree from the selected cell."""
        if self.selected_coord is None:
            messagebox.showwarning("No Selection", "Please select a cell first.")
            return
        
        if self.farm.get_tree(self.selected_coord) is None:
            messagebox.showwarning("Empty Cell", "No tree to remove.")
            return
        
        self.farm.remove_tree(self.selected_coord)
        self._update_grid_display()
        self._update_detail_panel()
        messagebox.showinfo("Success", f"Tree removed from {self.selected_coord}")
    
    def _update_tree(self) -> None:
        """Update the selected tree's status."""
        tree = self.farm.get_tree(self.selected_coord)
        
        if tree is None:
            messagebox.showwarning("No Tree", "No tree at selected position.")
            return
        
        status_str = self.status_var.get()
        status = TreeStatus.ALIVE if status_str == "Alive" else TreeStatus.DEAD
        
        self.farm.update_tree_status(self.selected_coord, status)
        self._update_grid_display()
        self._update_detail_panel()
        messagebox.showinfo("Success", f"Tree status updated to {status_str}")
    
    def _show_statistics(self) -> None:
        """Display farm statistics."""
        stats = self.farm.get_statistics()
        
        stats_text = f"""
Farm Statistics:
{"-" * 40}
Total Trees: {stats['total_trees']}
Alive Trees: {stats['alive_count']}
Dead Trees: {stats['dead_count']}
Total Yield: {stats['total_yield']:.2f}
Average Age: {stats['average_age']:.1f} years
Empty Cells: {stats['empty_cells']}

Yield by Type:
{'-' * 40}
"""
        for tree_type, yield_amount in stats['yield_by_type'].items():
            stats_text += f"{tree_type}: {yield_amount:.2f}\n"
        
        messagebox.showinfo("Farm Statistics", stats_text)
    
    def run(self) -> None:
        """Start the UI event loop."""
        self.root.mainloop()
