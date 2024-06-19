
package com.ceca.ealUsusUsuarios.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ceca.ealUsusUsuarios.dto.EalUsusUsuariosDto;
import com.ceca.ealUsusUsuarios.mapper.EalUsusUsuariosMapper;
import com.ceca.ealUsusUsuarios.service.EalUsusUsuariosService;

@RestController
@RequestMapping("/usuarios")
public class EalUsusUsuariosController {

    @Autowired
    private EalUsusUsuariosService ealUsusUsuariosService;

    @Autowired
    private EalUsusUsuariosMapper ealusususuariosMapper;

    @GetMapping("/{codUsuario}")
    public ResponseEntity<EalUsusUsuariosDto> findById(@PathVariable String codUsuario) {
        return ResponseEntity.ok(ealusususuariosMapper.toDto(ealUsusUsuariosService.findById(codUsuario)));
    }
}
