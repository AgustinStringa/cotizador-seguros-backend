INSERT INTO `planes` (`codigo`, `nombre`, `recargo_porcentaje`, `descripcion`, `activo`)
VALUES 
  ('basico', 'Plan Básico', 20.00, 'Cobertura esencial contra terceros y responsabilidad civil', true),
  ('completo', 'Plan Completo', 50.00, 'Cobertura integral contra todo riesgo, robo, incendio y daños', true)
ON DUPLICATE KEY UPDATE `activo` = true;
