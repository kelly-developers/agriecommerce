package com.example.agriecommerce.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateRequest {
    @Size(min = 2, max = 50)
    private String firstName;

    @Size(min = 2, max = 50)
    private String lastName;

    @Size(min = 10, max = 20)
    private String phone;

    @Size(min = 6)
    private String password;
}