import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductViewComponent } from './components/product-view/product-view.component';
import { CartComponent } from './components/cart/cart.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { PaymentComponent } from './components/payment/payment.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { OrderConfirmationComponent } from './components/order-confirmation/order-confirmation.component';
import { OrderTrackingComponent } from './components/order-tracking/order-tracking.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductViewComponent },
  { path: 'cart', component: CartComponent },
  { path: 'wishlist', component: WishlistComponent, canActivate: [AuthGuard] },
  { path: 'checkout', component: PaymentComponent, canActivate: [AuthGuard] },
  { path: 'order-history', component: OrderHistoryComponent, canActivate: [AuthGuard] },
  { path: 'order-confirmation/:id', component: OrderConfirmationComponent, canActivate: [AuthGuard] },
  { path: 'track-order', component: OrderTrackingComponent },
  { path: '**', redirectTo: '' }
];
