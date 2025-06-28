package com.ecommerce.jewelleryMart.controller;

import com.ecommerce.jewelleryMart.model.Cart;
import com.ecommerce.jewelleryMart.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*") // Allow all origins for now. For production, specify allowed origins.
public class CartController {

    @Autowired
    private CartRepository cartRepository;

    /**
     * Retrieves the shopping cart for a specific user.
     * If no cart exists for the user, it creates an empty cart.
     * @param userId The ID of the user.
     * @return ResponseEntity containing the Cart object and HTTP 200 OK, or 404 Not Found if strict.
     */
    @GetMapping("/{userId}")
    public ResponseEntity<Cart> getCart(@PathVariable String userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElse(new Cart(userId, new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), new ArrayList<>()));

        // Ensure all arrays have the same length
        int minLength = Math.min(
                Math.min(cart.getProductIds().size(), cart.getQuantities().size()),
                Math.min(cart.getGrams().size(), cart.getFinalPrices().size())
        );

        // Trim arrays to the minimum length
        if (minLength < cart.getProductIds().size()) {
            cart.setProductIds(new ArrayList<>(cart.getProductIds().subList(0, minLength)));
            cart.setQuantities(new ArrayList<>(cart.getQuantities().subList(0, minLength)));
            cart.setGrams(new ArrayList<>(cart.getGrams().subList(0, minLength)));
            cart.setFinalPrices(new ArrayList<>(cart.getFinalPrices().subList(0, minLength)));
        }

        return new ResponseEntity<>(cart, HttpStatus.OK);
    }

    /**
     * Adds a product to the user's cart or updates its quantity if already present.
     * @param userId The ID of the user.
     * @param productId The ID of the product to add.
     * @param quantity The amount to add (defaults to 1).
     * @return ResponseEntity with the updated Cart and HTTP 200 OK, or 400 Bad Request if quantity is invalid.
     */
    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(
            @RequestParam String userId,
            @RequestParam String productId,
            @RequestParam(defaultValue = "1") int quantity,
            @RequestParam(defaultValue = "1") double grams,
            @RequestParam double finalPrice) {

        // Validate input
        if (quantity <= 0 || grams <= 0 || finalPrice <= 0) {
            return ResponseEntity.badRequest().build();
        }


        Cart cart = cartRepository.findByUserId(userId)
                .orElse(new Cart(userId, new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), new ArrayList<>()));

        // Find existing product index
        int index = cart.getProductIds().indexOf(productId);

        if (index >= 0) {
            // Update existing item
            cart.getQuantities().set(index, cart.getQuantities().get(index) + quantity);
            cart.getGrams().set(index, grams);
            cart.getFinalPrices().set(index, finalPrice);
        } else {
            // Add new item
            cart.getProductIds().add(productId);
            cart.getQuantities().add(quantity);
            cart.getGrams().add(grams);
            cart.getFinalPrices().add(finalPrice);
        }

        // Clean up any potential array mismatches
        int minLength = Math.min(
                Math.min(cart.getProductIds().size(), cart.getQuantities().size()),
                Math.min(cart.getGrams().size(), cart.getFinalPrices().size())
        );

        // Trim arrays to ensure synchronization
        cart.setProductIds(new ArrayList<>(cart.getProductIds().subList(0, minLength)));
        cart.setQuantities(new ArrayList<>(cart.getQuantities().subList(0, minLength)));
        cart.setGrams(new ArrayList<>(cart.getGrams().subList(0, minLength)));
        cart.setFinalPrices(new ArrayList<>(cart.getFinalPrices().subList(0, minLength)));

        cartRepository.save(cart);
        return ResponseEntity.ok(cart);
    }


    /**
     * Updates the quantity of a specific product in the user's cart.
     * @param userId The ID of the user.
     * @param productId The ID of the product to update.
     * @param quantity The new quantity for the product. Must be non-negative.
     * @return ResponseEntity with the updated Cart and HTTP 200 OK, 404 Not Found, or 400 Bad Request.
     */
    @PutMapping("/update")
    public ResponseEntity<Cart> updateCart(
            @RequestParam String userId,
            @RequestParam String productId,
            @RequestParam int quantity) {

        Optional<Cart> optionalCart = cartRepository.findByUserId(userId);
        if (optionalCart.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Cart cart = optionalCart.get();
        List<String> products = cart.getProductIds();
        List<Integer> quantities = cart.getQuantities();
        List<Double> grams = cart.getGrams();
        List<Double> finalPrices = cart.getFinalPrices();

        int index = products.indexOf(productId);
        if (index < 0) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        if (quantity < 0) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        if (quantity == 0) {
            // Remove from all arrays
            products.remove(index);
            quantities.remove(index);
            grams.remove(index);
            finalPrices.remove(index);
        } else {
            // Update only quantity
            quantities.set(index, quantity);
        }

        cart.setProductIds(products);
        cart.setQuantities(quantities);
        cart.setGrams(grams);
        cart.setFinalPrices(finalPrices);

        cartRepository.save(cart);
        return new ResponseEntity<>(cart, HttpStatus.OK);
    }

    /**
     * Removes a product entirely from the user's cart.
     * @param userId The ID of the user.
     * @param productId The ID of the product to remove.
     * @return ResponseEntity with the updated Cart and HTTP 200 OK, 404 Not Found, or 400 Bad Request.
     */
    @DeleteMapping("/remove")
    public ResponseEntity<Cart> removeItem(
            @RequestParam String userId,
            @RequestParam String productId) {

        Optional<Cart> optionalCart = cartRepository.findByUserId(userId);
        if (optionalCart.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Cart cart = optionalCart.get();
        List<String> products = cart.getProductIds();
        List<Integer> quantities = cart.getQuantities();
        List<Double> grams = cart.getGrams();
        List<Double> finalPrices = cart.getFinalPrices();

        int index = products.indexOf(productId);
        if (index < 0) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // Remove from all arrays
        products.remove(index);
        quantities.remove(index);
        grams.remove(index);
        finalPrices.remove(index);

        cart.setProductIds(products);
        cart.setQuantities(quantities);
        cart.setGrams(grams);
        cart.setFinalPrices(finalPrices);

        cartRepository.save(cart);
        return new ResponseEntity<>(cart, HttpStatus.OK);
    }

    // ADMIN CRUD for viewing or clearing all carts

    @GetMapping
    public List<Cart> getAllCarts() {
        return cartRepository.findAll();
    }


    /**
     * Deletes the entire cart for a user.
     */
    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<String> clearCart(@PathVariable String userId) {
        Optional<Cart> cartOpt = cartRepository.findByUserId(userId);
        if (cartOpt.isPresent()) {
            cartRepository.delete(cartOpt.get());
            return ResponseEntity.ok("Cart cleared for user: " + userId);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
