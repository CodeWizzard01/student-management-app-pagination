package com.codewiz.studentmanagementapp.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "students")
@Data
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private LocalDate dob;
    private String address;
    private String phoneNumber;
    private String department;
    private LocalDate joiningDate;
    private String email;
    private String enrollmentNumber;
}
