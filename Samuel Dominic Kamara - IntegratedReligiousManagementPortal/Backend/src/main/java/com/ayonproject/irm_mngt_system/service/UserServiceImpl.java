
package com.ayonproject.irm_mngt_system.service;

import com.ayonproject.irm_mngt_system.entity.SubSectionEntity;
import com.ayonproject.irm_mngt_system.entity.UserEntity;
import com.ayonproject.irm_mngt_system.model.User;
import com.ayonproject.irm_mngt_system.repository.SubSectionRepository;
import com.ayonproject.irm_mngt_system.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final SubSectionRepository subSectionRepository;

    public UserServiceImpl(UserRepository userRepository, SubSectionRepository subSectionRepository) {
        this.userRepository = userRepository;
        this.subSectionRepository = subSectionRepository;
    }

    @Override
    public User saveUser(User user) {
        if (existsByEmailId(user.getEmailId())) {
            throw new RuntimeException("Email already exists. Please use a different email.");
        }

        UserEntity userEntity = new UserEntity();
        BeanUtils.copyProperties(user, userEntity);

        if (userEntity.getRole() == null || userEntity.getRole().isEmpty()) {
            userEntity.setRole("Affiliate");
        }

        userRepository.save(userEntity);
        return user;
    }

    @Override
    public boolean existsByEmailId(String emailId) {
        return userRepository.existsByEmailId(emailId);
    }

    @Override
    public List<User> getAllUsers() {
        List<UserEntity> userEntities = userRepository.findAll();
        return userEntities.stream().map(userEntity -> {
            User user = new User();
            BeanUtils.copyProperties(userEntity, user);
            return user;
        }).collect(Collectors.toList());
    }

    @Override
    public User getUserById(Long id) {
        UserEntity userEntity = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User user = new User();
        BeanUtils.copyProperties(userEntity, user);
        return user;
    }

    @Override
    public boolean deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            System.err.println("User with ID " + id + " does not exist in the database");
            throw new RuntimeException("User not found");
        }
        System.out.println("Deleting user with ID: " + id); // Debug log
        userRepository.deleteById(id);
        return true;
    }




    @Override
    public User updateUser(Long id, User user) {
        UserEntity userEntity = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        BeanUtils.copyProperties(user, userEntity, "id");
        userRepository.save(userEntity);
        return user;
    }

    @Override
    public long countUsers() {
        return userRepository.count();
    }

    @Override
    public String authenticateUser(String emailId, String password) {
        Optional<UserEntity> userEntity = userRepository.findByEmailId(emailId);

        if (userEntity.isPresent() && userEntity.get().getPassword().equals(password)) {
            return "valid-token";
        }

        return null;
    }

    @Override
    public String getUserRole(String emailId) {
        UserEntity userEntity = userRepository.findByEmailId(emailId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userEntity.getRole();
    }

    @Override
    public User getUserByEmail(String emailId) {
        UserEntity userEntity = userRepository.findByEmailId(emailId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User user = new User();
        BeanUtils.copyProperties(userEntity, user);
        return user;
    }

    @Override
    public User updateUserProfile(String emailId, User updatedUser) {
        UserEntity userEntity = userRepository.findByEmailId(emailId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userEntity.setFirstName(updatedUser.getFirstName());
        userEntity.setLastName(updatedUser.getLastName());
        userEntity.setEmailId(updatedUser.getEmailId());

        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            userEntity.setPassword(updatedUser.getPassword());
        }

        userRepository.save(userEntity);

        User user = new User();
        BeanUtils.copyProperties(userEntity, user);
        return user;
    }

    // SubSection methods
    @Override
    public SubSectionEntity saveSubSection(SubSectionEntity subSection, Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        subSection.setUser(user);
        return subSectionRepository.save(subSection);
    }

    @Override
    public List<SubSectionEntity> getSubSectionsByUser(Long userId) {
        return subSectionRepository.findAll()
                .stream()
                .filter(subSection -> subSection.getUser().getId() == userId) // Use == for primitive comparison
                .collect(Collectors.toList());
    }

    @Override
    public List<SubSectionEntity> getAllSubSections() {
        return subSectionRepository.findAll();
    }

    @Override
    public SubSectionEntity updateSubSection(Long subSectionId, SubSectionEntity updatedSubSection) {
        SubSectionEntity existingSubSection = subSectionRepository.findById(subSectionId)
                .orElseThrow(() -> new RuntimeException("SubSection not found"));
        BeanUtils.copyProperties(updatedSubSection, existingSubSection, "id");
        return subSectionRepository.save(existingSubSection);
    }

    @Override
    public boolean deleteSubSection(Long subSectionId) {
        SubSectionEntity subSection = subSectionRepository.findById(subSectionId)
                .orElseThrow(() -> new RuntimeException("SubSection not found"));
        subSectionRepository.delete(subSection);
        return true;
    }


}
