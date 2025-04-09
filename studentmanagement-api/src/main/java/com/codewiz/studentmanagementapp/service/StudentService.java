package com.codewiz.studentmanagementapp.service;

import com.codewiz.studentmanagementapp.dto.StudentSearchCriteria;
import com.codewiz.studentmanagementapp.model.Student;
import com.codewiz.studentmanagementapp.repository.StudentRepository;
import com.codewiz.studentmanagementapp.spec.StudentSpecification;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public Student createStudent(Student student) {
        return studentRepository.save(student);
    }

    public Page<Student> findStudentsWithCriteria(StudentSearchCriteria studentSearchCriteria, Pageable pageable) {
        return studentRepository.findAll(StudentSpecification.withSearchCriteria(studentSearchCriteria), pageable);
    }

    public Page<Student> findStudentsWithExample(StudentSearchCriteria criteria, Pageable pageable) {
        Student studentExample = new Student();
        studentExample.setName(criteria.getName());
        studentExample.setDepartment(criteria.getDepartment());
        studentExample.setAddress(criteria.getAddress());
        studentExample.setEmail(criteria.getEmail());
        studentExample.setPhoneNumber(criteria.getPhoneNumber());
        studentExample.setEnrollmentNumber(criteria.getEnrollmentNumber());

        ExampleMatcher matcher = ExampleMatcher.matchingAll()
                .withIgnoreCase()
                .withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING)
                .withIgnoreNullValues();

        Example<Student> example = Example.of(studentExample, matcher);
        return studentRepository.findAll(example, pageable);

    }

    public List<Student> findStudentsWithCursorAndCriteria(Long cursor, int size, StudentSearchCriteria criteria) {
        /*Pageable pageable = PageRequest.of(0, size, Sort.by("id").descending());
        Specification<Student> spec = StudentSpecification.withSearchCriteria(criteria)
                .and((root, query, criteriaBuilder) -> {
                    return criteriaBuilder.lessThan(root.get("id"), cursor);
                });
        return studentRepository.findAll(spec, pageable).getContent();*/

        // use criteria builder

        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Student> query = criteriaBuilder.createQuery(Student.class);
        Root<Student> root = query.from(Student.class);

        Specification<Student> spec = StudentSpecification.withSearchCriteria(criteria);
        Predicate predicate = spec.toPredicate(root, query, criteriaBuilder);

        Predicate cursorPredicate = criteriaBuilder.lessThan(root.get("id"), cursor);
        query.where(criteriaBuilder.and(predicate, cursorPredicate));

        query.orderBy(criteriaBuilder.desc(root.get("id")));

        return entityManager.createQuery(query)
                .setMaxResults(size)
                .getResultList();


    }

    }
