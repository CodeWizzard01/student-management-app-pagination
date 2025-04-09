package com.codewiz.studentmanagementapp.controller;

import com.codewiz.studentmanagementapp.dto.StudentSearchCriteria;
import com.codewiz.studentmanagementapp.model.Student;
import com.codewiz.studentmanagementapp.service.StudentService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:3001")
@AllArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping
    public ResponseEntity<Page<Student>> getAllStudents(@ModelAttribute StudentSearchCriteria criteria) {

        String sortField = criteria.getSort()[0];
        String sortDirection = criteria.getSort()[1];
        Sort.Direction direction = sortDirection.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sortOrder = Sort.by(direction, sortField);

        Pageable pageable = PageRequest.of(criteria.getPage(), criteria.getSize(), sortOrder);

        Page<Student> studentsPage = studentService.findStudentsWithCriteria(criteria, pageable);
        return new ResponseEntity<>(studentsPage, HttpStatus.OK);

    }

    @GetMapping("/cursor")
    public ResponseEntity<List<Student>> getAllStudentsCursorPagination(
            @RequestParam(required = false, defaultValue = "99999999999" ) Long cursor,
            @RequestParam(defaultValue = "10") int size,
            @ModelAttribute StudentSearchCriteria criteria) {
        try {
            List<Student> students = studentService.findStudentsWithCursorAndCriteria(cursor, size, criteria);
            return new ResponseEntity<>(students, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
