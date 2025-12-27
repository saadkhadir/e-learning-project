package org.example.keycloakproject.service;

import org.example.keycloakproject.entity.Cours;

import java.util.List;

public interface CoursSevice{
    List<Cours> getAll();
    Cours getById(Long id);
    Cours create(Cours cours);
    Cours update(Long id, Cours cours);
    void delete(Long id);
}
