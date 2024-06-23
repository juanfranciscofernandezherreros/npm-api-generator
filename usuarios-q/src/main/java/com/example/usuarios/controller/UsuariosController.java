
package com.example.usuarios.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.usuarios.dto.SearchCriteriaDTO;
import com.example.usuarios.dto.WrapperKey;
import com.example.usuarios.dto.UsuariosDto;
import com.example.usuarios.mapper.UsuariosMapper;
import com.example.usuarios.service.UsuariosService;
import com.example.usuarios.model.Usuarios;

@RestController
@RequestMapping("/usuarios")
public class UsuariosController {

    @Autowired
    private UsuariosService usuariosService;

    @Autowired
    private UsuariosMapper usuariosMapper;

    @GetMapping("/find")
    public ResponseEntity<UsuariosDto> findByKeys(
            @RequestParam(required = false) String codUsuario) {
        WrapperKey key = new WrapperKey();
        key.setCodUsuario(codUsuario);
        return ResponseEntity.ok(usuariosMapper.toDto(usuariosService.findByKeys(key)));
    }

    @PostMapping("/search")
    public ResponseEntity<Page<UsuariosDto>> search(@RequestBody SearchCriteriaDTO criteria, @PageableDefault Pageable pageable) {
        Page<Usuarios> resultPage = usuariosService.search(criteria, pageable);
        return ResponseEntity.ok(resultPage.map(usuariosMapper::toDto));
    }

    @PostMapping
    public ResponseEntity<UsuariosDto> create(@RequestBody UsuariosDto usuariosDto) {
        Usuarios usuarios = usuariosMapper.toEntity(usuariosDto);
        Usuarios savedUsuarios = usuariosService.save(usuarios);
        return ResponseEntity.ok(usuariosMapper.toDto(savedUsuarios));
    }
}
