package com.farmckp.orchard.service;

import com.farmckp.orchard.dto.*;
import com.farmckp.orchard.entity.*;
import com.farmckp.orchard.exception.ResourceNotFoundException;
import com.farmckp.orchard.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class YieldRecordService {

    private final YieldRecordRepository yieldRecordRepository;
    private final TreeRepository treeRepository;

    public List<YieldRecordDTO> findByTree(Long treeId) {
        return yieldRecordRepository.findByTreeIdOrderBySeasonYearDesc(treeId)
            .stream().map(this::toDTO).toList();
    }

    public YieldRecordDTO findById(Long id) {
        return yieldRecordRepository.findById(id).map(this::toDTO)
            .orElseThrow(() -> new ResourceNotFoundException("Yield record not found: " + id));
    }

    @Transactional
    public YieldRecordDTO create(YieldRecordCreateDTO dto) {
        Tree tree = treeRepository.findById(dto.getTreeId())
            .orElseThrow(() -> new ResourceNotFoundException("Tree not found: " + dto.getTreeId()));

        YieldRecord record = YieldRecord.builder()
            .tree(tree)
            .seasonYear(dto.getSeasonYear())
            .estimatedYieldKg(dto.getEstimatedYieldKg())
            .actualYieldKg(dto.getActualYieldKg())
            .harvestDate(dto.getHarvestDate())
            .remarks(dto.getRemarks())
            .build();

        YieldRecord saved = yieldRecordRepository.save(record);

        // Update tree current season yield if this year
        if (dto.getSeasonYear() == java.time.LocalDate.now().getYear() && dto.getActualYieldKg() != null) {
            tree.setCurrentSeasonYieldKg(dto.getActualYieldKg());
            Double total = (tree.getTotalLifetimeYieldKg() != null ? tree.getTotalLifetimeYieldKg() : 0.0) + dto.getActualYieldKg();
            tree.setTotalLifetimeYieldKg(total);
            treeRepository.save(tree);
        }

        return toDTO(saved);
    }

    public void delete(Long id) {
        if (!yieldRecordRepository.existsById(id)) throw new ResourceNotFoundException("Yield record not found: " + id);
        yieldRecordRepository.deleteById(id);
    }

    private YieldRecordDTO toDTO(YieldRecord r) {
        return YieldRecordDTO.builder()
            .id(r.getId())
            .treeId(r.getTree().getId())
            .treeRow(r.getTree().getRowNumber())
            .treeColumn(r.getTree().getColumnNumber())
            .seasonYear(r.getSeasonYear())
            .estimatedYieldKg(r.getEstimatedYieldKg())
            .actualYieldKg(r.getActualYieldKg())
            .harvestDate(r.getHarvestDate())
            .remarks(r.getRemarks())
            .build();
    }
}
