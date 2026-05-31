package com.farmckp.orchard.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VarietyDTO {
    private Long id;

    @NotBlank
    private String name;
}
