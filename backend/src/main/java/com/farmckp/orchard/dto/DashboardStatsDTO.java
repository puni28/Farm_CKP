package com.farmckp.orchard.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDTO {
    private Long totalTrees;
    private Long healthyTrees;
    private Long needsAttentionTrees;
    private Long diseasedTrees;
    private Long deadTrees;
    private Double averageHealthScore;
    private Double totalCurrentSeasonYieldKg;
    private Long treesNeedingAttention;
    private List<TreeDTO> recentlyInspected;
    private List<TreeDTO> lowHealthTrees;
}
