package com.farmckp.orchard.dto;

import com.farmckp.orchard.entity.Tree;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TreeCreateDTO {
    @NotNull
    private Long orchardId;

    @NotNull @Min(1)
    private Integer rowNumber;

    @NotNull @Min(1)
    private Integer columnNumber;

    private String variety;
    private LocalDate plantingDate;

    @NotNull
    private Tree.TreeStatus status;

    @NotNull @Min(0) @Max(100)
    private Integer healthScore;

    private LocalDate lastInspectionDate;
    private Double currentSeasonYieldKg;
    private Double totalLifetimeYieldKg;
    private String notes;
}
