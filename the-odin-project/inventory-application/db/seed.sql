BEGIN;

-- Categories (idempotent)
INSERT INTO categories (name, description) VALUES
('Indoor Plants', 'Beautiful houseplants to brighten your home.'),
('Pots & Planters', 'Stylish pots and planters for your plants.'),
('Plant Care Tools', 'Everything you need to keep your plants healthy.'),
('Accessories', 'Stands, misters, and other plant accessories.')
ON CONFLICT (name) DO NOTHING;

-- Items (idempotent via UNIQUE(category_id, name))
INSERT INTO items (category_id, name, description, price, image_url, stock_quantity) VALUES
((SELECT id FROM categories WHERE name = 'Indoor Plants'), 'Monstera Deliciosa', 'Tropical plant with iconic split leaves.', 45.00, 'https://images.unsplash.com/photo-1609648756066-976f46028e6d?w=400', 12),
((SELECT id FROM categories WHERE name = 'Indoor Plants'), 'Snake Plant', 'Low-maintenance plant perfect for beginners.', 25.00, 'https://images.unsplash.com/photo-1547516508-e910d368d995?w=400', 20),
((SELECT id FROM categories WHERE name = 'Pots & Planters'), 'Ceramic Planter - White (20cm)', 'Minimalist ceramic pot for modern decor.', 15.00, 'https://images.unsplash.com/photo-1656414409557-0c510c360154?&w=400', 30),
((SELECT id FROM categories WHERE name = 'Plant Care Tools'), 'Pruning Shears', 'Stainless steel shears for clean cuts.', 12.50, 'https://plus.unsplash.com/premium_photo-1680322468906-d3ed1fb060d4?w=400', 15),
((SELECT id FROM categories WHERE name = 'Accessories'), 'Plant Mister (Glass)', 'Fine mist sprayer for humidity-loving plants.', 10.00, 'https://images.unsplash.com/photo-1610389473058-fd68ad1d8bac?w=400', 18)
ON CONFLICT (category_id, name) DO NOTHING;

COMMIT;
