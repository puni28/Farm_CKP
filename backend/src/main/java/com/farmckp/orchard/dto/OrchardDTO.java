package com.farmckp.orchard.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrchardDTO {
    private Long id;
    private String name;
    private String location;
    private String description;
    private Integer totalRows;
    private Integer totalColumns;
    private LocalDate establishedDate;
    private Integer treeCount;
}
