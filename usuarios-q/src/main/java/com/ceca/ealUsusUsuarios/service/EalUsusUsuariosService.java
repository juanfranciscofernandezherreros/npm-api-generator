
package com.ceca.ealUsusUsuarios.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ceca.ealUsusUsuarios.model.EalUsusUsuarios;
import com.ceca.ealUsusUsuarios.repository.EalUsusUsuariosRepository;
import com.ceca.ealUsusUsuarios.exception.ResourceNotFoundException;

@Service
public class EalUsusUsuariosService {

    @Autowired
    private EalUsusUsuariosRepository ealUsusUsuariosRepository;

    public EalUsusUsuarios findById(String codUsuario) throws ResourceNotFoundException {
        return ealUsusUsuariosRepository.findById(codUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("EalUsusUsuarios not found with id: " + codUsuario));
    }
}
