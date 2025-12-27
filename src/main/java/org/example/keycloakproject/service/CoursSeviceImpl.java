package org.example.keycloakproject.service;

import org.example.keycloakproject.entity.Cours;
import org.example.keycloakproject.repository.CoursRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CoursSeviceImpl implements CoursSevice{

    private final CoursRepository coursRepository;

    public CoursSeviceImpl(CoursRepository coursRepository) {
        this.coursRepository = coursRepository;
    }

    @Override
    public List<Cours> getAll() {
        return coursRepository.findAll();
    }

    @Override
    public Cours getById(Long id) {
        return coursRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cours not found with id: " + id));
    }

    @Override
    public Cours create(Cours cours) {
        cours.setId(null);
        return coursRepository.save(cours);
    }

    @Override
    public Cours update(Long id, Cours cours) {
        Cours existing = getById(id);
        existing.setTitle(cours.getTitle());
        existing.setDescription(cours.getDescription());
        existing.setInstructor(cours.getInstructor());
        return coursRepository.save(existing);
    }

    @Override
    public void delete(Long id) {
        if (!coursRepository.existsById(id)) {
            throw new RuntimeException("Cours not found with id: " + id);
        }
        coursRepository.deleteById(id);
    }
}
