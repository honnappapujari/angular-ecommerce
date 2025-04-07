import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { CartItem } from '../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './payment.component.html'
})
export class PaymentComponent implements OnInit, OnDestroy {
  paymentForm: FormGroup;
  cartItems: CartItem[] = [];
  cartTotal: number = 0;
  isProcessing = false;
  private cartSubscription?: Subscription;
  private totalSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cartService: CartService,
    private orderService: OrderService
  ) {
    this.paymentForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      addressLine1: ['', [Validators.required, Validators.minLength(5)]],
      addressLine2: [''],
      city: ['', [Validators.required, Validators.minLength(2)]],
      state: ['', [Validators.required, Validators.minLength(2)]],
      postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{5,6}$')]],
      country: ['', [Validators.required, Validators.minLength(2)]],
      paymentMethod: ['credit_card', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cartSubscription = this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
    });

    this.totalSubscription = this.cartService.getCartTotal().subscribe(total => {
      this.cartTotal = total;
    });
  }

  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
    this.totalSubscription?.unsubscribe();
  }

  onSubmit(): void {
    if (this.paymentForm.valid && !this.isProcessing && this.cartItems.length > 0) {
      this.isProcessing = true;

      const shippingAddress = {
        fullName: this.paymentForm.get('fullName')?.value,
        phone: this.paymentForm.get('phone')?.value,
        addressLine1: this.paymentForm.get('addressLine1')?.value,
        addressLine2: this.paymentForm.get('addressLine2')?.value || '',
        city: this.paymentForm.get('city')?.value,
        state: this.paymentForm.get('state')?.value,
        postalCode: this.paymentForm.get('postalCode')?.value,
        country: this.paymentForm.get('country')?.value
      };

      const paymentMethod = this.paymentForm.get('paymentMethod')?.value;

      try {
        const order = this.orderService.createOrderFromCart(this.cartItems, this.cartTotal, paymentMethod, shippingAddress);
        this.cartService.clearCart();
        this.router.navigate(['/order-confirmation', order.id]);
      } catch (error) {
        console.error('Error creating order:', error);
        this.isProcessing = false;
        // You might want to show an error message to the user here
      }
    } else {
      if (this.cartItems.length === 0) {
        // Show message that cart is empty
        return;
      }
      Object.keys(this.paymentForm.controls).forEach(key => {
        const control = this.paymentForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.paymentForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.paymentForm.get(fieldName);
    if (!control) return '';
    
    if (control.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (control.hasError('minlength')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is too short`;
    }
    if (control.hasError('pattern')) {
      switch (fieldName) {
        case 'phone':
          return 'Please enter a valid 10-digit phone number';
        case 'postalCode':
          return 'Please enter a valid postal code';
        default:
          return 'Invalid format';
      }
    }
    return '';
  }
} 