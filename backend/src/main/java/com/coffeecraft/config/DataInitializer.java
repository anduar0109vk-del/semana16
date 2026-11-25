package com.coffeecraft.config;

import com.coffeecraft.model.Product;
import com.coffeecraft.model.User;
import com.coffeecraft.repository.ProductRepository;
import com.coffeecraft.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public DataInitializer(UserRepository userRepository, ProductRepository productRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        // Inicializar o sincronizar usuarios base con sus roles exactos
        userRepository.findByUsername("admin").ifPresentOrElse(
                u -> { u.setRole("ROLE_ADMIN"); userRepository.save(u); },
                () -> userRepository.save(new User("admin", "admin123", "Angel (Administrador)", "ROLE_ADMIN"))
        );

        userRepository.findByUsername("demo").ifPresentOrElse(
                u -> { u.setRole("ROLE_BARISTA"); userRepository.save(u); },
                () -> userRepository.save(new User("demo", "demo123", "Carlos (Barista Staff)", "ROLE_BARISTA"))
        );

        userRepository.findByUsername("cliente").ifPresentOrElse(
                u -> { u.setRole("ROLE_CLIENT"); userRepository.save(u); },
                () -> userRepository.save(new User("cliente", "cliente123", "Sofia (Cliente VIP)", "ROLE_CLIENT"))
        );

        // Inicializar productos si no existen
        if (productRepository.count() == 0) {
            List<Product> products = Arrays.asList(
                    new Product(
                            "Espresso Doble Especialidad",
                            "Extracción precisa con notas a chocolate amargo y frutos secos, granos de origen Colombia.",
                            "Cafés Calientes",
                            3.80,
                            45,
                            "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=600&q=80",
                            true
                    ),
                    new Product(
                            "Caramel Macchiato Velvet",
                            "Café espresso recién preparado con leche vaporizada con vainilla y remolino de caramelo artesanal.",
                            "Cafés Calientes",
                            5.20,
                            30,
                            "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80",
                            true
                    ),
                    new Product(
                            "Cold Brew Nitro Vainilla",
                            "Café macerado en frío durante 18 horas, infusionado con nitrógeno y crema suave de vainilla.",
                            "Cafés Fríos",
                            5.50,
                            22,
                            "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80",
                            true
                    ),
                    new Product(
                            "Iced Matcha Latte Ceremonial",
                            "Auténtico té verde matcha ceremonial de Japón, leche de almendras y toque dulce de agave.",
                            "Bebidas Frías",
                            5.90,
                            18,
                            "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80",
                            true
                    ),
                    new Product(
                            "Croissant Francés de Mantequilla",
                            "Hojaldre crujiente y dorado horneado diariamente con auténtica mantequilla francesa.",
                            "Pastelería",
                            3.20,
                            15,
                            "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
                            true
                    ),
                    new Product(
                            "Cheesecake de Frutos Rojos",
                            "Cremoso pastel de queso estilo Nueva York cubierto con compota artesanal de arándanos y frambuesas.",
                            "Postres",
                            4.90,
                            12,
                            "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80",
                            true
                    ),
                    new Product(
                            "Cappuccino Arte Latte",
                            "Espresso equilibrado con leche microespumada cremosa y diseño floral de barista profesional.",
                            "Cafés Calientes",
                            4.40,
                            35,
                            "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80",
                            true
                    ),
                    new Product(
                            "Cookie Rellena de Nutella",
                            "Galleta recién horneada crujiente por fuera y centro fundente con chips de chocolate belga.",
                            "Pastelería",
                            2.90,
                            20,
                            "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80",
                            true
                    )
            );
            productRepository.saveAll(products);
        }
    }
}
