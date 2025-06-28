package com.ecommerce.jewelleryMart.repository;

import com.ecommerce.jewelleryMart.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    /**
     * Finds a list of orders associated with a specific user ID.
     * @param userId The ID of the user whose orders are to be retrieved.
     * @return A List of Order objects for the given user ID.
     */
    List<Order> findByUserId(String userId);
}
