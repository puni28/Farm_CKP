package com.farmckp.orchard.controller;

import com.farmckp.orchard.dto.OrchardDTO;
import com.farmckp.orchard.service.OrchardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orchards")
@RequiredArgsConstructor
public class OrchardController {

    private final OrchardService orchardService;

    @GetMapping
    public List<OrchardDTO> getAll() { return orchardService.findAll(); }

    @GetMapping("/{id}")
    public OrchardDTO getById(@PathVariable Long id) { return orchardService.findById(id); }

    @PostMapping
    public ResponseEntity<OrchardDTO> create(@RequestBody OrchardDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orchardService.create(dto));
    }

    @PutMapping("/{id}")
    public OrchardDTO update(@PathVariable Long id, @RequestBody OrchardDTO dto) {
        return orchardService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        orchardService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
