package com.ecommerce.jewelleryMart.controller;

import com.ecommerce.jewelleryMart.model.Cart;
import com.ecommerce.jewelleryMart.model.Order;
import com.ecommerce.jewelleryMart.model.Product;
import com.ecommerce.jewelleryMart.repository.CartRepository;
import com.ecommerce.jewelleryMart.repository.OrderRepository;
import com.ecommerce.jewelleryMart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/checkout")
@CrossOrigin(origins = "*")
public class CheckoutController {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    // DTO class for delivery input
    public static class ConfirmPaymentRequest {
        public String userId;
        public DeliveryInfo delivery;
        public double discount;

        public static class DeliveryInfo {
            public String name;
            public String contact;
            public String address;
            public String city;
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getCartSummary(@PathVariable String userId) {
        Optional<Cart> optionalCart = cartRepository.findByUserId(userId);
        if (optionalCart.isEmpty() || optionalCart.get().getProductIds().isEmpty()) {
            return new ResponseEntity<>("Cart not found or is empty.", HttpStatus.NOT_FOUND);
        }

        Cart cart = optionalCart.get();
        List<String> productIds = cart.getProductIds();
        List<Integer> quantities = cart.getQuantities();
        List<Double> grams = cart.getGrams();
        List<Double> finalPrices = cart.getFinalPrices();

        List<Product> products = productRepository.findAllById(productIds);
        Map<String, Product> productMap = products.stream()
                .collect(Collectors.toMap(Product::getId, p -> p));

        List<Map<String, Object>> itemsSummary = new ArrayList<>();
        double totalAmount = 0;

        for (int i = 0; i < productIds.size(); i++) {
            String productId = productIds.get(i);
            int qty = quantities.get(i);
            double gram = grams.get(i);
            double finalPrice = finalPrices.get(i);
            Product product = productMap.get(productId);

            if (product == null) continue;

            double itemTotal = finalPrice * qty;
            totalAmount += itemTotal;

            Map<String, Object> item = new HashMap<>();
            item.put("productId", productId);
            item.put("productName", product.getName());
            item.put("quantity", qty);
            item.put("grams", gram);
            item.put("price", product.getPrice());
            item.put("finalPrice", finalPrice);
            item.put("itemTotal", itemTotal);
            itemsSummary.add(item);
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("userId", userId);
        summary.put("items", itemsSummary);
        summary.put("totalAmount", totalAmount);
        return new ResponseEntity<>(summary, HttpStatus.OK);
    }

    @PostMapping("/confirm-payment")
    public ResponseEntity<Map<String, Object>> confirmPayment(@RequestBody Map<String, Object> payload) {
        String userId = (String) payload.get("userId");
        Map<String, Object> delivery = (Map<String, Object>) payload.get("delivery");
        double discount = payload.get("discount") != null ? ((Number) payload.get("discount")).doubleValue() : 0.0;

        if (userId == null || delivery == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Missing user or delivery details."));
        }

        String name = (String) delivery.get("name");
        String contact = (String) delivery.get("contact");
        String address = (String) delivery.get("address");
        String city = (String) delivery.get("city");

        if (name == null || contact == null || address == null || city == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Incomplete delivery details."));
        }

        Optional<Cart> optionalCart = cartRepository.findByUserId(userId);
        if (optionalCart.isEmpty() || optionalCart.get().getProductIds().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Cart is empty."));
        }

        Cart cart = optionalCart.get();
        List<String> productIds = cart.getProductIds();
        List<Integer> quantities = cart.getQuantities();
        List<Double> grams = cart.getGrams(); // Get grams from cart
        List<Double> finalPrices = cart.getFinalPrices(); // Get final prices from cart
        List<Product> productsInCart = productRepository.findAllById(productIds);

        Map<String, Product> productDetailsMap = productsInCart.stream()
                .collect(Collectors.toMap(Product::getId, p -> p));

        double totalAmount = 0;
        List<Map<String, Object>> invoiceItems = new ArrayList<>();

        for (int i = 0; i < productIds.size(); i++) {
            String productId = productIds.get(i);
            int quantity = quantities.get(i);
            double gram = grams.get(i); // Get gram for this item
            double finalPrice = finalPrices.get(i); // Get final price for this item
            Product product = productDetailsMap.get(productId);

            if (product == null) {
                continue;
            }

            double itemTotal = finalPrice * quantity;
            totalAmount += itemTotal;

            invoiceItems.add(Map.of(
                    "productId", productId,
                    "productName", product.getName(),
                    "quantity", quantity,
                    "grams", gram, // Include grams in response
                    "price", product.getPrice(),
                    "finalPrice", finalPrice, // Include final price in response
                    "itemTotal", itemTotal
            ));
        }

        totalAmount -= discount;
        totalAmount = Math.max(totalAmount, 0); // prevent negative totals

        Order order = new Order(userId, new ArrayList<>(productIds), new ArrayList<>(quantities), totalAmount);
        order.setGrams(new ArrayList<>(grams));

        order.setDeliveryName(name);
        order.setDeliveryContact(contact);
        order.setDeliveryAddress(address);
        order.setDeliveryCity(city);

        Order savedOrder = orderRepository.save(order);


        cart.setProductIds(new ArrayList<>());
        cart.setQuantities(new ArrayList<>());
        cart.setGrams(new ArrayList<>()); // Clear grams
        cart.setFinalPrices(new ArrayList<>()); // Clear final prices
        cartRepository.save(cart);

        Map<String, Object> invoiceResponse = new HashMap<>();
        invoiceResponse.put("message", "Payment successful, order placed!");
        invoiceResponse.put("orderId", savedOrder.getId());
        invoiceResponse.put("userId", userId);
        invoiceResponse.put("totalAmount", totalAmount);
        invoiceResponse.put("discount", discount);
        invoiceResponse.put("orderDate", savedOrder.getCreatedAt());
        invoiceResponse.put("items", invoiceItems);
        invoiceResponse.put("delivery", Map.of(
                "name", name,
                "contact", contact,
                "address", address,
                "city", city
        ));

        return ResponseEntity.ok(invoiceResponse);
    }
}
