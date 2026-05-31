package com.farmckp.orchard.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class YieldRecordCreateDTO {
    @NotNull
    private Long treeId;

    @NotNull @Min(2000) @Max(2100)
    private Integer seasonYear;

    private Double estimatedYieldKg;
    private Double actualYieldKg;
    private LocalDate harvestDate;
    private String remarks;
}
