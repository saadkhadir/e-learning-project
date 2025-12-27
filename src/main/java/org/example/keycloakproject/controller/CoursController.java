package org.example.keycloakproject.controller;

import org.example.keycloakproject.entity.Cours;
import org.example.keycloakproject.service.CoursSevice;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cours")
@CrossOrigin(origins = "http://localhost:3000") // Pour React
public class CoursController {

    private final CoursSevice coursSevice;

    public CoursController(CoursSevice coursSevice) {
        this.coursSevice = coursSevice;
    }

    /**
     * GET /api/cours
     * Accessible à STUDENT et ADMIN
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<List<Cours>> getAll() {
        return ResponseEntity.ok(coursSevice.getAll());
    }

    /**
     * GET /api/cours/{id}
     * Accessible à STUDENT et ADMIN
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<Cours> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(coursSevice.getById(id));
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * POST /api/cours
     * Réservé à ADMIN uniquement
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Cours> create(@RequestBody Cours cours) {
        Cours created = coursSevice.create(cours);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * PUT /api/cours/{id}
     * Réservé à ADMIN uniquement
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Cours> update(@PathVariable Long id, @RequestBody Cours cours) {
        try {
            Cours updated = coursSevice.update(id, cours);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * DELETE /api/cours/{id}
     * Réservé à ADMIN uniquement
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            coursSevice.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/cours/me
     * Endpoint pour récupérer les informations de l'utilisateur connecté
     * et ses rôles (comme demandé dans le PDF)
     */
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getUserInfo(Authentication authentication) {
        Map<String, Object> userInfo = new HashMap<>();

        if (authentication.getPrincipal() instanceof Jwt jwt) {
            userInfo.put("username", jwt.getClaimAsString("preferred_username"));
            userInfo.put("email", jwt.getClaimAsString("email"));
            userInfo.put("firstName", jwt.getClaimAsString("given_name"));
            userInfo.put("lastName", jwt.getClaimAsString("family_name"));
            // Convert GrantedAuthority objects to plain role names
            var roles = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());
            userInfo.put("roles", roles);
        }

        return ResponseEntity.ok(userInfo);
    }
}