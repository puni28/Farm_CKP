package com.farmckp.orchard.service;

import com.farmckp.orchard.dto.InspectionCreateDTO;
import com.farmckp.orchard.dto.InspectionDTO;
import com.farmckp.orchard.entity.*;
import com.farmckp.orchard.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class InspectionServiceTest {

    @Autowired InspectionService inspectionService;
    @Autowired OrchardRepository orchardRepository;
    @Autowired TreeRepository treeRepository;

    private Tree tree;

    @BeforeEach
    void setUp() {
        Orchard orchard = orchardRepository.save(Orchard.builder()
            .name("Test Orchard").location("Test").totalRows(5).totalColumns(5).build());
        tree = treeRepository.save(Tree.builder()
            .orchard(orchard).rowNumber(1).columnNumber(1)
            .status(Tree.TreeStatus.HEALTHY).healthScore(80).build());
    }

    @Test
    void createInspection_shouldUpdateTreeStatus() {
        InspectionCreateDTO dto = InspectionCreateDTO.builder()
            .treeId(tree.getId())
            .inspectionDate(LocalDate.now())
            .status(Tree.TreeStatus.DISEASED)
            .healthScore(40)
            .diseaseObserved(true)
            .pestObserved(false)
            .irrigationIssue(false)
            .build();

        InspectionDTO result = inspectionService.create(dto);

        assertThat(result.getId()).isNotNull();
        assertThat(result.getStatus()).isEqualTo(Tree.TreeStatus.DISEASED);
        assertThat(result.getHealthScore()).isEqualTo(40);

        Tree updated = treeRepository.findById(tree.getId()).orElseThrow();
        assertThat(updated.getStatus()).isEqualTo(Tree.TreeStatus.DISEASED);
        assertThat(updated.getHealthScore()).isEqualTo(40);
    }

    @Test
    void findByTree_shouldReturnInspectionsOrderedByDate() {
        for (int i = 0; i < 3; i++) {
            InspectionCreateDTO dto = InspectionCreateDTO.builder()
                .treeId(tree.getId())
                .inspectionDate(LocalDate.now().minusDays(i * 10L))
                .status(Tree.TreeStatus.HEALTHY)
                .healthScore(85)
                .build();
            inspectionService.create(dto);
        }

        List<InspectionDTO> results = inspectionService.findByTree(tree.getId());
        assertThat(results).hasSize(3);
        assertThat(results.get(0).getInspectionDate())
            .isAfterOrEqualTo(results.get(1).getInspectionDate());
    }
}
