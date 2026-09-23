
package com.example.orderservice;

import com.example.orderservice.client.ProductClient;
import com.example.orderservice.dto.OrderRequest;
import com.example.orderservice.dto.OrderResponse;
import com.example.orderservice.dto.ProductDto;
import com.example.orderservice.entity.OrderStatus;
import com.example.orderservice.exception.ResourceNotFoundException;
import com.example.orderservice.service.OrderService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@SpringBootTest
@Transactional
class OrderServiceTest {

    @Autowired
    private OrderService orderService;

    @MockBean
    private ProductClient productClient;

    @Test
    void shouldCreateOrder() {

        ProductDto product = new ProductDto(
                1L,
                "Laptop",
                "Test laptop",
                new BigDecimal("60000.00"),
                10,
                "Electronics",
                LocalDateTime.now()
        );

        when(productClient.getProductById(1L))
                .thenReturn(product);

        OrderRequest request = new OrderRequest(1L, 1L, 2);

        OrderResponse response = orderService.createOrder(request);

        assertThat(response.id()).isNotNull();
        assertThat(response.userId()).isEqualTo(1L);
        assertThat(response.productId()).isEqualTo(1L);
        assertThat(response.quantity()).isEqualTo(2);
        assertThat(response.totalPrice())
                .isEqualByComparingTo("120000.00");
        assertThat(response.status())
                .isEqualTo(OrderStatus.CREATED);
    }

    @Test
    void shouldGetOrderById() {

        ProductDto product = new ProductDto(
                1L,
                "Laptop",
                "Test laptop",
                new BigDecimal("60000.00"),
                10,
                "Electronics",
                LocalDateTime.now()
        );

        when(productClient.getProductById(1L))
                .thenReturn(product);

        OrderRequest request = new OrderRequest(2L, 1L, 1);

        OrderResponse created = orderService.createOrder(request);

        OrderResponse found = orderService.getOrderById(created.id());

        assertThat(found.id())
                .isEqualTo(created.id());

        assertThat(found.productId())
                .isEqualTo(1L);
    }

    @Test
    void shouldCancelOrder() {

        ProductDto product = new ProductDto(
                1L,
                "Laptop",
                "Test laptop",
                new BigDecimal("60000.00"),
                10,
                "Electronics",
                LocalDateTime.now()
        );

        when(productClient.getProductById(1L))
                .thenReturn(product);

        OrderRequest request = new OrderRequest(3L, 1L, 1);

        OrderResponse created = orderService.createOrder(request);

        OrderResponse cancelled =
                orderService.cancelOrder(created.id());

        assertThat(cancelled.status())
                .isEqualTo(OrderStatus.CANCELLED);
    }

    @Test
    void shouldFailForNonexistentProduct() {

        when(productClient.getProductById(999L))
                .thenReturn(null);

        OrderRequest request =
                new OrderRequest(4L, 999L, 1);

        assertThatThrownBy(
                () -> orderService.createOrder(request)
        )
                .isInstanceOf(ResourceNotFoundException.class);
    }
}

