import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ProductStats } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  products: Product[] = [];
  stats: ProductStats | null = null;

  searchTerm = '';
  selectedCategory = 'Todos';
  viewMode: 'grid' | 'table' = 'grid';

  categories = ['Todos', 'Cafés Calientes', 'Cafés Fríos', 'Bebidas Frías', 'Pastelería', 'Postres'];

  // Estado del modal de creación/edición
  isModalOpen = false;
  isEditing = false;
  currentProduct: Product = this.getEmptyProduct();

  // Estado del modal de confirmación de eliminación
  isDeleteModalOpen = false;
  productToDelete: Product | null = null;

  // Notificaciones Toast
  toastMessage = '';
  toastType: 'success' | 'error' | 'info' = 'success';
  showToast = false;

  isLoading = false;

  constructor(
    public productService: ProductService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadStats();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts(this.searchTerm, this.selectedCategory).subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.displayToast('Error al conectar con la API de CoffeeCraft.', 'error');
      }
    });
  }

  loadStats(): void {
    this.productService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: () => {}
    });
  }

  onSearch(): void {
    this.loadProducts();
  }

  onCategorySelect(category: string): void {
    this.selectedCategory = category;
    this.loadProducts();
  }

  openCreateModal(): void {
    this.isEditing = false;
    this.currentProduct = this.getEmptyProduct();
    this.isModalOpen = true;
  }

  openEditModal(product: Product): void {
    this.isEditing = true;
    this.currentProduct = { ...product };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.currentProduct = this.getEmptyProduct();
  }

  saveProduct(): void {
    if (!this.currentProduct.name.trim() || this.currentProduct.price == null || this.currentProduct.stock == null) {
      this.displayToast('Por favor completa los campos obligatorios.', 'error');
      return;
    }

    if (!this.currentProduct.imageUrl || this.currentProduct.imageUrl.trim() === '') {
      this.currentProduct.imageUrl = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80';
    }

    if (this.isEditing && this.currentProduct.id) {
      this.productService.updateProduct(this.currentProduct.id, this.currentProduct).subscribe({
        next: () => {
          this.displayToast('¡Producto actualizado exitosamente!', 'success');
          this.closeModal();
          this.loadProducts();
          this.loadStats();
        },
        error: () => {
          this.displayToast('Error al actualizar el producto.', 'error');
        }
      });
    } else {
      this.productService.createProduct(this.currentProduct).subscribe({
        next: () => {
          this.displayToast('¡Nuevo producto añadido al menú!', 'success');
          this.closeModal();
          this.loadProducts();
          this.loadStats();
        },
        error: () => {
          this.displayToast('Error al guardar el producto.', 'error');
        }
      });
    }
  }

  openDeleteModal(product: Product): void {
    this.productToDelete = product;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.productToDelete = null;
  }

  confirmDelete(): void {
    if (this.productToDelete && this.productToDelete.id) {
      this.productService.deleteProduct(this.productToDelete.id).subscribe({
        next: () => {
          this.displayToast('Producto eliminado del menú.', 'info');
          this.closeDeleteModal();
          this.loadProducts();
          this.loadStats();
        },
        error: () => {
          this.displayToast('Error al eliminar el producto.', 'error');
        }
      });
    }
  }

  toggleAvailability(product: Product): void {
    if (product.id) {
      this.productService.toggleStatus(product.id).subscribe({
        next: (updated) => {
          product.available = updated.available;
          this.displayToast(
            `Estado cambiado: ${updated.available ? 'Disponible' : 'No disponible'}`,
            'info'
          );
          this.loadStats();
        },
        error: () => {
          this.displayToast('Error al cambiar la disponibilidad.', 'error');
        }
      });
    }
  }

  // Roles de usuario
  isAdmin(): boolean {
    const user = this.authService.getUser();
    return user?.role === 'ROLE_ADMIN' || user?.username === 'admin';
  }

  isBarista(): boolean {
    const user = this.authService.getUser();
    if (this.isAdmin()) return false;
    return (user?.role === 'ROLE_BARISTA' || user?.username === 'demo') && user?.username !== 'cliente';
  }

  isClient(): boolean {
    const user = this.authService.getUser();
    return !this.isAdmin() && !this.isBarista();
  }

  // Carrito de compras / Pedidos para clientes
  cart: { product: Product; quantity: number }[] = [];
  isCartOpen = false;

  addToCart(product: Product): void {
    if (!product.available) {
      this.displayToast('Este artículo no está disponible actualmente.', 'error');
      return;
    }
    const existing = this.cart.find(item => item.product.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.cart.push({ product, quantity: 1 });
    }
    this.displayToast(`☕ ¡${product.name} añadido a tu orden!`, 'success');
  }

  updateQuantity(index: number, delta: number): void {
    if (this.cart[index]) {
      this.cart[index].quantity += delta;
      if (this.cart[index].quantity <= 0) {
        this.cart.splice(index, 1);
      }
    }
  }

  removeFromCart(index: number): void {
    this.cart.splice(index, 1);
  }

  getCartTotal(): number {
    return this.cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }

  getCartCount(): number {
    return this.cart.reduce((acc, item) => acc + item.quantity, 0);
  }

  checkoutOrder(): void {
    if (this.cart.length === 0) return;
    const itemsCount = this.getCartCount();
    this.cart = [];
    this.isCartOpen = false;
    this.displayToast(`🎉 ¡Pedido de ${itemsCount} producto(s) confirmado! El barista lo está preparando.`, 'success');
  }

  displayToast(msg: string, type: 'success' | 'error' | 'info'): void {
    this.toastMessage = msg;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3500);
  }

  private getEmptyProduct(): Product {
    return {
      name: '',
      description: '',
      category: 'Cafés Calientes',
      price: 4.0,
      stock: 20,
      imageUrl: '',
      available: true
    };
  }
}
