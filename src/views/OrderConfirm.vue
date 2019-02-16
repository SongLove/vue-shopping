<template>
  <div>
    <nav-header/>
    <nav-base>
      <span>orderConfirm</span>
    </nav-base>
    <div class="container">
      <div class="checkout-order">
        <div class="page-title-normal">
          <h2 class="page-title-h2">
            <span>check out</span>
          </h2>
        </div>
        <!-- process step -->
        <div class="check-step">
          <ul>
            <li class="cur">
              <span>Confirm</span> address
            </li>
            <li class="cur">
              <span>View your</span> order
            </li>
            <li>
              <span>Make</span> payment
            </li>
            <li>
              <span>Order</span> confirmation
            </li>
          </ul>
        </div>

        <!-- order list -->
        <div class="page-title-normal checkout-title">
          <h2>
            <span>Order content</span>
          </h2>
        </div>
        <div class="item-list-wrap confirm-item-list-wrap">
          <div class="cart-item order-item">
            <div class="cart-item-head">
              <ul>
                <li>Order contents</li>
                <li>Price</li>
                <li>Quantity</li>
                <li>Subtotal</li>
              </ul>
            </div>
            <ul class="cart-item-list">
              <li v-for="(item, index) in cartList" :key="index">
                <div class="cart-tab-1">
                  <div class="cart-item-pic">
                    <img :src="'/static/' + item.productImage">
                  </div>
                  <div class="cart-item-title">
                    <div class="item-name">{{item.productName}}</div>
                  </div>
                </div>
                <div class="cart-tab-2">
                  <div class="item-price">{{item.salePrice | currency('￥')}}</div>
                </div>
                <div class="cart-tab-3">
                  <div class="item-quantity">
                    <div class="select-self">
                      <div class="select-self-area">
                        <span class="select-ipt">×{{item.productNum}}</span>
                      </div>
                    </div>
                    <div class="item-stock item-stock-no">In Stock</div>
                  </div>
                </div>
                <div class="cart-tab-4">
                  <div
                    class="item-price-total"
                  >{{parseInt(item.productNum * item.salePrice) | currency('￥')}}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Price count -->
        <div class="price-count-wrap">
          <div class="price-count">
            <ul>
              <li>
                <span>Item subtotal:</span>
                <span>{{totalPrice | currency('￥')}}</span>
              </li>
              <li>
                <span>Shipping:</span>
                <span>{{Shipping | currency('￥')}}</span>
              </li>
              <li>
                <span>Discount:</span>
                <span>{{Discount | currency('￥')}}</span>
              </li>
              <li>
                <span>Tax:</span>
                <span>{{Tax | currency('￥')}}</span>
              </li>
              <li class="order-total-price">
                <span>Order total:</span>
                <span>{{orderTotal | currency('￥')}}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="order-foot-wrap">
          <div class="prev-btn-wrap">
            <router-link class="btn btn--m" to="/address"></router-link>
          </div>
          <div class="next-btn-wrap">
            <button @click="payMent" class="btn btn--m btn--red">Proceed to payment</button>
          </div>
        </div>
      </div>
    </div>
    <nav-footer/>
  </div>
</template>


<script>
import "./../assets/css/checkout.css";
import NavHeader from "@/components/NavHeader";
import NavFooter from "@/components/NavFooter";
import NavBase from "@/components/NavBase";
import { userCartList, payMent } from "api/users";
export default {
  name: "OrderConfirm",
  data() {
    return {
      cartList: [],
      Shipping: 50, // 运费
      Discount: 1000, // 折扣
      Tax: 30 // 税率
    };
  },
  components: {
    NavHeader,
    NavFooter,
    NavBase
  },
  computed: {
    totalPrice() {
      let money = 0;
      this.cartList.forEach(item => {
        if (item.checked == "1") {
          money += parseInt(item.productNum) * parseInt(item.salePrice);
        }
      });
      return money;
    },
    orderTotal() {
      return this.totalPrice + this.Shipping - this.Discount + this.Tax;
    }
  },
  methods: {
    init() {
      userCartList().then(response => {
        let arr = [];
        response.result.forEach(item => {
          if (item.checked == "1") {
            arr.push(item);
          }
        });
        this.cartList = arr;
        console.log(this.cartList);
      });
    },
    payMent() {
      // 支付
      let obj = {
        addressId: this.$route.query.selectedAddrId,
        orderTotal: this.orderTotal
      };
      console.log(obj, "obj");
      payMent(obj).then(response => {
        console.log(response);
        if (response.status == "1") {
          let result = response.result
          this.$router.push({
            path: "/ordersuccess",
            query: { orderId: result.orderId }
          });
        }
      });
    }
  },
  mounted() {
    this.init();
  }
};
</script>
