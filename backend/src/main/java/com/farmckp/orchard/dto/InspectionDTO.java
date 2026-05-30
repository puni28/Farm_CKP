package com.farmckp.orchard.dto;

import com.farmckp.orchard.entity.Tree;
import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InspectionDTO {
    private Long id;
    private Long treeId;
    private Integer treeRow;
    private Integer treeColumn;
    private LocalDate inspectionDate;
    private Tree.TreeStatus status;
    private Integer healthScore;
    private Boolean diseaseObserved;
    private Boolean pestObserved;
    private Boolean irrigationIssue;
    private String canopyCondition;
    private String trunkCondition;
    private String notes;
}
