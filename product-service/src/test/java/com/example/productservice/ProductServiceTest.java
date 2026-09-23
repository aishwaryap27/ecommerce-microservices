package com.example.productservice;

import com.example.productservice.dto.ProductRequest;
import com.example.productservice.dto.ProductResponse;
import com.example.productservice.exception.ResourceNotFoundException;
import com.example.productservice.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@Transactional
class ProductServiceTest {

    @Autowired
    private ProductService productService;

    @Test
    void shouldCreateProduct() {
        ProductRequest request = new ProductRequest("Laptop", "Gaming laptop", new BigDecimal("1200.00"), 20, "Electronics");

        ProductResponse response = productService.createProduct(request);

        assertThat(response.id()).isNotNull();
        assertThat(response.name()).isEqualTo("Laptop");
        assertThat(response.price()).isEqualByComparingTo(new BigDecimal("1200.00"));
    }

    @Test
    void shouldGetProductById() {
        ProductResponse created = productService.createProduct(new ProductRequest("Mouse", "Wireless mouse", new BigDecimal("35.00"), 15, "Accessories"));

        ProductResponse found = productService.getProductById(created.id());

        assertThat(found.id()).isEqualTo(created.id());
        assertThat(found.name()).isEqualTo("Mouse");
    }

    @Test
    void shouldThrowWhenProductNotFound() {
        assertThatThrownBy(() -> productService.getProductById(999999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Product not found");
    }
}
