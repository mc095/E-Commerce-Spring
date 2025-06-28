package com.ecommerce.jewelleryMart.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "products")
public class Product {

    @Id
    private String id;
    private String name;
    private double price;
    private String category;
    private String metalType; // e.g., gold, silver, diamond
    private String image;
    private String description;
    private double weight;


    public Product() {}

    public Product(String name, double price, String category, String metalType, String image, String description) {
        this.name = name;
        this.price = price;
        this.category = category;
        this.metalType = metalType;
        this.image = image;
        this.description = description;
        this.weight = weight;
    }

    // --- Getters and setters ---
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getWeight() { return weight; }
    public void setWeight(double weight) { this.weight = weight; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getMetalType() { return metalType; }
    public void setMetalType(String metalType) { this.metalType = metalType; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
