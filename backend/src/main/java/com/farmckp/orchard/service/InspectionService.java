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
public class InspectionService {

    private final InspectionRepository inspectionRepository;
    private final TreeRepository treeRepository;

    public List<InspectionDTO> findByTree(Long treeId) {
        return inspectionRepository.findByTreeIdOrderByInspectionDateDesc(treeId)
            .stream().map(this::toDTO).toList();
    }

    public InspectionDTO findById(Long id) {
        return inspectionRepository.findById(id).map(this::toDTO)
            .orElseThrow(() -> new ResourceNotFoundException("Inspection not found: " + id));
    }

    @Transactional
    public InspectionDTO create(InspectionCreateDTO dto) {
        Tree tree = treeRepository.findById(dto.getTreeId())
            .orElseThrow(() -> new ResourceNotFoundException("Tree not found: " + dto.getTreeId()));

        Inspection inspection = Inspection.builder()
            .tree(tree)
            .inspectionDate(dto.getInspectionDate())
            .status(dto.getStatus())
            .healthScore(dto.getHealthScore())
            .diseaseObserved(dto.getDiseaseObserved())
            .pestObserved(dto.getPestObserved())
            .irrigationIssue(dto.getIrrigationIssue())
            .canopyCondition(dto.getCanopyCondition())
            .trunkCondition(dto.getTrunkCondition())
            .notes(dto.getNotes())
            .build();

        inspectionRepository.save(inspection);

        // Update tree's status and health score after inspection
        tree.setStatus(dto.getStatus());
        tree.setHealthScore(dto.getHealthScore());
        tree.setLastInspectionDate(dto.getInspectionDate());
        treeRepository.save(tree);

        return toDTO(inspection);
    }

    public void delete(Long id) {
        if (!inspectionRepository.existsById(id)) throw new ResourceNotFoundException("Inspection not found: " + id);
        inspectionRepository.deleteById(id);
    }

    private InspectionDTO toDTO(Inspection i) {
        return InspectionDTO.builder()
            .id(i.getId())
            .treeId(i.getTree().getId())
            .treeRow(i.getTree().getRowNumber())
            .treeColumn(i.getTree().getColumnNumber())
            .inspectionDate(i.getInspectionDate())
            .status(i.getStatus())
            .healthScore(i.getHealthScore())
            .diseaseObserved(i.getDiseaseObserved())
            .pestObserved(i.getPestObserved())
            .irrigationIssue(i.getIrrigationIssue())
            .canopyCondition(i.getCanopyCondition())
            .trunkCondition(i.getTrunkCondition())
            .notes(i.getNotes())
            .build();
    }
}
