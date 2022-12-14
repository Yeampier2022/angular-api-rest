import { Component, OnInit } from '@angular/core';

import { Product, CreateProductDTO, UpdateProductDTO} from '../../models/product.model';

import { StoreService } from '../../services/store.service';
import { ProductsService } from '../../services/products.service';
import { isNgTemplate } from '@angular/compiler';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
[x: string]: any;

  myShoppingCart: Product[] = [];
  total = 0;
  products: Product[] = [];
  showProductDetail = false;
  productChosen: Product = {
    id: '',
    price: 0,
    images: [],
    title: '',
    category: {
      id: '',
      name: '',
    },
    description: ''
  };

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    this.productsService.getAllProducts()
    .subscribe(data => {
      this.products = data;
    });
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  toggleProductDetail(){
    this.showProductDetail =!this.showProductDetail;
  }

  onShowDetail(id:any){
    this.productsService.getProduct(id)
    .subscribe(data => {
      this.toggleProductDetail()
      this.productChosen = data;
    })
  }

    createNewProduct() {
      const product: CreateProductDTO = {
        title: 'Nueo producto',
        description: 'bla bla bla ',
        images: [`https://placeimg.com/640/480/any?random=${Math.random()}`],
        price: 1000,
        categoryID: 1,
      }
      this.productsService.create(product).subscribe(data =>{
      console.log('created',data);
      });
    }
    updateProduct() {
      const changes: UpdateProductDTO = {
        title:'nuevo titutlo',

      }
      const id = this.productsChosen.id;
      this.productsService.update(id,changes).subscribe
      (data => {
       const productIndex = this.products.findIndex(item => item.id === this.productsChosen);
       this.products[productIndex] = data;
      })
    }

    deleteProduct(){
      const id = this.productsChosen.id;
      this.productsService.delete(id).subscribe(() =>{
       const productIndex = this.products.findIndex(item => item.id === this.productsChosen);
        this.products.splice(productIndex, 1);
        this.showProductDetail = false;
      });

    }

}
