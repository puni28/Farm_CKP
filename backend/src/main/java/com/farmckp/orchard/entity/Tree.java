package com.farmckp.orchard.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "trees")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tree {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orchard_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Orchard orchard;

    @Column(nullable = false)
    private Integer rowNumber;

    @Column(nullable = false)
    private Integer columnNumber;

    private String variety;
    private LocalDate plantingDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TreeStatus status;

    @Column(nullable = false)
    private Integer healthScore;

    private LocalDate lastInspectionDate;
    private Double currentSeasonYieldKg;
    private Double totalLifetimeYieldKg;

    @Column(length = 1000)
    private String notes;

    @OneToMany(mappedBy = "tree", cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Inspection> inspections;

    @OneToMany(mappedBy = "tree", cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<YieldRecord> yieldRecords;

    public enum TreeStatus {
        HEALTHY, NEEDS_ATTENTION, DISEASED, DEAD
    }
}
