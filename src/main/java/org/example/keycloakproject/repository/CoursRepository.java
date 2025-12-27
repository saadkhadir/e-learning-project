package org.example.keycloakproject.repository;


import org.example.keycloakproject.entity.Cours;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoursRepository extends JpaRepository<Cours, Long> {
}
