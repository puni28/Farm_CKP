package com.farmckp.orchard.repository;

import com.farmckp.orchard.entity.Tree;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TreeRepository extends JpaRepository<Tree, Long> {
    List<Tree> findByOrchardId(Long orchardId);
    List<Tree> findByOrchardIdAndStatus(Long orchardId, Tree.TreeStatus status);
    List<Tree> findByStatus(Tree.TreeStatus status);
    Optional<Tree> findByOrchardIdAndRowNumberAndColumnNumber(Long orchardId, int row, int col);

    @Query("SELECT t FROM Tree t WHERE t.orchard.id = :orchardId " +
           "AND (:status IS NULL OR t.status = :status) " +
           "AND (:rowNumber IS NULL OR t.rowNumber = :rowNumber) " +
           "AND (:columnNumber IS NULL OR t.columnNumber = :columnNumber) " +
           "AND (:variety IS NULL OR t.variety LIKE CONCAT('%', :variety, '%')) " +
           "AND (:minHealthScore IS NULL OR t.healthScore >= :minHealthScore)")
    List<Tree> findWithFilters(
        @Param("orchardId") Long orchardId,
        @Param("status") Tree.TreeStatus status,
        @Param("rowNumber") Integer rowNumber,
        @Param("columnNumber") Integer columnNumber,
        @Param("variety") String variety,
        @Param("minHealthScore") Integer minHealthScore
    );

    @Query("SELECT COUNT(t) FROM Tree t WHERE t.status = :status")
    Long countByStatus(@Param("status") Tree.TreeStatus status);

    @Query("SELECT AVG(t.healthScore) FROM Tree t")
    Double averageHealthScore();

    @Query("SELECT SUM(t.currentSeasonYieldKg) FROM Tree t WHERE t.currentSeasonYieldKg IS NOT NULL")
    Double totalCurrentSeasonYield();
}
