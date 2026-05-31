package com.farmckp.orchard.repository;

import com.farmckp.orchard.entity.DropdownOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DropdownOptionRepository extends JpaRepository<DropdownOption, Long> {
    List<DropdownOption> findByCategoryOrderBySortOrderAsc(String category);
    List<DropdownOption> findAllByOrderByCategoryAscSortOrderAsc();
    boolean existsByCategoryAndValueIgnoreCase(String category, String value);
}
