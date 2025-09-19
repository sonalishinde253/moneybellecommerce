import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { OrderService } from 'src/app/services/order/order.service';
import { Order } from 'src/app/interfaces/order';
@Component({
  selector: 'app-orders-overview',
  standalone: true,  
  imports: [CommonModule, MatPaginatorModule],
  providers: [OrderService],
  templateUrl: './orders-overview.component.html',
  styleUrls: []
})
export class OrdersOverviewComponent {
  pageOrders: Order[] = []; // Ensure allOrders is initialized as an array
  currentPage = 0;
  pageSize = 10;
  numberOfOrders = 0;
  numberOfPages = 0;
  visible = false;
  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (response: {
        orders: Order[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalOrders: number;
        };
      }) => {
        this.pageOrders = response.orders;
        this.numberOfPages = response.pagination.totalPages;
        this.numberOfOrders = response.pagination.totalOrders;
        const pruductIds = Array.from(
          new Set(
            response.orders.flatMap((order) =>
              order.products.flatMap((product) => product)
            )
          )
        );
      },
      error: (error) => {
        console.log('Error:', error);
      },
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.orderService.getOrders(this.currentPage, 10).subscribe({
      next: (response: {
        orders: Order[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalOrders: number;
        };
      }) => {
        this.pageOrders = response.orders;
        this.pageSize = response.orders.length;
        this.numberOfPages = response.pagination.totalPages;
        this.numberOfOrders = response.pagination.totalOrders;
        console.log(
          response.orders,
          'current page: ' + this.currentPage,
          'page size: ' + this.pageSize,
          'number of pages: ' + this.numberOfPages,
          'number of orders: ' + this.numberOfOrders
        );
      },
      error: (error) => {
        console.log('Error:', error);
      },
    });
  }

  getProductName(product: any): string {
    return product.name;
  }

  acceptOrder(order: Order): void {
    this.orderService.updateOrderStatus(order._id, 'accept').subscribe({
      next: (response) => {
        console.log('Order accepted:', response);
        this.loadOrders();
      },
      error: (error) => {
        console.log('Error:', error);
      },
    });
  }

  rejectOrder(order: Order): void {
    this.orderService.updateOrderStatus(order._id, 'reject').subscribe({
      next: (response) => {
        console.log('Order accepted:', response);
        this.loadOrders();
      },
      error: (error) => {
        console.log('Error:', error);
      },
    });
  }
}
