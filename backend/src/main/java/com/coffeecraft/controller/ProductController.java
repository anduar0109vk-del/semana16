package com.coffeecraft.controller;

import com.coffeecraft.model.Product;
import com.coffeecraft.repository.ProductRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // Listar todos los productos o filtrar por búsqueda o categoría
    @GetMapping
    public List<Product> getAllProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category) {

        if (search != null && !search.trim().isEmpty()) {
            return productRepository.findByNameContainingIgnoreCase(search.trim());
        }
        if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("Todos")) {
            return productRepository.findByCategoryIgnoreCase(category.trim());
        }
        return productRepository.findAll();
    }

    // Obtener producto por ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Crear nuevo producto
    @PostMapping
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        Product created = productRepository.save(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // Actualizar producto existente
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @Valid @RequestBody Product productDetails) {
        return productRepository.findById(id).map(existingProduct -> {
            existingProduct.setName(productDetails.getName());
            existingProduct.setDescription(productDetails.getDescription());
            existingProduct.setCategory(productDetails.getCategory());
            existingProduct.setPrice(productDetails.getPrice());
            existingProduct.setStock(productDetails.getStock());
            existingProduct.setImageUrl(productDetails.getImageUrl());
            existingProduct.setAvailable(productDetails.getAvailable());
            Product updated = productRepository.save(existingProduct);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    // Eliminar producto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (!productRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Cambiar disponibilidad (toggle status)
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Product> toggleAvailability(@PathVariable Long id) {
        return productRepository.findById(id).map(product -> {
            product.setAvailable(!Boolean.TRUE.equals(product.getAvailable()));
            Product updated = productRepository.save(product);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    // Métricas del catálogo
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        List<Product> all = productRepository.findAll();
        long totalProducts = all.size();
        long outOfStock = all.stream().filter(p -> p.getStock() == null || p.getStock() <= 0).count();
        long activeProducts = all.stream().filter(p -> Boolean.TRUE.equals(p.getAvailable())).count();
        Set<String> categories = new HashSet<>();
        double totalValue = 0;

        for (Product p : all) {
            if (p.getCategory() != null) {
                categories.add(p.getCategory());
            }
            if (p.getPrice() != null && p.getStock() != null) {
                totalValue += p.getPrice() * p.getStock();
            }
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", totalProducts);
        stats.put("activeProducts", activeProducts);
        stats.put("outOfStock", outOfStock);
        stats.put("categoriesCount", categories.size());
        stats.put("totalInventoryValue", Math.round(totalValue * 100.0) / 100.0);

        return ResponseEntity.ok(stats);
    }
}
