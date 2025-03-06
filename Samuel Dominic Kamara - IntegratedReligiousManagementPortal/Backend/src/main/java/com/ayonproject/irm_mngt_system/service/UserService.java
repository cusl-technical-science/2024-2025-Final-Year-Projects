
package com.ayonproject.irm_mngt_system.service;

import com.ayonproject.irm_mngt_system.entity.SubSectionEntity;
import com.ayonproject.irm_mngt_system.model.User;

import java.util.List;

public interface UserService {
    User saveUser(User user);

    List<User> getAllUsers();

    User getUserById(Long id);

    boolean deleteUser(Long id);

    User updateUser(Long id, User user);

    long countUsers();

    String authenticateUser(String emailId, String password);

    String getUserRole(String emailId);

    User getUserByEmail(String emailId);

    User updateUserProfile(String emailId, User updatedUser);

    boolean existsByEmailId(String emailId);

    // SubSection methods
    SubSectionEntity saveSubSection(SubSectionEntity subSection, Long userId);

    List<SubSectionEntity> getSubSectionsByUser(Long userId);

    List<SubSectionEntity> getAllSubSections();

    SubSectionEntity updateSubSection(Long subSectionId, SubSectionEntity updatedSubSection);

    boolean deleteSubSection(Long subSectionId);

}
