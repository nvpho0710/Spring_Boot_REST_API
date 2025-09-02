
package com.example.spring_be_nvp.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<?> handleResourceNotFound(ResourceNotFoundException ex) {
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
				"status", "error",
				"code", HttpStatus.NOT_FOUND.value(),
				"message", ex.getMessage()
		));
	}

	@ExceptionHandler(DuplicateEmailException.class)
	public ResponseEntity<?> handleDuplicateEmail(DuplicateEmailException ex) {
		return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
				"status", "error",
				"code", HttpStatus.CONFLICT.value(),
				"message", ex.getMessage()
		));
	}
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
		Map<String, String> errors = new HashMap<>();
		ex.getBindingResult().getFieldErrors().forEach(error ->
				errors.put(error.getField(), error.getDefaultMessage()));
		return ResponseEntity.badRequest().body(Map.of(
				"status", "error",
				"code", HttpStatus.BAD_REQUEST.value(),
				"errors", errors
		));
	}

	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<?> handleRuntimeException(RuntimeException ex) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
				"status", "error",
				"code", HttpStatus.BAD_REQUEST.value(),
				"message", ex.getMessage()
		));
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<?> handleException(Exception ex) {
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
				"status", "error",
				"code", HttpStatus.INTERNAL_SERVER_ERROR.value(),
				"message", "Internal server error"
		));
	}
}