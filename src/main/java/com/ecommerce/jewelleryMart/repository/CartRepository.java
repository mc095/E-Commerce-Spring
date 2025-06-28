package com.ecommerce.jewelleryMart.repository;

import com.ecommerce.jewelleryMart.model.Cart;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends MongoRepository<Cart, String> {
    /**
     * Finds a shopping cart associated with a specific user ID.
     * @param userId The ID of the user whose cart is to be retrieved.
     * @return An Optional containing the Cart if found, or an empty Optional otherwise.
     */
    Optional<Cart> findByUserId(String userId);
}
