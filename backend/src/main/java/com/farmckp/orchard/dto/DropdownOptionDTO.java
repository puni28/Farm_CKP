package com.farmckp.orchard.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class DropdownOptionDTO {
    private Long id;
    private String category;
    @NotBlank
    private String value;
    private Integer sortOrder;
}
