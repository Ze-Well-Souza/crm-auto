-- Inserir 20 veículos atendidos na mecânica
INSERT INTO public.vehicles (client_id, brand, model, year, license_plate, vin, color, fuel_type, engine, mileage, notes) 
SELECT 
  c.id as client_id,
  brand,
  model,
  year,
  license_plate,
  vin,
  color,
  fuel_type,
  engine,
  mileage,
  notes
FROM (
  VALUES 
    ('Volkswagen', 'Gol', 2018, 'ABC-1234', '9BWZZZ377VT004251', 'Branco', 'Flex', '1.0', 45000, 'Revisão de 45.000km realizada. Cliente satisfeito com o atendimento.'),
    ('Honda', 'Civic', 2020, 'DEF-5678', '19XFC2F59KE000123', 'Prata', 'Flex', '1.5 Turbo', 32000, 'Troca de óleo e filtros. Carro impecável, bem conservado.'),
    ('Toyota', 'Corolla', 2019, 'GHI-9012', 'JTDEPRAE9KJ123456', 'Preto', 'Flex', '1.8', 55000, 'Manutenção preventiva completa. Proprietária muito cuidadosa.'),
    ('Ford', 'Ka', 2017, 'JKL-3456', '9BFZK5TW6HB123456', 'Vermelho', 'Flex', '1.0', 78000, 'Reparo no sistema elétrico e troca de pneus. Serviço finalizado com sucesso.'),
    ('Chevrolet', 'Onix', 2021, 'MNO-7890', '9BGKS48A0MG123456', 'Azul', 'Flex', '1.0 Turbo', 18000, 'Carro seminovo, apenas manutenção básica realizada.'),
    ('Fiat', 'Uno', 2016, 'PQR-2345', '9BD15802FGB123456', 'Cinza', 'Flex', '1.0', 95000, 'Revisão geral do motor. Cliente fiel há 3 anos.'),
    ('Nissan', 'March', 2018, 'STU-6789', '3N1BC13E78L123456', 'Branco', 'Flex', '1.0', 62000, 'Troca do sistema de embreagem. Trabalho complexo realizado com perfeição.'),
    ('Hyundai', 'HB20', 2020, 'VWX-0123', 'KMHPB81DBLM123456', 'Prata', 'Flex', '1.0', 28000, 'Manutenção preventiva e alinhamento. Cliente recomendou para amigos.'),
    ('Renault', 'Sandero', 2019, 'YZA-4567', '93YAHR0T1KJ123456', 'Preto', 'Flex', '1.6', 48000, 'Reparo no ar condicionado e troca de correias. Serviço garantido.'),
    ('Peugeot', '208', 2018, 'BCD-8901', '9HR208LEJT8123456', 'Azul', 'Flex', '1.2', 58000, 'Carro francês com manutenção especializada. Cliente satisfeito.'),
    ('Volkswagen', 'Polo', 2019, 'EFG-2345', '9BWAA05Z0KP123456', 'Branco', 'TSI', '1.0 Turbo', 41000, 'Motor turbo com manutenção específica. Tudo funcionando perfeitamente.'),
    ('Honda', 'Fit', 2017, 'HIJ-6789', '3HGGK5H40HM123456', 'Vermelho', 'Flex', '1.5', 72000, 'Carro confiável, apenas trocas básicas realizadas.'),
    ('Toyota', 'Etios', 2016, 'KLM-0123', 'JTEBU4BF0GK123456', 'Prata', 'Flex', '1.3', 89000, 'Revisão completa do sistema de freios. Segurança em primeiro lugar.'),
    ('Ford', 'Fiesta', 2018, 'NOP-4567', 'WF0SXXGAJS8123456', 'Preto', 'Flex', '1.6', 56000, 'Manutenção no câmbio automático. Trabalho especializado.'),
    ('Chevrolet', 'Prisma', 2019, 'QRS-8901', '9BGKS48A0MG654321', 'Cinza', 'Flex', '1.4', 43000, 'Sedan bem conservado, manutenção preventiva regular.'),
    ('Fiat', 'Argo', 2020, 'TUV-2345', '9BD191106LM123456', 'Azul', 'Flex', '1.3', 25000, 'Carro novo na linha Fiat, primeira manutenção realizada.'),
    ('Mitsubishi', 'Lancer', 2015, 'WXY-6789', 'JA3AY26V5FU123456', 'Preto', 'Gasolina', '2.0', 105000, 'Sedan esportivo, manutenção no motor e suspensão.'),
    ('Citroën', 'C3', 2017, 'ZAB-0123', '9HZCSR68HS8123456', 'Branco', 'Flex', '1.2', 67000, 'Carro francês com características únicas. Manutenção especializada.'),
    ('Jeep', 'Renegade', 2018, 'CDE-4567', '1C4HJWDG6JL123456', 'Verde', 'Flex', '1.8', 51000, 'SUV robusto, manutenção do sistema 4x4 e transmissão.'),
    ('BMW', '320i', 2016, 'FGH-8901', 'WBA3A5G50GN123456', 'Prata', 'Gasolina', '2.0 Turbo', 78000, 'Carro premium com manutenção especializada. Cliente VIP da oficina.')
) AS vehicle_data(brand, model, year, license_plate, vin, color, fuel_type, engine, mileage, notes)
CROSS JOIN (
  SELECT id FROM public.clients ORDER BY RANDOM() LIMIT 1
) AS c(id);