import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe((products: any[]) => {
      this.products = products;
    });
  }

  editProduct(id: string): void {
    // Navegar a la página de edición con el ID del producto
    this.router.navigate([`/edit/${id}`]);
  }

  deleteProduct(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productService.deleteProduct(id).subscribe(
        () => {
          alert('Producto eliminado con éxito');
          // Después de eliminar el producto, recargar la lista de productos
          this.loadProducts();
        },
        error => {
          alert('Error al eliminar el producto');
        }
      );
    }
  }
}
