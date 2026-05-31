package com.farmckp.orchard.repository;

import com.farmckp.orchard.entity.Orchard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrchardRepository extends JpaRepository<Orchard, Long> {}
