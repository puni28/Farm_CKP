package com.farmckp.orchard.controller;

import com.farmckp.orchard.dto.*;
import com.farmckp.orchard.entity.Tree;
import com.farmckp.orchard.service.TreeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trees")
@RequiredArgsConstructor
public class TreeController {

    private final TreeService treeService;

    @GetMapping
    public List<TreeDTO> getAll(
        @RequestParam Long orchardId,
        @RequestParam(required = false) Tree.TreeStatus status,
        @RequestParam(required = false) Integer row,
        @RequestParam(required = false) Integer col,
        @RequestParam(required = false) String variety,
        @RequestParam(required = false) Integer minHealth
    ) {
        return treeService.findWithFilters(orchardId, status, row, col, variety, minHealth);
    }

    @GetMapping("/{id}")
    public TreeDTO getById(@PathVariable Long id) { return treeService.findById(id); }

    @PostMapping
    public ResponseEntity<TreeDTO> create(@Valid @RequestBody TreeCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(treeService.create(dto));
    }

    @PutMapping("/{id}")
    public TreeDTO update(@PathVariable Long id, @Valid @RequestBody TreeCreateDTO dto) {
        return treeService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        treeService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/dashboard")
    public DashboardStatsDTO getDashboard() { return treeService.getDashboardStats(); }
}
