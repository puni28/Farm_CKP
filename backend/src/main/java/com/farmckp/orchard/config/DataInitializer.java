package com.farmckp.orchard.config;

import com.farmckp.orchard.entity.*;
import com.farmckp.orchard.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Random;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final OrchardRepository orchardRepository;
    private final TreeRepository treeRepository;
    private final InspectionRepository inspectionRepository;
    private final YieldRecordRepository yieldRecordRepository;

    @Override
    public void run(String... args) {
        if (orchardRepository.count() > 0) return;

        Orchard orchard = orchardRepository.save(Orchard.builder()
            .name("CKP Mango Orchard")
            .location("Chikkaballapur, Karnataka")
            .description("Main mango orchard with Alphonso and Kesar varieties")
            .totalRows(10)
            .totalColumns(12)
            .establishedDate(LocalDate.of(2010, 3, 15))
            .build());

        String[] varieties = {"Alphonso", "Kesar", "Dasheri", "Langra", "Totapuri"};
        Tree.TreeStatus[] statuses = {
            Tree.TreeStatus.HEALTHY, Tree.TreeStatus.HEALTHY, Tree.TreeStatus.HEALTHY,
            Tree.TreeStatus.NEEDS_ATTENTION, Tree.TreeStatus.DISEASED, Tree.TreeStatus.DEAD
        };
        Random rnd = new Random(42);

        for (int row = 1; row <= 10; row++) {
            for (int col = 1; col <= 12; col++) {
                Tree.TreeStatus status = statuses[rnd.nextInt(statuses.length)];
                int healthScore = switch (status) {
                    case HEALTHY -> 75 + rnd.nextInt(26);
                    case NEEDS_ATTENTION -> 45 + rnd.nextInt(25);
                    case DISEASED -> 20 + rnd.nextInt(25);
                    case DEAD -> 0;
                };
                double yield = status == Tree.TreeStatus.DEAD ? 0 : 15 + rnd.nextDouble() * 35;

                Tree tree = treeRepository.save(Tree.builder()
                    .orchard(orchard)
                    .rowNumber(row)
                    .columnNumber(col)
                    .variety(varieties[rnd.nextInt(varieties.length)])
                    .plantingDate(LocalDate.of(2010 + rnd.nextInt(5), 1 + rnd.nextInt(12), 1 + rnd.nextInt(28)))
                    .status(status)
                    .healthScore(healthScore)
                    .lastInspectionDate(LocalDate.now().minusDays(rnd.nextInt(60)))
                    .currentSeasonYieldKg(status != Tree.TreeStatus.DEAD ? yield : 0.0)
                    .totalLifetimeYieldKg(status != Tree.TreeStatus.DEAD ? yield * (3 + rnd.nextInt(5)) : 0.0)
                    .notes(status == Tree.TreeStatus.NEEDS_ATTENTION ? "Leaves showing yellowing, check irrigation" :
                           status == Tree.TreeStatus.DISEASED ? "Anthracnose disease detected, treatment in progress" :
                           status == Tree.TreeStatus.DEAD ? "Tree removed from production" : null)
                    .build());

                // Add inspections for each tree
                for (int i = 0; i < 3; i++) {
                    inspectionRepository.save(Inspection.builder()
                        .tree(tree)
                        .inspectionDate(LocalDate.now().minusDays(i * 30L + rnd.nextInt(15)))
                        .status(status)
                        .healthScore(healthScore - i * 3)
                        .diseaseObserved(status == Tree.TreeStatus.DISEASED)
                        .pestObserved(rnd.nextBoolean())
                        .irrigationIssue(status == Tree.TreeStatus.NEEDS_ATTENTION && rnd.nextBoolean())
                        .canopyCondition(status == Tree.TreeStatus.HEALTHY ? "Dense and green" : "Sparse, some leaf drop")
                        .trunkCondition("No visible damage")
                        .notes("Routine inspection")
                        .build());
                }

                // Add yield records
                for (int year = 2022; year <= 2025; year++) {
                    double est = 20 + rnd.nextDouble() * 30;
                    double actual = est * (0.7 + rnd.nextDouble() * 0.5);
                    yieldRecordRepository.save(YieldRecord.builder()
                        .tree(tree)
                        .seasonYear(year)
                        .estimatedYieldKg(est)
                        .actualYieldKg(status != Tree.TreeStatus.DEAD ? actual : 0.0)
                        .harvestDate(LocalDate.of(year, 5, 1 + rnd.nextInt(30)))
                        .remarks(year == 2025 ? "Current season" : "Good yield")
                        .build());
                }
            }
        }
    }
}
