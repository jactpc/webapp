-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 07-01-2026 a las 16:37:22
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `camisetas`
--
CREATE DATABASE IF NOT EXISTS `camisetas` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `camisetas`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `color_polera`
--

CREATE TABLE `color_polera` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `code_back` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `color_polera`
--

INSERT INTO `color_polera` (`id`, `nombre`, `code_back`) VALUES
(1, 'Blanco', 'FFFFFF'),
(2, 'Negro', '303030'),
(3, 'Rojo', 'FF0000'),
(4, 'Azul', '0000FF'),
(5, 'Verde', '00FF00'),
(6, 'Gris', '808080');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `design_assets`
--

CREATE TABLE `design_assets` (
  `id` int(11) NOT NULL,
  `material_id` int(11) NOT NULL,
  `side` enum('front','back','leftsleeve','rightsleeve') NOT NULL,
  `name` varchar(100) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `priority` int(11) DEFAULT 0,
  `scale_x` decimal(5,2) DEFAULT 1.00,
  `scale_y` decimal(5,2) DEFAULT 1.00,
  `offset_x` int(11) DEFAULT 0,
  `offset_y` int(11) DEFAULT 0,
  `area_x` int(11) NOT NULL DEFAULT 140,
  `area_y` int(11) NOT NULL DEFAULT 140,
  `area_width` int(11) NOT NULL DEFAULT 300,
  `area_height` int(11) NOT NULL DEFAULT 500,
  `area_unit` varchar(10) DEFAULT 'px',
  `active` tinyint(1) DEFAULT 1,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `design_assets`
--

INSERT INTO `design_assets` (`id`, `material_id`, `side`, `name`, `image_url`, `priority`, `scale_x`, `scale_y`, `offset_x`, `offset_y`, `area_x`, `area_y`, `area_width`, `area_height`, `area_unit`, `active`, `updated_at`) VALUES
(1, 1, 'front', 'Pecho', 'img/1front.php', 1, NULL, NULL, NULL, NULL, 145, 143, 329, 546, 'px', 1, '2026-01-03 00:39:49'),
(2, 1, 'back', 'Espalda', 'img/1back.php', 2, NULL, NULL, 0, 0, 139, 115, 339, 587, 'px', 1, '2026-01-02 23:05:40'),
(3, 1, 'leftsleeve', 'Manga izq', 'img/1leftsleeve.php', 3, NULL, NULL, 10, 10, 283, 127, 154, 201, 'px', 1, '2026-01-02 23:06:14'),
(4, 1, 'rightsleeve', 'Manga der', 'img/1rightSleeve.php', 4, NULL, NULL, -10, 10, 158, 137, 156, 198, 'px', 1, '2026-01-02 23:04:21'),
(5, 2, 'front', 'Pecho', 'img/3front.php', 1, NULL, NULL, NULL, NULL, 128, 160, 358, 494, 'px', 1, '2026-01-07 15:34:13'),
(6, 2, 'back', 'Espalda', 'img/3back.php', 2, NULL, NULL, NULL, NULL, 1, 1, 1, 1, 'px', 1, '2026-01-07 15:09:48');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `material_polera`
--

CREATE TABLE `material_polera` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `imgIcon` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `material_polera`
--

INSERT INTO `material_polera` (`id`, `nombre`, `imgIcon`) VALUES
(1, 'Polera polo cuello redondo', 'poleraIconBlanco.png'),
(2, 'Polerón canguro', 'poleronIconBlanco.png'),
(3, 'Polerón canguro con cierre', 'poleronCierreIconBlanco.png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `stock_polera`
--

CREATE TABLE `stock_polera` (
  `id` int(11) NOT NULL,
  `id_material` int(11) NOT NULL,
  `id_color` int(11) NOT NULL,
  `id_tallas` int(11) NOT NULL,
  `cantidad` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `stock_polera`
--

INSERT INTO `stock_polera` (`id`, `id_material`, `id_color`, `id_tallas`, `cantidad`) VALUES
(1, 1, 1, 1, 10),
(2, 1, 1, 2, 15),
(3, 1, 1, 3, 20),
(4, 1, 1, 4, 15),
(5, 1, 1, 5, 10),
(6, 1, 1, 6, 5),
(7, 1, 2, 1, 10),
(8, 1, 2, 2, 15),
(9, 1, 2, 3, 20),
(10, 1, 2, 4, 15),
(11, 1, 2, 5, 10),
(12, 1, 2, 6, 5),
(13, 1, 3, 1, 10),
(14, 1, 3, 2, 15),
(15, 1, 3, 3, 20),
(16, 1, 3, 4, 15),
(17, 1, 3, 5, 10),
(18, 1, 3, 6, 5),
(19, 2, 1, 3, 15),
(20, 2, 1, 4, 20),
(21, 2, 1, 5, 15),
(22, 2, 1, 6, 10),
(23, 2, 2, 3, 15),
(24, 2, 2, 4, 20),
(25, 2, 2, 5, 15),
(26, 2, 2, 6, 10),
(27, 2, 6, 3, 15),
(28, 2, 6, 4, 20),
(29, 2, 6, 5, 15),
(30, 2, 6, 6, 10),
(31, 3, 1, 1, 8),
(32, 3, 1, 2, 12),
(33, 3, 1, 3, 18),
(34, 3, 1, 4, 12),
(35, 3, 1, 5, 8),
(36, 3, 1, 6, 4),
(37, 3, 2, 1, 8),
(38, 3, 2, 2, 12),
(39, 3, 2, 3, 18),
(40, 3, 2, 4, 12),
(41, 3, 2, 5, 8),
(42, 3, 2, 6, 4),
(43, 3, 3, 1, 8),
(44, 3, 3, 2, 12),
(45, 3, 3, 3, 18),
(46, 3, 3, 4, 12),
(47, 3, 3, 5, 8),
(48, 3, 3, 6, 4),
(49, 3, 4, 1, 8),
(50, 3, 4, 2, 12),
(51, 3, 4, 3, 18),
(52, 3, 4, 4, 12),
(53, 3, 4, 5, 8),
(54, 3, 4, 6, 4),
(55, 3, 5, 1, 8),
(56, 3, 5, 2, 12),
(57, 3, 5, 3, 18),
(58, 3, 5, 4, 12),
(59, 3, 5, 5, 8),
(60, 3, 5, 6, 4),
(61, 3, 6, 1, 8),
(62, 3, 6, 2, 12),
(63, 3, 6, 3, 18),
(64, 3, 6, 4, 12),
(65, 3, 6, 5, 8),
(66, 3, 6, 6, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tallas_polera`
--

CREATE TABLE `tallas_polera` (
  `id` int(11) NOT NULL,
  `nombre` varchar(20) NOT NULL,
  `medidasx` decimal(10,2) DEFAULT NULL,
  `medidasy` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tallas_polera`
--

INSERT INTO `tallas_polera` (`id`, `nombre`, `medidasx`, `medidasy`) VALUES
(1, 'XS', 42.50, 65.50),
(2, 'S', 45.50, 68.50),
(3, 'M', 48.50, 71.50),
(4, 'L', 51.50, 74.50),
(5, 'XL', 54.50, 77.50),
(6, 'XXL', 57.50, 80.50);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `rol` enum('admin','editor','viewer') DEFAULT 'editor',
  `activo` tinyint(1) DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `ultimo_acceso` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `usuario`, `password`, `nombre`, `rol`, `activo`, `fecha_creacion`, `ultimo_acceso`) VALUES
(1, 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador', 'admin', 1, '2026-01-02 21:30:41', NULL),
(2, 'editor1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Editor Principal', 'editor', 1, '2026-01-02 21:30:41', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `color_polera`
--
ALTER TABLE `color_polera`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `design_assets`
--
ALTER TABLE `design_assets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_design_assets_material` (`material_id`),
  ADD KEY `idx_design_assets_active` (`active`),
  ADD KEY `idx_design_assets_side` (`side`);

--
-- Indices de la tabla `material_polera`
--
ALTER TABLE `material_polera`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `stock_polera`
--
ALTER TABLE `stock_polera`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_combo` (`id_material`,`id_color`,`id_tallas`),
  ADD KEY `idx_stock_material` (`id_material`),
  ADD KEY `idx_stock_color` (`id_color`),
  ADD KEY `idx_stock_tallas` (`id_tallas`);

--
-- Indices de la tabla `tallas_polera`
--
ALTER TABLE `tallas_polera`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario` (`usuario`),
  ADD KEY `idx_usuario_activo` (`usuario`,`activo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `color_polera`
--
ALTER TABLE `color_polera`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `design_assets`
--
ALTER TABLE `design_assets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `material_polera`
--
ALTER TABLE `material_polera`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `stock_polera`
--
ALTER TABLE `stock_polera`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT de la tabla `tallas_polera`
--
ALTER TABLE `tallas_polera`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `design_assets`
--
ALTER TABLE `design_assets`
  ADD CONSTRAINT `design_assets_ibfk_1` FOREIGN KEY (`material_id`) REFERENCES `material_polera` (`id`);

--
-- Filtros para la tabla `stock_polera`
--
ALTER TABLE `stock_polera`
  ADD CONSTRAINT `stock_polera_ibfk_1` FOREIGN KEY (`id_material`) REFERENCES `material_polera` (`id`),
  ADD CONSTRAINT `stock_polera_ibfk_2` FOREIGN KEY (`id_color`) REFERENCES `color_polera` (`id`),
  ADD CONSTRAINT `stock_polera_ibfk_3` FOREIGN KEY (`id_tallas`) REFERENCES `tallas_polera` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
