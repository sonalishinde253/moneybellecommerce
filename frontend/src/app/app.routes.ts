import { Routes } from '@angular/router';
import { HomeComponent } from './layouts/home/home.component';
import { AboutUsComponent } from './layouts/about-us/about-us.component';
import { ContactUsComponent } from './layouts/contact-us/contact-us.component';
import { LoginComponent } from './layouts/login/login.component';
import { SignupComponent } from './layouts/signup/signup.component';
import { CatalogComponent } from './layouts/catalog/catalog.component';
import { ForgotPasswordComponent } from './layouts/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './layouts/reset-password/reset-password.component';
import { ProfileComponent } from './layouts/profile/profile.component';
import { ProfileInformationComponent } from './components/profile-information/profile-information.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { ManageAddressComponent } from './components/manage-address/manage-address.component';
import { WhishlistComponent } from './components/whishlist/whishlist.component';
import { IsLoggedService } from './services/is-logged/is-logged.service';
import { IsUserService } from './services/is-user/is-user.service';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AccountsOverviewComponent } from './components/accounts-overview/accounts-overview.component';
import { OverviewComponent } from './components/overview/overview.component';
import { OrdersOverviewComponent } from './components/orders-overview/orders-overview.component';
import { ProductsOverviewComponent } from './components/products-overview/products-overview.component';
import { IsAdminService } from './services/is-admin/is-admin.service';
import { CategoryOverviewComponent } from './components/category-overview/category-overview.component';
import { BrandsOverviewComponent } from './components/brands-overview/brands-overview.component';
import { ProductComponent } from './layouts/product/product.component';
import { CartComponent } from './components/cart/cart.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { CheckOutComponent } from './layouts/check-out/check-out.component';
import { CardIsNotEmptyService } from './services/card-is-not-empty/card-is-not-empty.service';

export const routes: Routes = [
     {
        path: 'admin-dashboard',
        component: AdminDashboardComponent,
        children: [
          { path: 'overview', component: OverviewComponent },
          { path: 'accounts-overview', component: AccountsOverviewComponent },
          { path: 'orders-overview', component: OrdersOverviewComponent },
          { path: 'products-overview', component: ProductsOverviewComponent },
          { path: 'category-overview', component: CategoryOverviewComponent},
          { path: 'brands-overview', component: BrandsOverviewComponent}
        ],
        canActivate: [IsLoggedService, IsAdminService],
    },
  
    { path: '', component:HomeComponent, pathMatch:'full' },
    { path: 'home', component:HomeComponent, pathMatch:'full' },
    { path: 'catalog', component:CatalogComponent },
    { path: 'about-us', component:AboutUsComponent },
    { path: 'contact-us', component:ContactUsComponent },
    { path: 'login', component:LoginComponent },
    { path: 'signup', component:SignupComponent },
    { path: 'forgot-password', component:ForgotPasswordComponent},
    { path: 'reset-password', component:ResetPasswordComponent},
    {
        path: 'profile',
        component: ProfileComponent,
        children: [
        { path: 'information', component: ProfileInformationComponent },
        { path: 'edit', component: EditProfileComponent },
        { path: 'address', component: ManageAddressComponent },
        { path: 'password', component: ChangePasswordComponent },
        { path: 'wishlist', component: WhishlistComponent },
        ],
        canActivate: [IsLoggedService, IsUserService],
    },
      {
        path: 'product/:id',
        component: ProductComponent,
        canActivate: [IsLoggedService, IsUserService],
    },
   {
    path: 'order-history',
    component: OrderHistoryComponent,
    canActivate: [IsLoggedService, IsUserService],
  },
  {
    path: 'orders/:id',
    component: OrderDetailComponent,
    canActivate: [IsLoggedService, IsUserService],
  },
  {
    path: 'profile-information',
    component: ProfileInformationComponent,
    canActivate: [IsLoggedService, IsUserService],
  },
  {
    path: 'edit-profile',
    component: EditProfileComponent,
    canActivate: [IsLoggedService, IsUserService],
  },
  {
    path: 'manage-address',
    component: ManageAddressComponent,
    canActivate: [IsLoggedService, IsUserService],
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [IsLoggedService, IsUserService],
  },
  {
    path: 'wishList',
    component: WhishlistComponent,
    canActivate: [IsLoggedService, IsUserService],
  },
    {
    path: 'check-out',
    component: CheckOutComponent,
    canActivate: [IsLoggedService, IsUserService, CardIsNotEmptyService],
  },

  {
    path: 'cart',
    component: CartComponent,
    canActivate: [IsLoggedService, IsUserService],
  },
];
