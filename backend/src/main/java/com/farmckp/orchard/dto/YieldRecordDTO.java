package com.farmckp.orchard.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class YieldRecordDTO {
    private Long id;
    private Long treeId;
    private Integer treeRow;
    private Integer treeColumn;
    private Integer seasonYear;
    private Double estimatedYieldKg;
    private Double actualYieldKg;
    private LocalDate harvestDate;
    private String remarks;
}
