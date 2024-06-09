CREATE TABLE cryptocurrencies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    symbol VARCHAR(10) NOT NULL,
    name VARCHAR(255) NOT NULL,
    currentPrice DOUBLE NOT NULL,
    marketCap DOUBLE NOT NULL,
    circulatingSupply DOUBLE NOT NULL,
    totalSupply DOUBLE,
    maxSupply DOUBLE,
    change24h DOUBLE NOT NULL
);