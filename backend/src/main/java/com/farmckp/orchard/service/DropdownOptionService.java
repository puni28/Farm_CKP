package com.farmckp.orchard.service;

import com.farmckp.orchard.dto.DropdownOptionDTO;
import com.farmckp.orchard.entity.DropdownOption;
import com.farmckp.orchard.exception.ResourceNotFoundException;
import com.farmckp.orchard.repository.DropdownOptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DropdownOptionService {

    private final DropdownOptionRepository repo;

    public List<DropdownOptionDTO> findAll() {
        return repo.findAllByOrderByCategoryAscSortOrderAsc().stream().map(this::toDTO).toList();
    }

    public List<DropdownOptionDTO> findByCategory(String category) {
        return repo.findByCategoryOrderBySortOrderAsc(category).stream().map(this::toDTO).toList();
    }

    public DropdownOptionDTO create(String category, DropdownOptionDTO dto) {
        if (repo.existsByCategoryAndValueIgnoreCase(category, dto.getValue())) {
            throw new IllegalArgumentException("Option already exists: " + dto.getValue());
        }
        long count = repo.findByCategoryOrderBySortOrderAsc(category).size();
        DropdownOption opt = DropdownOption.builder()
            .category(category)
            .value(dto.getValue().trim())
            .sortOrder((int) count + 1)
            .build();
        return toDTO(repo.save(opt));
    }

    public DropdownOptionDTO update(Long id, DropdownOptionDTO dto) {
        DropdownOption opt = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Option not found: " + id));
        opt.setValue(dto.getValue().trim());
        return toDTO(repo.save(opt));
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) throw new ResourceNotFoundException("Option not found: " + id);
        repo.deleteById(id);
    }

    private DropdownOptionDTO toDTO(DropdownOption o) {
        return DropdownOptionDTO.builder()
            .id(o.getId()).category(o.getCategory())
            .value(o.getValue()).sortOrder(o.getSortOrder())
            .build();
    }
}
