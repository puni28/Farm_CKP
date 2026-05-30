package com.farmckp.orchard.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "orchards")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Orchard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String location;
    private String description;
    private Integer totalRows;
    private Integer totalColumns;
    private LocalDate establishedDate;

    @OneToMany(mappedBy = "orchard", cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Tree> trees;
}
