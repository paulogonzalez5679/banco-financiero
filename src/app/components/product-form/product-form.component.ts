import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  idInvalid: boolean = false;
  idExist: boolean = false;
  product: any;
  isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
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
    this.getTypeAction();
  }

  getTypeAction() {
    this.route.queryParams.subscribe(params => {
      this.isEdit = params['isEdit'] === 'true'; // Verifica si isEdit es 'true'
      if (this.isEdit) {
        this.productService.currentProduct.subscribe(product => {
          this.product = product;
          if (this.product) {
            // Llenar el formulario con los datos del producto
            this.productForm.patchValue({
              id: this.product.id,
              name: this.product.name,
              description: this.product.description,
              logo: this.product.logo,
              date_release: this.product.date_release,
              date_revision: this.product.date_revision
            });
            // Deshabilitar el campo ID si estamos en modo edición
            this.productForm.get('id')?.disable();
          }
        });
      }
    });
  }

  validateID(): void {
    const productId = this.productForm.value.id;
    this.productService.verifyProductId(productId).subscribe({
      next: (response) => {
        this.idExist = response;
      },
      complete: () => {
        if (this.idExist) {
          alert('Error al crear el producto! ID existente');
          this.idInvalid = true;
        } else {
          this.isEdit ? this.updateProduct() : this.createProduct(); // Llama al método correspondiente
        }
      },
      error: (error) => {
        alert('Error al validar '+ error);
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

  updateProduct(): void {
    const productId = this.product.id;
    const updatedProductData = {
      name: this.productForm.value.name,
      description: this.productForm.value.description,
      logo: this.productForm.value.logo,
      date_release: this.productForm.value.date_release,
      date_revision: this.productForm.value.date_revision
    };

    this.productService.updateProduct(productId, updatedProductData).subscribe(
      () => {
        alert('Producto actualizado con éxito');
        this.router.navigate(['/']);
      },
      error => {
        alert('Error al actualizar el producto');
      }
    );
  }

  resetForm(): void {
    this.productForm.reset();
    this.idInvalid = false;
  }

  dateValidator(control: any) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const releaseDate = new Date(control.value);
    releaseDate.setHours(0, 0, 0, 0);
    return releaseDate < today ? { minDate: true } : null;
  }

  dateAfterReleaseValidator(control: any) {
    const releaseDate = new Date(this.productForm.get('date_release')?.value);
    const revisionDate = new Date(control.value);
    return revisionDate.getFullYear() <= releaseDate.getFullYear() ? { dateAfterRelease: true } : null;
  }
}
