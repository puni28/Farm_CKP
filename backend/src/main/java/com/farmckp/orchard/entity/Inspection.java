package com.farmckp.orchard.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "inspections")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inspection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tree_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Tree tree;

    @Column(nullable = false)
    private LocalDate inspectionDate;

    @Enumerated(EnumType.STRING)
    private Tree.TreeStatus status;

    private Integer healthScore;
    private Boolean diseaseObserved;
    private Boolean pestObserved;
    private Boolean irrigationIssue;
    private String canopyCondition;
    private String trunkCondition;

    @Column(length = 1000)
    private String notes;
}
