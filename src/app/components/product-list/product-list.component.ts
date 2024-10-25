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
  filteredProducts: any[] = [];
  searchTerm: string = '';
  showModal: boolean = false;
  selectedProductTitle = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  selectedProductId: string | null = null;
  selectedProductName: string = '';

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe((products: any[]) => {
      this.products = products[0];
      this.filteredProducts = this.products;
    });
  }

  filterProducts(): void {
    if (!this.searchTerm) {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  addProduct() {
    this.router.navigate([`/create`]);
  }

  editProduct(id: string): void {
    this.router.navigate([`/edit/${id}`]);
  }


  openDeleteModal(id: string, name: string): void {
    this.selectedProductId = id;
    this.selectedProductName = name;
    this.showModal = true;
  }

  cancelDelete(): void {
    this.showModal = false;
    this.selectedProductId = null;
  }

  confirmDelete(): void {
    if (this.selectedProductId) {
      this.productService.deleteProduct(this.selectedProductId).subscribe(
        () => {
          this.loadProducts();
        },
        error => {
          console.error('Error al eliminar el producto');
        }
      );
      this.showModal = false;
      this.selectedProductId = null;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts();
    }
  }

  nextPage(): void {
    this.currentPage++;
    this.loadProducts();
  }
}
