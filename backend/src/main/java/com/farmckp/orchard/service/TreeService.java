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
public class TreeService {

    private final TreeRepository treeRepository;
    private final OrchardRepository orchardRepository;

    public List<TreeDTO> findByOrchard(Long orchardId) {
        return treeRepository.findByOrchardId(orchardId).stream().map(this::toDTO).toList();
    }

    public List<TreeDTO> findWithFilters(Long orchardId, Tree.TreeStatus status, Integer row, Integer col, String variety, Integer minHealth) {
        return treeRepository.findWithFilters(orchardId, status, row, col, variety, minHealth)
            .stream().map(this::toDTO).toList();
    }

    public TreeDTO findById(Long id) {
        return treeRepository.findById(id).map(this::toDTO)
            .orElseThrow(() -> new ResourceNotFoundException("Tree not found: " + id));
    }

    @Transactional
    public TreeDTO create(TreeCreateDTO dto) {
        Orchard orchard = orchardRepository.findById(dto.getOrchardId())
            .orElseThrow(() -> new ResourceNotFoundException("Orchard not found: " + dto.getOrchardId()));
        Tree tree = Tree.builder()
            .orchard(orchard)
            .rowNumber(dto.getRowNumber())
            .columnNumber(dto.getColumnNumber())
            .variety(dto.getVariety())
            .plantingDate(dto.getPlantingDate())
            .status(dto.getStatus())
            .healthScore(dto.getHealthScore())
            .lastInspectionDate(dto.getLastInspectionDate())
            .currentSeasonYieldKg(dto.getCurrentSeasonYieldKg())
            .totalLifetimeYieldKg(dto.getTotalLifetimeYieldKg())
            .notes(dto.getNotes())
            .build();
        return toDTO(treeRepository.save(tree));
    }

    @Transactional
    public TreeDTO update(Long id, TreeCreateDTO dto) {
        Tree tree = treeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Tree not found: " + id));
        Orchard orchard = orchardRepository.findById(dto.getOrchardId())
            .orElseThrow(() -> new ResourceNotFoundException("Orchard not found: " + dto.getOrchardId()));
        tree.setOrchard(orchard);
        tree.setRowNumber(dto.getRowNumber());
        tree.setColumnNumber(dto.getColumnNumber());
        tree.setVariety(dto.getVariety());
        tree.setPlantingDate(dto.getPlantingDate());
        tree.setStatus(dto.getStatus());
        tree.setHealthScore(dto.getHealthScore());
        tree.setLastInspectionDate(dto.getLastInspectionDate());
        tree.setCurrentSeasonYieldKg(dto.getCurrentSeasonYieldKg());
        tree.setTotalLifetimeYieldKg(dto.getTotalLifetimeYieldKg());
        tree.setNotes(dto.getNotes());
        return toDTO(treeRepository.save(tree));
    }

    public void delete(Long id) {
        if (!treeRepository.existsById(id)) throw new ResourceNotFoundException("Tree not found: " + id);
        treeRepository.deleteById(id);
    }

    public DashboardStatsDTO getDashboardStats() {
        long total = treeRepository.count();
        long healthy = treeRepository.countByStatus(Tree.TreeStatus.HEALTHY);
        long needsAttention = treeRepository.countByStatus(Tree.TreeStatus.NEEDS_ATTENTION);
        long diseased = treeRepository.countByStatus(Tree.TreeStatus.DISEASED);
        long dead = treeRepository.countByStatus(Tree.TreeStatus.DEAD);
        Double avgHealth = treeRepository.averageHealthScore();
        Double totalYield = treeRepository.totalCurrentSeasonYield();

        List<TreeDTO> lowHealth = treeRepository.findByStatus(Tree.TreeStatus.NEEDS_ATTENTION)
            .stream().map(this::toDTO).limit(5).toList();

        return DashboardStatsDTO.builder()
            .totalTrees(total)
            .healthyTrees(healthy)
            .needsAttentionTrees(needsAttention)
            .diseasedTrees(diseased)
            .deadTrees(dead)
            .averageHealthScore(avgHealth != null ? Math.round(avgHealth * 10.0) / 10.0 : 0.0)
            .totalCurrentSeasonYieldKg(totalYield != null ? totalYield : 0.0)
            .treesNeedingAttention(needsAttention + diseased)
            .lowHealthTrees(lowHealth)
            .build();
    }

    public TreeDTO toDTO(Tree t) {
        return TreeDTO.builder()
            .id(t.getId())
            .orchardId(t.getOrchard().getId())
            .orchardName(t.getOrchard().getName())
            .rowNumber(t.getRowNumber())
            .columnNumber(t.getColumnNumber())
            .variety(t.getVariety())
            .plantingDate(t.getPlantingDate())
            .status(t.getStatus())
            .healthScore(t.getHealthScore())
            .lastInspectionDate(t.getLastInspectionDate())
            .currentSeasonYieldKg(t.getCurrentSeasonYieldKg())
            .totalLifetimeYieldKg(t.getTotalLifetimeYieldKg())
            .notes(t.getNotes())
            .build();
    }
}
