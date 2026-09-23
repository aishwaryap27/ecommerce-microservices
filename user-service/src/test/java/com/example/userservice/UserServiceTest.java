package com.example.userservice;

import com.example.userservice.dto.UserRequest;
import com.example.userservice.dto.UserResponse;
import com.example.userservice.exception.ResourceNotFoundException;
import com.example.userservice.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@Transactional
class UserServiceTest {

    @Autowired
    private UserService userService;

    @Test
    void shouldCreateUser() {
        UserRequest request = new UserRequest("Alice", "alice@example.com", "secret");

        UserResponse response = userService.createUser(request);

        assertThat(response.id()).isNotNull();
        assertThat(response.name()).isEqualTo("Alice");
        assertThat(response.email()).isEqualTo("alice@example.com");
    }

    @Test
    void shouldGetUserById() {
        UserRequest request = new UserRequest("Bob", "bob@example.com", "secret");
        UserResponse created = userService.createUser(request);

        UserResponse found = userService.getUserById(created.id());

        assertThat(found.id()).isEqualTo(created.id());
        assertThat(found.email()).isEqualTo("bob@example.com");
    }

    @Test
    void shouldThrowWhenUserNotFound() {
        assertThatThrownBy(() -> userService.getUserById(999999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User not found");
    }
}
