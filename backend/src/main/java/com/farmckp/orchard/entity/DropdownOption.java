package com.farmckp.orchard.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "dropdown_options", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"category", "value"})
})
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class DropdownOption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String value;

    @Column(nullable = false)
    private Integer sortOrder;
}
