package com.ayonproject.irm_mngt_system.repository;

import com.ayonproject.irm_mngt_system.entity.SubSectionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubSectionRepository extends JpaRepository<SubSectionEntity, Long> {
}
