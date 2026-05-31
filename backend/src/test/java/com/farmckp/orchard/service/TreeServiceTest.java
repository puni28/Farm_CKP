package com.farmckp.orchard.service;

import com.farmckp.orchard.dto.TreeCreateDTO;
import com.farmckp.orchard.dto.TreeDTO;
import com.farmckp.orchard.entity.Orchard;
import com.farmckp.orchard.entity.Tree;
import com.farmckp.orchard.repository.OrchardRepository;
import com.farmckp.orchard.repository.TreeRepository;
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
class TreeServiceTest {

    @Autowired TreeService treeService;
    @Autowired OrchardRepository orchardRepository;
    @Autowired TreeRepository treeRepository;

    private Orchard orchard;

    @BeforeEach
    void setUp() {
        orchard = orchardRepository.save(Orchard.builder()
            .name("Test Orchard")
            .location("Test Location")
            .totalRows(5)
            .totalColumns(5)
            .build());
    }

    @Test
    void createTree_shouldPersistAndReturnDTO() {
        TreeCreateDTO dto = TreeCreateDTO.builder()
            .orchardId(orchard.getId())
            .rowNumber(1)
            .columnNumber(1)
            .variety("Alphonso")
            .plantingDate(LocalDate.of(2015, 3, 10))
            .status(Tree.TreeStatus.HEALTHY)
            .healthScore(90)
            .build();

        TreeDTO result = treeService.create(dto);

        assertThat(result.getId()).isNotNull();
        assertThat(result.getVariety()).isEqualTo("Alphonso");
        assertThat(result.getStatus()).isEqualTo(Tree.TreeStatus.HEALTHY);
        assertThat(result.getHealthScore()).isEqualTo(90);
    }

    @Test
    void findByOrchard_shouldReturnAllTrees() {
        for (int i = 1; i <= 3; i++) {
            treeRepository.save(Tree.builder()
                .orchard(orchard)
                .rowNumber(1)
                .columnNumber(i)
                .status(Tree.TreeStatus.HEALTHY)
                .healthScore(80)
                .build());
        }

        List<TreeDTO> trees = treeService.findByOrchard(orchard.getId());
        assertThat(trees).hasSize(3);
    }

    @Test
    void getDashboardStats_shouldReturnCorrectCounts() {
        treeRepository.save(Tree.builder().orchard(orchard).rowNumber(1).columnNumber(1)
            .status(Tree.TreeStatus.HEALTHY).healthScore(90).build());
        treeRepository.save(Tree.builder().orchard(orchard).rowNumber(1).columnNumber(2)
            .status(Tree.TreeStatus.DEAD).healthScore(0).build());
        treeRepository.save(Tree.builder().orchard(orchard).rowNumber(1).columnNumber(3)
            .status(Tree.TreeStatus.DISEASED).healthScore(30).build());

        var stats = treeService.getDashboardStats();

        assertThat(stats.getTotalTrees()).isGreaterThanOrEqualTo(3);
        assertThat(stats.getHealthyTrees()).isGreaterThanOrEqualTo(1);
        assertThat(stats.getDeadTrees()).isGreaterThanOrEqualTo(1);
    }
}
