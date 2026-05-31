package com.farmckp.orchard.dto;

import com.farmckp.orchard.entity.Tree;
import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TreeDTO {
    private Long id;
    private Long orchardId;
    private String orchardName;
    private Integer rowNumber;
    private Integer columnNumber;
    private String variety;
    private LocalDate plantingDate;
    private Tree.TreeStatus status;
    private Integer healthScore;
    private LocalDate lastInspectionDate;
    private Double currentSeasonYieldKg;
    private Double totalLifetimeYieldKg;
    private String notes;
}
