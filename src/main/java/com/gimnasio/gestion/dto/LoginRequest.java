// src/main/java/com/gimnasio/gestion/dto/LoginRequest.java

package com.gimnasio.gestion.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}