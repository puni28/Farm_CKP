package com.farmckp.orchard.controller;

import com.farmckp.orchard.dto.DropdownOptionDTO;
import com.farmckp.orchard.service.DropdownOptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/dropdown-options")
@RequiredArgsConstructor
public class DropdownOptionController {

    private final DropdownOptionService service;

    @GetMapping
    public List<DropdownOptionDTO> getAll(@RequestParam(required = false) String category) {
        return category != null ? service.findByCategory(category) : service.findAll();
    }

    @PostMapping("/{category}")
    public ResponseEntity<DropdownOptionDTO> create(
        @PathVariable String category,
        @Valid @RequestBody DropdownOptionDTO dto
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(category, dto));
    }

    @PutMapping("/{id}")
    public DropdownOptionDTO update(@PathVariable Long id, @Valid @RequestBody DropdownOptionDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
