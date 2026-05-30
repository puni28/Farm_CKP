package com.farmckp.orchard.dto;

import com.farmckp.orchard.entity.Tree;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InspectionCreateDTO {
    @NotNull
    private Long treeId;

    @NotNull
    private LocalDate inspectionDate;

    @NotNull
    private Tree.TreeStatus status;

    @NotNull @Min(0) @Max(100)
    private Integer healthScore;

    private Boolean diseaseObserved;
    private Boolean pestObserved;
    private Boolean irrigationIssue;
    private String canopyCondition;
    private String trunkCondition;
    private String notes;
}
