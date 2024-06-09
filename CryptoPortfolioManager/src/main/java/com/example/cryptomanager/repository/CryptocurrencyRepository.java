
package com.example.cryptomanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.cryptomanager.model.Cryptocurrency;

public interface CryptocurrencyRepository extends JpaRepository<Cryptocurrency, Long> {
}
