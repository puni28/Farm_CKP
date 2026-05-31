package com.farmckp.orchard.controller;

import com.farmckp.orchard.dto.VarietyDTO;
import com.farmckp.orchard.service.VarietyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/varieties")
@RequiredArgsConstructor
public class VarietyController {

    private final VarietyService varietyService;

    @GetMapping
    public List<VarietyDTO> getAll() { return varietyService.findAll(); }

    @GetMapping("/{id}")
    public VarietyDTO getById(@PathVariable Long id) { return varietyService.findById(id); }

    @PostMapping
    public ResponseEntity<VarietyDTO> create(@Valid @RequestBody VarietyDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(varietyService.create(dto));
    }

    @PutMapping("/{id}")
    public VarietyDTO update(@PathVariable Long id, @Valid @RequestBody VarietyDTO dto) {
        return varietyService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        varietyService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
