package com.example.spring_be_nvp.service;

import java.util.List;

import com.example.spring_be_nvp.dto.*;

public interface EmployeeService {
    EmployeeDTO createEmployee(EmployeeCreateDTO request);
    List<EmployeeDTO> getAllEmployees();
    EmployeeDTO getEmployeeById(Long id);
    EmployeeDTO updateEmployee(Long id, EmployeeUpdateDTO request);
    void deleteEmployee(Long id);

}
