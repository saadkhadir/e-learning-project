package org.example.keycloakproject;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class KeycloakProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(KeycloakProjectApplication.class, args);
    }

    /**
     * CommandLineRunner pour afficher les informations au démarrage
     */
    @Bean
    public CommandLineRunner commandLineRunner() {
        return args -> {
            System.out.println("\n═══════════════════════════════════════════════════════════");
            System.out.println("🎓 E-Learning Platform - OAuth2 Keycloak Started");
            System.out.println("═══════════════════════════════════════════════════════════");
            System.out.println("📌 Backend API: http://localhost:8081");
            System.out.println("📌 Keycloak Server: http://localhost:8080");
            System.out.println("📌 Realm: elearning-realm");
            System.out.println("═══════════════════════════════════════════════════════════");
            System.out.println("📚 Endpoints:");
            System.out.println("   GET    /api/cours         → Liste tous les cours (STUDENT + ADMIN)");
            System.out.println("   GET    /api/cours/{id}    → Détail d'un cours (STUDENT + ADMIN)");
            System.out.println("   POST   /api/cours         → Créer un cours (ADMIN uniquement)");
            System.out.println("   PUT    /api/cours/{id}    → Modifier un cours (ADMIN uniquement)");
            System.out.println("   DELETE /api/cours/{id}    → Supprimer un cours (ADMIN uniquement)");
            System.out.println("   GET    /api/cours/me      → Informations utilisateur");
            System.out.println("═══════════════════════════════════════════════════════════");
            System.out.println("👤 Utilisateurs de test:");
            System.out.println("   - username: user1  | role: ROLE_STUDENT");
            System.out.println("   - username: admin1 | role: ROLE_ADMIN");
            System.out.println("═══════════════════════════════════════════════════════════\n");
        };
    }
}
