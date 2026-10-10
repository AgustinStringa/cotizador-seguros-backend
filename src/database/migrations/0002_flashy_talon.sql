CREATE TABLE `anios` (
	`id` int AUTO_INCREMENT NOT NULL,
	`anio` int NOT NULL,
	`factor_depreciacion` decimal(5,4) NOT NULL,
	`descripcion` varchar(255),
	`activo` boolean NOT NULL DEFAULT true,
	CONSTRAINT `anios_id` PRIMARY KEY(`id`),
	CONSTRAINT `anios_anio_unique` UNIQUE(`anio`)
);
