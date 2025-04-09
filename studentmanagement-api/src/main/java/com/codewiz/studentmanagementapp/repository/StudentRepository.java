package com.codewiz.studentmanagementapp.repository;

import com.codewiz.studentmanagementapp.model.Student;
import com.codewiz.studentmanagementapp.service.StudentService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface StudentRepository  extends JpaRepository<Student, Long>, JpaSpecificationExecutor<Student> {
}
