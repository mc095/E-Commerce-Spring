package com.ecommerce.jewelleryMart.controller;

import com.ecommerce.jewelleryMart.model.Coupon;
import com.ecommerce.jewelleryMart.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/coupons")
@CrossOrigin("*")
public class CouponController {

    @Autowired
    private CouponRepository couponRepository;

    @GetMapping
    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    @GetMapping("/{code}")
    public ResponseEntity<Coupon> getCoupon(@PathVariable String code) {
        return couponRepository.findById(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Coupon> createCoupon(@RequestBody Coupon coupon) {
        if (couponRepository.existsById(coupon.getCode())) {
            return ResponseEntity.badRequest().body(null);
        }
        Coupon saved = couponRepository.save(coupon);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{code}")
    public ResponseEntity<Coupon> updateCoupon(@PathVariable String code, @RequestBody Coupon updatedCoupon) {
        return couponRepository.findById(code)
                .map(existing -> {
                    existing.setDiscountAmount(updatedCoupon.getDiscountAmount());
                    couponRepository.save(existing);
                    return ResponseEntity.ok(existing);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{code}")
    public ResponseEntity<String> deleteCoupon(@PathVariable String code) {
        if (!couponRepository.existsById(code)) {
            return ResponseEntity.notFound().build();
        }
        couponRepository.deleteById(code);
        return ResponseEntity.ok("Coupon deleted successfully.");
    }

    @GetMapping("/apply")
    public ResponseEntity<?> applyCoupon(@RequestParam String code) {
        Optional<Coupon> couponOpt = couponRepository.findById(code);

        if (couponOpt.isPresent()) {
            Coupon coupon = couponOpt.get();
            return ResponseEntity.ok().body(Map.of(
                    "code", coupon.getCode(),
                    "discountAmount", coupon.getDiscountAmount()
            ));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid coupon code"));
        }
    }
}
