package com.codewiz.studentmanagementapp.loader;

import com.codewiz.studentmanagementapp.model.Student;
import com.codewiz.studentmanagementapp.repository.StudentRepository;
import com.github.javafaker.Faker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.TimeUnit;


@Configuration
public class DataLoader {
    
    private static final Logger logger = LoggerFactory.getLogger(DataLoader.class);
    
    private final String[] departments = {
        "Computer Science", "Electrical Engineering", "Mechanical Engineering", 
        "Civil Engineering", "Physics", "Mathematics", "Chemistry", "Biology", 
        "Business Administration", "Economics"
    };

    @Bean
    CommandLineRunner loadData(StudentRepository studentRepository) {
        return args -> {
            logger.info("Starting to load 1000,000 random student records...");
            
            if (studentRepository.count() >= 1000000) {
                logger.info("Data already exists, skipping data generation");
                return;
            }
            
            Faker faker = new Faker();
            Random random = new Random();
            List<Student> students = new ArrayList<>();
            
            for (int i = 0; i < 1000000; i++) {
                Student student = new Student();
                student.setName(faker.name().fullName());
                
                LocalDate dob = faker.date()
                    .past(365 * 12, TimeUnit.DAYS)
                    .toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate();
                student.setDob(dob);
                
                student.setAddress(faker.address().fullAddress());
                student.setPhoneNumber(faker.phoneNumber().cellPhone());
                
                String department = departments[random.nextInt(departments.length)];
                student.setDepartment(department);
                
                LocalDate joiningDate = faker.date()
                    .past(365 * 4, TimeUnit.DAYS)
                    .toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate();
                student.setJoiningDate(joiningDate);
                
                student.setEmail(faker.internet().emailAddress());
                
                String deptCode = department.substring(0, 2).toUpperCase();
                String yearCode = String.valueOf(joiningDate.getYear()).substring(2);
                String randomNum = String.format("%03d", random.nextInt(1000));
                student.setEnrollmentNumber(deptCode + yearCode + randomNum);
                
                students.add(student);
                
                if (i % 10000 == 0 && i > 0) {
                    studentRepository.saveAll(students);
                    students.clear();
                    logger.info("Inserted {} records so far", i);
                }
            }
            
            if (!students.isEmpty()) {
                studentRepository.saveAll(students);
            }
            
            logger.info("Successfully loaded 1000,000 random student records!");
        };
    }
}
