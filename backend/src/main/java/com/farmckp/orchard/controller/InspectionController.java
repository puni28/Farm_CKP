package com.farmckp.orchard.controller;

import com.farmckp.orchard.dto.*;
import com.farmckp.orchard.service.InspectionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inspections")
@RequiredArgsConstructor
public class InspectionController {

    private final InspectionService inspectionService;

    @GetMapping
    public List<InspectionDTO> getByTree(@RequestParam Long treeId) {
        return inspectionService.findByTree(treeId);
    }

    @GetMapping("/{id}")
    public InspectionDTO getById(@PathVariable Long id) { return inspectionService.findById(id); }

    @PostMapping
    public ResponseEntity<InspectionDTO> create(@Valid @RequestBody InspectionCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(inspectionService.create(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        inspectionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
