package com.farmckp.orchard.service;

import com.farmckp.orchard.dto.VarietyDTO;
import com.farmckp.orchard.entity.Variety;
import com.farmckp.orchard.exception.ResourceNotFoundException;
import com.farmckp.orchard.repository.VarietyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VarietyService {

    private final VarietyRepository varietyRepository;

    public List<VarietyDTO> findAll() {
        return varietyRepository.findAll().stream().map(this::toDTO).toList();
    }

    public VarietyDTO findById(Long id) {
        return varietyRepository.findById(id).map(this::toDTO)
            .orElseThrow(() -> new ResourceNotFoundException("Variety not found: " + id));
    }

    public VarietyDTO create(VarietyDTO dto) {
        if (varietyRepository.existsByNameIgnoreCase(dto.getName())) {
            throw new IllegalArgumentException("Variety already exists: " + dto.getName());
        }
        Variety v = Variety.builder().name(dto.getName().trim()).build();
        return toDTO(varietyRepository.save(v));
    }

    public VarietyDTO update(Long id, VarietyDTO dto) {
        Variety v = varietyRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Variety not found: " + id));
        v.setName(dto.getName().trim());
        return toDTO(varietyRepository.save(v));
    }

    public void delete(Long id) {
        if (!varietyRepository.existsById(id))
            throw new ResourceNotFoundException("Variety not found: " + id);
        varietyRepository.deleteById(id);
    }

    private VarietyDTO toDTO(Variety v) {
        return VarietyDTO.builder().id(v.getId()).name(v.getName()).build();
    }
}
