
package com.example.cryptomanager.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.example.cryptomanager.model.Cryptocurrency;
import com.example.cryptomanager.repository.CryptocurrencyRepository;
import com.example.cryptomanager.exception.ResourceNotFoundException;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Expression;
import java.util.ArrayList;
import java.util.Map;
import com.example.cryptomanager.dto.CryptocurrencyGroupedDTO;

@Service
public class CryptocurrencyService {

    @Autowired
    private CryptocurrencyRepository cryptocurrencyRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public Cryptocurrency findById(undefined undefined) throws ResourceNotFoundException {
        return cryptocurrencyRepository.findById(undefined)
                .orElseThrow(() -> new ResourceNotFoundException("Cryptocurrency not found with id: " + undefined));
    }

    public List<Cryptocurrency> findAll() {
        return cryptocurrencyRepository.findAll();
    }

    public Page<Cryptocurrency> filterMovies(Map<String, Map<String, Object>> filters, Pageable pageable) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Cryptocurrency> query = cb.createQuery(Cryptocurrency.class);
        Root<Cryptocurrency> root = query.from(Cryptocurrency.class);

        List<Predicate> predicates = new ArrayList<>();

        filters.forEach((field, operations) -> {
            operations.forEach((operator, value) -> {
                switch (operator) {
                    case "eq":
                        predicates.add(cb.equal(root.get(field), value));
                        break;
                    case "neq":
                        predicates.add(cb.notEqual(root.get(field), value));
                        break;
                    case "gt":
                        predicates.add(cb.greaterThan(root.get(field), (Comparable) value));
                        break;
                    case "lt":
                        predicates.add(cb.lessThan(root.get(field), (Comparable) value));
                        break;
                    case "gte":
                        predicates.add(cb.greaterThanOrEqualTo(root.get(field), (Comparable) value));
                        break;
                    case "lte":
                        predicates.add(cb.lessThanOrEqualTo(root.get(field), (Comparable) value));
                        break;
                    case "like":
                        predicates.add(cb.like(root.get(field), "%" + value + "%"));
                        break;
                    case "in":
                        predicates.add(root.get(field).in((List<?>) value));
                        break;
                    case "notIn":
                        predicates.add(cb.not(root.get(field).in((List<?>) value)));
                        break;
                    case "isNull":
                        if ((Boolean) value) {
                            predicates.add(cb.isNull(root.get(field)));
                        }
                        break;
                    case "isNotNull":
                        if ((Boolean) value) {
                            predicates.add(cb.isNotNull(root.get(field)));
                        }
                        break;
                    // Agrega más operadores según sea necesario
                }
            });
        });

        query.where(predicates.toArray(new Predicate[0]));

        List<Cryptocurrency> resultList = entityManager.createQuery(query)
                .setFirstResult((int) pageable.getOffset())
                .setMaxResults(pageable.getPageSize())
                .getResultList();

        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Cryptocurrency> countRoot = countQuery.from(Cryptocurrency.class);
        countQuery.select(cb.count(countRoot)).where(predicates.toArray(new Predicate[0]));
        Long count = entityManager.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(resultList, pageable, count);
    }

    public List<CryptocurrencyGroupedDTO> groupByField(String groupByField, Map<String, Map<String, Object>> filters) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<CryptocurrencyGroupedDTO> query = cb.createQuery(CryptocurrencyGroupedDTO.class);
        Root<Cryptocurrency> root = query.from(Cryptocurrency.class);

        List<Predicate> predicates = new ArrayList<>();

        filters.forEach((field, operations) -> {
            operations.forEach((operator, value) -> {
                switch (operator) {
                    case "eq":
                        predicates.add(cb.equal(root.get(field), value));
                        break;
                    case "neq":
                        predicates.add(cb.notEqual(root.get(field), value));
                        break;
                    case "gt":
                        predicates.add(cb.greaterThan(root.get(field), (Comparable) value));
                        break;
                    case "lt":
                        predicates.add(cb.lessThan(root.get(field), (Comparable) value));
                        break;
                    case "gte":
                        predicates.add(cb.greaterThanOrEqualTo(root.get(field), (Comparable) value));
                        break;
                    case "lte":
                        predicates.add(cb.lessThanOrEqualTo(root.get(field), (Comparable) value));
                        break;
                    case "like":
                        predicates.add(cb.like(root.get(field), "%" + value + "%"));
                        break;
                    case "in":
                        predicates.add(root.get(field).in((List<?>) value));
                        break;
                    case "notIn":
                        predicates.add(cb.not(root.get(field).in((List<?>) value)));
                        break;
                    case "isNull":
                        if ((Boolean) value) {
                            predicates.add(cb.isNull(root.get(field)));
                        }
                        break;
                    case "isNotNull":
                        if ((Boolean) value) {
                            predicates.add(cb.isNotNull(root.get(field)));
                        }
                        break;
                    // Agrega más operadores según sea necesario
                }
            });
        });

        query.where(predicates.toArray(new Predicate[0]));

        Expression<String> groupByExpression = root.get(groupByField);
        query.multiselect(groupByExpression, cb.count(root));
        query.groupBy(groupByExpression);

        return entityManager.createQuery(query).getResultList();
    }
}
