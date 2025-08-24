package com.example.spring_be_nvp.dto;

import java.time.LocalDate;

import com.example.spring_be_nvp.enums.Gender;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class EmployeeCreateDTO {
    @NotBlank
    @Size(min = 4 , max = 160)
    private String fullName;

    @NotBlank
    @Email
    private String email;

    @NotNull
    private LocalDate dateOfBirth;

    @NotNull
    private Gender gender;

    @NotBlank
    @Size(min = 10 , max = 10)
    private String phoneNumber;

    @NotNull
    private Boolean active;

    @NotNull
    private String password;
}
