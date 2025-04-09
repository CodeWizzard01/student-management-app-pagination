package com.codewiz.studentmanagementapp.dto;

import lombok.Data;

@Data
public class StudentSearchCriteria {
    private String name;
    private String department;
    private String address;
    private String email;
    private String phoneNumber;
    private String enrollmentNumber;
    private Integer page = 0; // Default value
    private Integer size = 10; // Default value
    private String[] sort = {"id", "desc"};
}
