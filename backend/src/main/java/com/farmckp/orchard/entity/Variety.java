package com.farmckp.orchard.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "varieties")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Variety {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;
}
