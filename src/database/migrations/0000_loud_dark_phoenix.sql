CREATE TABLE `cotizaciones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`marca` varchar(100) NOT NULL,
	`anio` int NOT NULL,
	`tipo_plan` varchar(50) NOT NULL,
	`precio_base` decimal(10,2) NOT NULL DEFAULT '2000.00',
	`factor_marca` decimal(6,4) NOT NULL,
	`factor_anio` decimal(6,4) NOT NULL,
	`factor_plan` decimal(6,4) NOT NULL,
	`precio_final` decimal(10,2) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cotizaciones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `planes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`codigo` varchar(50) NOT NULL,
	`nombre` varchar(100) NOT NULL,
	`recargo_porcentaje` decimal(5,2) NOT NULL,
	`descripcion` varchar(255),
	`activo` boolean NOT NULL DEFAULT true,
	CONSTRAINT `planes_id` PRIMARY KEY(`id`),
	CONSTRAINT `planes_codigo_unique` UNIQUE(`codigo`)
);
