
package com.ayonproject.irm_mngt_system.controller;

import com.ayonproject.irm_mngt_system.entity.SubSectionEntity;
import com.ayonproject.irm_mngt_system.model.User;
import com.ayonproject.irm_mngt_system.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(value = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<?> saveUser(@RequestBody User user) {
        if (userService.existsByEmailId(user.getEmailId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email already exists. Please use a different email.");
        }
        return ResponseEntity.ok(userService.saveUser(user));
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteUser(@PathVariable("id") Long id) {
        System.out.println("Attempting to delete user with ID: " + id); // Debug log
        try {
            boolean deleted = userService.deleteUser(id);
            Map<String, Boolean> response = new HashMap<>();
            response.put("deleted", deleted);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.err.println("Error deleting user with ID: " + id + " - " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("deleted", false));
        }
    }



    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable("id") Long id, @RequestBody User user) {
        user = userService.updateUser(id, user);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countUsers() {
        long userCount = userService.countUsers();
        return ResponseEntity.ok(userCount);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody User user) {
        if (user.getEmailId() == null || user.getPassword() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        String token = userService.authenticateUser(user.getEmailId(), user.getPassword());
        if (token != null) {
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("role", userService.getUserRole(user.getEmailId()));
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }

    @GetMapping("/profile/{emailId}")
    public ResponseEntity<User> getProfile(@PathVariable String emailId) {
        User user = userService.getUserByEmail(emailId);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile/{emailId}")
    public ResponseEntity<User> updateProfile(@PathVariable String emailId, @RequestBody User updatedUser) {
        User user = userService.updateUserProfile(emailId, updatedUser);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmail(@RequestParam("email") String email) {
        boolean exists = userService.existsByEmailId(email);
        return ResponseEntity.ok(exists);
    }

    // SubSection Endpoints
    @PostMapping("/{userId}/subsections")
    public ResponseEntity<SubSectionEntity> saveSubSection(
            @PathVariable Long userId,
            @RequestBody SubSectionEntity subSection) {
        return ResponseEntity.ok(userService.saveSubSection(subSection, userId));
    }

    @GetMapping("/{userId}/subsections")
    public ResponseEntity<List<SubSectionEntity>> getSubSectionsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getSubSectionsByUser(userId));
    }

    @GetMapping("/subsections")
    public ResponseEntity<List<SubSectionEntity>> getAllSubSections() {
        List<SubSectionEntity> allSubSections = userService.getAllSubSections();
        return ResponseEntity.ok(allSubSections);
    }

    @PutMapping("/subsections/{subSectionId}")
    public ResponseEntity<SubSectionEntity> updateSubSection(
            @PathVariable Long subSectionId,
            @RequestBody SubSectionEntity updatedSubSection) {
        SubSectionEntity subSection = userService.updateSubSection(subSectionId, updatedSubSection);
        return ResponseEntity.ok(subSection);
    }

    @DeleteMapping("/subsections/{subSectionId}")
    public ResponseEntity<Map<String, Boolean>> deleteSubSection(@PathVariable Long subSectionId) {
        boolean deleted = userService.deleteSubSection(subSectionId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", deleted);
        return ResponseEntity.ok(response);
    }

}
