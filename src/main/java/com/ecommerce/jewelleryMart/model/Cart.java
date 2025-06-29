package com.ecommerce.jewelleryMart.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.ArrayList;

@Document(collection = "carts")
public class Cart {

    @Id
    private String id;

    private String userId;
    private List<String> productIds; // List of product IDs in the cart
    private List<Integer> quantities; // Corresponding quantities for each product in productIds
    private List<Double> grams;       // NEW
    private List<Double> finalPrices;  // NEW

    public Cart() {
        this.productIds = new ArrayList<>();
        this.quantities = new ArrayList<>();
        this.grams = new ArrayList<>();
        this.finalPrices = new ArrayList<>();
    }

    public Cart(String userId, List<String> productIds, List<Integer> quantities, List<Integer> grams, List<Double> finalPrices) {
        this.userId = userId;
        this.productIds = productIds != null ? new ArrayList<>(productIds) : new ArrayList<>();
        this.quantities = quantities != null ? new ArrayList<>(quantities) : new ArrayList<>();
        this.grams = new ArrayList<>();
        this.finalPrices = finalPrices != null ? new ArrayList<>(finalPrices) : new ArrayList<>();
    }
    // --- Getters and Setters ---



    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public List<String> getProductIds() {
        return productIds;
    }

    public void setProductIds(List<String> productIds) {
        this.productIds = productIds;
    }

    public List<Integer> getQuantities() {
        return quantities;
    }

    public void setQuantities(List<Integer> quantities) {
        this.quantities = quantities;
    }

    public List<Double> getGrams() { return grams; }
    public void setGrams(List<Double> grams) { this.grams = grams; }

    public List<Double> getFinalPrices() { return finalPrices; }
    public void setFinalPrices(List<Double> finalPrices) { this.finalPrices = finalPrices; }
}
