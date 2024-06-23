
package com.example.usuarios.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import com.example.usuarios.dto.SearchCriteriaDTO;
import com.example.usuarios.dto.WrapperKey;
import com.example.usuarios.model.Usuarios;
import com.example.usuarios.model.UsuariosId;
import com.example.usuarios.repository.UsuariosRepository;
import com.example.usuarios.exception.ResourceNotFoundException;

import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class UsuariosService {

    @Autowired
    private UsuariosRepository usuariosRepository;

    public Usuarios findByKeys(WrapperKey key) throws ResourceNotFoundException {
        UsuariosId id = new UsuariosId();
        id.setCodUsuario(key.getCodUsuario());
        Usuarios probe = new Usuarios();
        probe.setId(id);
        Example<Usuarios> example = Example.of(probe);

        return usuariosRepository.findOne(example)
                .orElseThrow(() -> new ResourceNotFoundException("Usuarios not found with provided keys"));
    }

    public Page<Usuarios> search(SearchCriteriaDTO criteria, Pageable pageable) {
        Specification<Usuarios> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            for (Map.Entry<String, Map<String, Object>> entry : criteria.getCriteria().entrySet()) {
                String key = entry.getKey();
                Map<String, Object> valueMap = entry.getValue();
                Path<?> path = getPath(root, key);

                for (Map.Entry<String, Object> valueEntry : valueMap.entrySet()) {
                    String operation = valueEntry.getKey();
                    Object value = valueEntry.getValue();
                    switch (operation) {
                        case "like":
                            predicates.add(cb.like(path.as(String.class), "%" + value + "%"));
                            break;
                        case "eq":
                            predicates.add(cb.equal(path, value));
                            break;
                        case "neq":
                            predicates.add(cb.notEqual(path, value));
                            break;
                        case "gt":
                            predicates.add(cb.greaterThan(path.as((Class<? extends Comparable>) value.getClass()), (Comparable) value));
                            break;
                        case "lt":
                            predicates.add(cb.lessThan(path.as((Class<? extends Comparable>) value.getClass()), (Comparable) value));
                            break;
                        case "gte":
                            predicates.add(cb.greaterThanOrEqualTo(path.as((Class<? extends Comparable>) value.getClass()), (Comparable) value));
                            break;
                        case "lte":
                            predicates.add(cb.lessThanOrEqualTo(path.as((Class<? extends Comparable>) value.getClass()), (Comparable) value));
                            break;
                        case "in":
                            predicates.add(path.in((List<?>) value));
                            break;
                        case "notIn":
                            predicates.add(cb.not(path.in((List<?>) value)));
                            break;
                    }
                }
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return usuariosRepository.findAll(spec, pageable);
    }

    
    private Path<?> getPath(Root<Usuarios> root, String key) {
        switch (key) {
            
            case "codUsuario":
                return root.get("id").get("codUsuario");
            default:
                return root.get(key);
        }
    }

    public Usuarios save(Usuarios entity) {
        return usuariosRepository.save(entity);
    }
}
