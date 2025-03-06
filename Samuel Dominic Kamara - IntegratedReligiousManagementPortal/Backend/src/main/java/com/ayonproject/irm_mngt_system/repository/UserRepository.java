package com.ayonproject.irm_mngt_system.repository;

import com.ayonproject.irm_mngt_system.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByEmailId(String emailId);
    boolean existsByEmailId(String emailId);
}
