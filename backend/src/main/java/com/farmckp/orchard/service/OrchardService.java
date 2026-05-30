package com.farmckp.orchard.service;

import com.farmckp.orchard.dto.OrchardDTO;
import com.farmckp.orchard.entity.Orchard;
import com.farmckp.orchard.exception.ResourceNotFoundException;
import com.farmckp.orchard.repository.OrchardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrchardService {

    private final OrchardRepository orchardRepository;

    public List<OrchardDTO> findAll() {
        return orchardRepository.findAll().stream().map(this::toDTO).toList();
    }

    public OrchardDTO findById(Long id) {
        return orchardRepository.findById(id).map(this::toDTO)
            .orElseThrow(() -> new ResourceNotFoundException("Orchard not found: " + id));
    }

    public OrchardDTO create(OrchardDTO dto) {
        Orchard orchard = Orchard.builder()
            .name(dto.getName())
            .location(dto.getLocation())
            .description(dto.getDescription())
            .totalRows(dto.getTotalRows())
            .totalColumns(dto.getTotalColumns())
            .establishedDate(dto.getEstablishedDate())
            .build();
        return toDTO(orchardRepository.save(orchard));
    }

    public OrchardDTO update(Long id, OrchardDTO dto) {
        Orchard orchard = orchardRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Orchard not found: " + id));
        orchard.setName(dto.getName());
        orchard.setLocation(dto.getLocation());
        orchard.setDescription(dto.getDescription());
        orchard.setTotalRows(dto.getTotalRows());
        orchard.setTotalColumns(dto.getTotalColumns());
        orchard.setEstablishedDate(dto.getEstablishedDate());
        return toDTO(orchardRepository.save(orchard));
    }

    public void delete(Long id) {
        if (!orchardRepository.existsById(id)) throw new ResourceNotFoundException("Orchard not found: " + id);
        orchardRepository.deleteById(id);
    }

    private OrchardDTO toDTO(Orchard o) {
        return OrchardDTO.builder()
            .id(o.getId())
            .name(o.getName())
            .location(o.getLocation())
            .description(o.getDescription())
            .totalRows(o.getTotalRows())
            .totalColumns(o.getTotalColumns())
            .establishedDate(o.getEstablishedDate())
            .treeCount(o.getTrees() != null ? o.getTrees().size() : 0)
            .build();
    }
}
