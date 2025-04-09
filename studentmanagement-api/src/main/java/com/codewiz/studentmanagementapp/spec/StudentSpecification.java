package com.codewiz.studentmanagementapp.spec;

import com.codewiz.studentmanagementapp.dto.StudentSearchCriteria;
import com.codewiz.studentmanagementapp.model.Student;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class StudentSpecification {

    public static Specification<Student> withSearchCriteria(StudentSearchCriteria criteria) {

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            addPredicateIfNotNull(predicates, criteria.getName(), "name", root, criteriaBuilder);
            addPredicateIfNotNull(predicates, criteria.getDepartment(), "department", root, criteriaBuilder);
            addPredicateIfNotNull(predicates, criteria.getAddress(), "address", root, criteriaBuilder);
            addPredicateIfNotNull(predicates, criteria.getEmail(), "email", root, criteriaBuilder);
            addPredicateIfNotNull(predicates, criteria.getPhoneNumber(), "phoneNumber", root, criteriaBuilder);
            addPredicateIfNotNull(predicates, criteria.getEnrollmentNumber(), "enrollmentNumber", root, criteriaBuilder);
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

    }

    private static void addPredicateIfNotNull(List<Predicate> predicates, String value, String fieldName,
                                              Root<Student> root, CriteriaBuilder criteriaBuilder) {
        if (value != null && !value.isEmpty()) {
            predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get(fieldName)),
                    "%" + value.toLowerCase() + "%"
            ));
        }
    }
}
