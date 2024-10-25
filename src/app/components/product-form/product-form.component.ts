import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  idInvalid: boolean = false; // Variable para controlar el estado del ID inválido
  idExist: boolean = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', [Validators.required]],
      date_release: ['', [Validators.required]],
      date_revision: ['', [Validators.required]]
    });

    this.productForm.get('date_release')?.setValidators([
      Validators.required,
      this.dateValidator.bind(this)
    ]);

    this.productForm.get('date_revision')?.setValidators([
      Validators.required,
      this.dateAfterReleaseValidator.bind(this)
    ]);
  }

  ngOnInit(): void {
    // Cargar datos si es necesario (para edición)
  }


  validateID(): void {
    const productId = this.productForm.value.id;
    this.productService.verifyProductId(productId).subscribe({
      next: (response) => {
        this.idExist = response;
      },complete: () => {
        if (this.idExist) {
          alert('Error al crear el producto! ID existente');
          this.idInvalid = true;
        } else {
          this.createProduct();
        }
      },error: (error) => {
        console.error('Error verifying product ID:', error);
      }
    });
  }



  createProduct(): void {
    if (this.productForm.valid) {
      this.productService.createProduct(this.productForm.value).subscribe(
        () => {
          alert('Producto creado con éxito');
          this.router.navigate(['/']);
        },
        error => {
          alert('Error al crear el producto');
        }
      );
    }
  }

  resetForm(): void {
    this.productForm.reset();
    this.idInvalid = false; // Reiniciar el estado de ID inválido
  }

  dateValidator(control: any) {
    const today = new Date();
    const releaseDate = new Date(control.value);
    return releaseDate < today ? { minDate: true } : null;
  }

  dateAfterReleaseValidator(control: any) {
    const releaseDate = new Date(this.productForm.get('date_release')?.value);
    const revisionDate = new Date(control.value);
    return revisionDate.getFullYear() <= releaseDate.getFullYear() ? { dateAfterRelease: true } : null;
  }
}
