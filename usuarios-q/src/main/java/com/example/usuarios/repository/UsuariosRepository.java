
package com.example.usuarios.repository;

import com.example.usuarios.model.Usuarios;
import com.example.usuarios.model.UsuariosId;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class UsuariosRepository {

    private final JdbcTemplate jdbcTemplate;

    public UsuariosRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Usuarios findById(UsuariosId key) {
        String sql = "SELECT * FROM EAL_USUS_USUARIOS WHERE COD_USUARIO = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{key.getCodUsuario()}, new UsuariosRowMapper());
    }

    public List<Usuarios> findAll() {
        String sql = "SELECT * FROM EAL_USUS_USUARIOS";
        return jdbcTemplate.query(sql, new UsuariosRowMapper());
    }

    public void save(Usuarios entity) {
        // Implement the save logic using JDBC
    }

    private static class UsuariosRowMapper implements RowMapper<Usuarios> {
        @Override
        public Usuarios mapRow(ResultSet rs, int rowNum) throws SQLException {
            Usuarios entity = new Usuarios();
            UsuariosId id = new UsuariosId();
            entity.setCodUsuario(rs.getString("COD_USUARIO"));
            entity.setId(id);
            // Set other fields
            return entity;
        }
    }
}
