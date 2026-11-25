# ☕ CoffeeCraft - Artisan Barista Suite

> Sistema integral de gestión de menú, catálogo y pedidos para cafeterías de especialidad.
> Desarrollado con **Spring Boot (Backend REST API)** y **Angular (Frontend)**.

---

## 👥 Sistema de Roles y Accesos

El sistema cuenta con 3 perfiles claramente diferenciados:

| Rol | Usuario | Contraseña | ¿Qué puede hacer en el sistema? |
|---|---|---|---|
| 👑 **Administrador** | `admin` | `admin123` | **Control Total:** Crear, editar y eliminar productos del menú; ver estadísticas completas y valor monetario del inventario; activar/desactivar artículos. |
| ☕ **Barista Staff** *(demo)* | `demo` | `demo123` | **Operativo de Tienda:** Ver la carta y stock de ingredientes; alternar disponibilidad (*Disponible / Agotado*) cuando un café se termina. No puede borrar productos ni ver métricas financieras confidenciales. |
| 👤 **Cliente VIP** | `cliente` | `cliente123` | **Experiencia de Cliente:** Ver la carta con fotos y notas de cata; filtrar por categorías; armar su **orden / carrito de pedidos** interactivo y confirmar su pedido. |

*(En la pantalla de Login tienes **3 botones de acceso rápido** para probar cada rol con un solo clic).*

---

## 🚀 Características Principales

- **Gestión por Roles:** Vistas y acciones dinámicas según el tipo de usuario autenticado (`ROLE_ADMIN`, `ROLE_BARISTA`, `ROLE_CLIENT`).
- **Carrito & Pedidos para Clientes:** Carrito de compras interactivo con selector de cantidades (+/-), cálculo automático de total a pagar y confirmación de orden.
- **CRUD Completo de Menú (Admin):**
  - **Crear:** Formulario modal para registrar nuevos cafés o postres con imagen, categoría, precio y stock.
  - **Leer:** Listado con buscador reactivo y chips de categorías (*Cafés Calientes, Cafés Fríos, Bebidas Frías, Pastelería, Postres*).
  - **Actualizar:** Modificación de datos con modal pre-cargado.
  - **Eliminar:** Confirmación de seguridad con modal de advertencia.
  - **Disponibilidad:** Toggle de un solo clic para pausar o reactivar productos.
- **Doble Modo de Visualización:**
  - **Vista Cuadrícula (Cards)**: Ideal para clientes y diseño visual tipo cafetería boutique.
  - **Vista Tabla**: Ideal para administradores y control rápido de inventario.
- **Base de Datos H2 en Memoria:** Sin configuraciones externas, disponible de inmediato con consola web en `http://localhost:8080/h2-console`.

---

## ⚡ Ejecución Rápida

1. **Iniciar todo con 1 clic (Windows):**
   - Ejecuta [start-all.bat](file:///c:/Users/Angel/Documents/proyecto16/start-all.bat)

2. **O de forma manual:**
   - **Backend:** `cd backend ; mvn spring-boot:run` (Puerto 8080)
   - **Frontend:** `cd frontend ; npm start` (Puerto 4200)
