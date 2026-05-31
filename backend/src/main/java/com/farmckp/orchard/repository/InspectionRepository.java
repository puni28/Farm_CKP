package com.farmckp.orchard.repository;

import com.farmckp.orchard.entity.Inspection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InspectionRepository extends JpaRepository<Inspection, Long> {
    List<Inspection> findByTreeIdOrderByInspectionDateDesc(Long treeId);
    List<Inspection> findByTreeOrchardIdOrderByInspectionDateDesc(Long orchardId);
}
