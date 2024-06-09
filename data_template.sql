-- Insertar datos de ejemplo en la tabla de criptomonedas
INSERT INTO cryptocurrencies (symbol, name, currentPrice, marketCap, circulatingSupply, totalSupply, maxSupply, change24h) VALUES
('BTC', 'Bitcoin', 35000.50, 650000000000, 18500000, 21000000, 21000000, 2.5),
('ETH', 'Ethereum', 2500.75, 300000000000, 115000000, 115000000, NULL, -1.2),
('ADA', 'Cardano', 1.25, 40000000000, 32000000000, 45000000000, 45000000000, 0.8);