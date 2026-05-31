package com.farmckp.orchard.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "yield_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class YieldRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tree_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Tree tree;

    private Integer seasonYear;
    private Double estimatedYieldKg;
    private Double actualYieldKg;
    private LocalDate harvestDate;

    @Column(length = 500)
    private String remarks;
}
