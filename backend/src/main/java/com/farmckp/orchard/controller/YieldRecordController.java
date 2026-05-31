package com.farmckp.orchard.controller;

import com.farmckp.orchard.dto.*;
import com.farmckp.orchard.service.YieldRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/yields")
@RequiredArgsConstructor
public class YieldRecordController {

    private final YieldRecordService yieldRecordService;

    @GetMapping
    public List<YieldRecordDTO> getByTree(@RequestParam Long treeId) {
        return yieldRecordService.findByTree(treeId);
    }

    @GetMapping("/{id}")
    public YieldRecordDTO getById(@PathVariable Long id) { return yieldRecordService.findById(id); }

    @PostMapping
    public ResponseEntity<YieldRecordDTO> create(@Valid @RequestBody YieldRecordCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(yieldRecordService.create(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        yieldRecordService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
