package com.example.spring_be_nvp.dto;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.example.spring_be_nvp.enums.Gender;

import lombok.Data;
@Data
public class EmployeeDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private Gender gender;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
