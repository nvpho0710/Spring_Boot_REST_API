package com.example.spring_be_nvp.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.example.spring_be_nvp.dto.*;
import com.example.spring_be_nvp.entity.Employee;
import com.example.spring_be_nvp.repository.EmployeeRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.*;


@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    private EmployeeDTO toDTO(Employee employee) {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(employee.getId());
        dto.setFullName(employee.getFullName());
        dto.setEmail(employee.getEmail());
        dto.setPhoneNumber(employee.getPhoneNumber());
        dto.setDateOfBirth(employee.getDateOfBirth());
        dto.setGender(employee.getGender());
        dto.setActive(employee.getActive());
        dto.setCreatedAt(employee.getCreatedAt());
        dto.setUpdatedAt(employee.getUpdatedAt());
        return dto;
    }

    @Override
    @Transactional
    public EmployeeDTO createEmployee(EmployeeCreateDTO request) {
        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Employee employee = Employee.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .active(request.getActive())
                .hashedPassword(passwordEncoder.encode(request.getPassword()))
                .createdAt(java.time.LocalDateTime.now())
                .updatedAt(java.time.LocalDateTime.now())
                .build();
        employeeRepository.save(employee); 
        return toDTO(employee);
    }

    @Override
    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EmployeeDTO getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return toDTO(employee);
    }

    @Override
    @Transactional
    public EmployeeDTO updateEmployee(Long id, EmployeeUpdateDTO request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        if (request.getFullName() != null) {
            employee.setFullName(request.getFullName());
        }

        if (request.getDateOfBirth() != null) {
            employee.setDateOfBirth(request.getDateOfBirth());
        }
        if (request.getGender() != null) {
            employee.setGender(request.getGender());
        }
        if (request.getPhoneNumber() != null) {
            employee.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getActive() != null) {
            employee.setActive(request.getActive());
        }
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            employee.setHashedPassword(passwordEncoder.encode(request.getPassword()));
        }
        employee.setUpdatedAt(java.time.LocalDateTime.now());
        employeeRepository.save(employee);
        return toDTO(employee);
    
    }

    @Override
    @Transactional
    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new RuntimeException("Employee not found");
        }
        employeeRepository.deleteById(id);
    }
}
