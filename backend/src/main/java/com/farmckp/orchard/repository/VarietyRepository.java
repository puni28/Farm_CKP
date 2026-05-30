package com.farmckp.orchard.repository;

import com.farmckp.orchard.entity.Variety;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VarietyRepository extends JpaRepository<Variety, Long> {
    Optional<Variety> findByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCase(String name);
}
