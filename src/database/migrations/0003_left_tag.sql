CREATE TABLE `marcas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`descripcion` varchar(100) NOT NULL,
	`es_alta_gama` boolean NOT NULL DEFAULT false,
	`activo` boolean NOT NULL DEFAULT true,
	CONSTRAINT `marcas_id` PRIMARY KEY(`id`),
	CONSTRAINT `marcas_descripcion_unique` UNIQUE(`descripcion`)
);
--> statement-breakpoint
ALTER TABLE `planes` ADD `precio_base` decimal(10,2) DEFAULT '350.00' NOT NULL;