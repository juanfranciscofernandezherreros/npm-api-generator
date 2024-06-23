
package com.example.usuarios.model;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class UsuariosId implements Serializable {

    @Column(name = "COD_USUARIO", nullable = false)
    private String codUsuario;


    public String getCodUsuario() {
        return codUsuario;
    }

    public void setCodUsuario(String codUsuario) {
        this.codUsuario = codUsuario;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        UsuariosId that = (UsuariosId) o;

        // Check all fields for equality
        return this.codUsuario.equals(that.codUsuario);
    }

    @Override
    public int hashCode() {
        int result = this.codUsuario.hashCode();
        return result;
    }
}
