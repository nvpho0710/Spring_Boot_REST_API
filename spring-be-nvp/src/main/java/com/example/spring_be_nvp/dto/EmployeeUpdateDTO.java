package com.example.spring_be_nvp.dto;

import java.time.LocalDate;

import com.example.spring_be_nvp.enums.Gender;

import jakarta.validation.constraints.*;
import lombok.Data;
@Data
public class EmployeeUpdateDTO {
    @Size(min = 4 , max = 160)
    private String fullName;

    private LocalDate dateOfBirth;

    private Gender gender;

    @Size(min = 10 , max = 10)
    private String phoneNumber;

    private Boolean active;

    private String password;
}
