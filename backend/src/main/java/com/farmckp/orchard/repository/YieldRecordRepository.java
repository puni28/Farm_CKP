package com.farmckp.orchard.repository;

import com.farmckp.orchard.entity.YieldRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface YieldRecordRepository extends JpaRepository<YieldRecord, Long> {
    List<YieldRecord> findByTreeIdOrderBySeasonYearDesc(Long treeId);
    List<YieldRecord> findByTreeOrchardIdOrderBySeasonYearDesc(Long orchardId);
}
