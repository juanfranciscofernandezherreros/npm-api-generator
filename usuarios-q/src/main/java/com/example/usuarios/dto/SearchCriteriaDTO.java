
package com.example.usuarios.dto;

import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public class SearchCriteriaDTO {

    private Map<String, Map<String, Object>> criteria = new HashMap<>();
}
