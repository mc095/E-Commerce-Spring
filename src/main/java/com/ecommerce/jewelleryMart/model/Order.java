package com.ecommerce.jewelleryMart.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    private String userId;
    private List<String> productIds;
    private List<Integer> quantities;
    private double totalAmount;
    private Date createdAt;
    private List<Double> grams;

    private String deliveryName;
    private String deliveryContact;
    private String deliveryAddress;
    private String deliveryCity;

    public String getDeliveryName() {
        return deliveryName;
    }

    public void setDeliveryName(String deliveryName) {
        this.deliveryName = deliveryName;
    }

    public String getDeliveryContact() {
        return deliveryContact;
    }

    public void setDeliveryContact(String deliveryContact) {
        this.deliveryContact = deliveryContact;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public String getDeliveryCity() {
        return deliveryCity;
    }

    public void setDeliveryCity(String deliveryCity) {
        this.deliveryCity = deliveryCity;
    }


    public List<Double> getGrams() {
        return grams;
    }

    public void setGrams(List<Double> grams) {
        this.grams = grams;
    }


    // Default constructor
    public Order() {
        this.productIds = new ArrayList<>();
        this.quantities = new ArrayList<>();
        this.createdAt = new Date(); // Set creation date by default
    }

    // Parameterized constructor
    public Order(String userId, List<String> productIds, List<Integer> quantities, double totalAmount) {
        this.userId = userId;
        this.productIds = productIds != null ? new ArrayList<>(productIds) : new ArrayList<>();
        this.quantities = quantities != null ? new ArrayList<>(quantities) : new ArrayList<>();
        this.totalAmount = totalAmount;
        this.createdAt = new Date(); // Set creation date when order is created
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

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}
