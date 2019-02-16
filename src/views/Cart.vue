<template>
  <div>
    <nav-header/>
    <nav-base>
      <span>Cart</span>
    </nav-base>
    <div class="container">
      <div class="cart">
        <div class="page-title-normal">
          <h2 class="page-title-h2">
            <span>My Cart</span>
          </h2>
        </div>
        <div class="item-list-wrap">
          <div class="cart-item">
            <div class="cart-item-head">
              <ul>
                <li>Items</li>
                <li>Price</li>
                <li>Quantity</li>
                <li>Subtotal</li>
                <li>Edit</li>
              </ul>
            </div>
            <ul class="cart-item-list">
              <li v-for="item in cartList" :key="item.productImage">
                <div class="cart-tab-1">
                  <div class="cart-item-check">
                    <a
                      href="javascipt:;"
                      class="checkbox-btn item-check-btn"
                      :class="{'check' : item.checked == '1'}"
                      @click="editCart('check', item)"
                    >
                      <svg class="icon icon-ok">
                        <use xlink:href="#icon-ok"></use>
                      </svg>
                    </a>
                  </div>
                  <div class="cart-item-pic">
                    <img :src="'/static/'+item.productImage" :alt="item.productName">
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
                    <div class="select-self select-self-open">
                      <div class="select-self-area">
                        <a class="input-sub" @click="editCart('minu', item)">-</a>
                        <span class="select-ipt">{{item.productNum}}</span>
                        <a class="input-add" @click="editCart('add', item)">+</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="cart-tab-4">
                  <div
                    class="item-price-total"
                  >{{parseInt(item.productNum * item.salePrice) | currency('￥')}}</div>
                </div>
                <div class="cart-tab-5">
                  <div class="cart-item-opration" @click="saveProductId(item.productId, item.productNum)">
                    <a href="javascript:;" class="item-edit-btn">
                      <svg class="icon icon-del">
                        <use xlink:href="#icon-del"></use>
                      </svg>
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="cart-foot-wrap">
          <div class="cart-foot-inner">
            <div class="cart-foot-l">
              <div class="item-all-check">
                <a href="javascipt:;" @click="toggleCheckAll">
                  <span :class="{'check' : checkAllFlag}" class="checkbox-btn item-check-btn">
                    <svg class="icon icon-ok">
                      <use xlink:href="#icon-ok"></use>
                    </svg>
                  </span>
                  <span>Select all</span>
                </a>
              </div>
            </div>
            <div class="cart-foot-r">
              <div class="item-total">
                Item total:
                <span class="total-price">{{totalPrice | currency('￥')}}</span>
              </div>
              <div class="btn-wrap">
                <a
                  :class="{'btn--dis': checkedCount==0}"
                  @click="checkOut"
                  class="btn btn--red"
                >Checkout</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal :mdShow="mdShowdelete" @close="mdShowdelete=false">
      <p slot="message">确认删除此商品吗？</p>
      <div slot="btnGroup">
        <a @click="deleteGood" class="btn btn--m">确定</a>
        <a @click="mdShowdelete=false" class="btn btn--m">取消</a>
      </div>
    </modal>
    <nav-footer/>
  </div>
</template>
<style>
.input-sub,
.input-add {
  min-width: 40px;
  height: 100%;
  border: 0;
  color: #605f5f;
  text-align: center;
  font-size: 16px;
  overflow: hidden;
  display: inline-block;
  background: #f0f0f0;
}
.item-quantity .select-self-area {
  background: none;
  border: 1px solid #f0f0f0;
}
.item-quantity .select-self-area .select-ipt {
  display: inline-block;
  padding: 0 3px;
  width: 30px;
  min-width: 30px;
  text-align: center;
}
</style>
<script>
import "./../assets/css/checkout.css";
import NavHeader from "@/components/NavHeader";
import NavFooter from "@/components/NavFooter";
import NavBase from "@/components/NavBase";
import Modal from "@/components/Modal";
import {
  editCheckAll,
  userCartList,
  deleteUserGood,
  userCartEdit
} from "api/users";
export default {
  name: "Cart",
  data() {
    return {
      cartList: [],
      mdShowdelete: false,
      productId: "",
      productNum: 0
    };
  },
  computed: {
    checkAllFlag() {
      // 判断商品数量是否等于选中数量 为全选
      return this.checkedCount == this.cartList.length;
    },
    checkedCount() {
      let i = 0;
      this.cartList.forEach(item => {
        if (item.checked == "1") i++;
      });
      return i;
    },
    totalPrice() {
      // 总金额
      let money = 0;
      this.cartList.forEach(item => {
        if (item.checked == "1") {
          money += parseInt(item.productNum) * parseInt(item.salePrice);
        }
      });
      return money;
    }
  },
  methods: {
    checkOut() {
      // 结账
      if (this.checkedCount > 0) {
        this.$router.push({
          path: "/address"
        });
      }
    },
    toggleCheckAll() {
      // 全选
      let flag = !this.checkAllFlag;
      this.cartList.forEach(item => {
        item.checked = flag ? "1" : "0";
      });
      editCheckAll({ checkAll: flag }).then(res => {
        console.log(res);
        if (res.status == "1") {
          alert("全选更新成功");
        }
      });
    },
    editCart(flag, item) {
      // 加减
      if (flag == "add") {
        item.productNum++;
        this.$store.commit('updataCartCount', 1)
      } else if (flag == "minu") {
        if (item.productNum > 1) {
          this.$store.commit('updataCartCount', -1)
          item.productNum--;
        } else {
          return;
        }
      } else {
        item.checked = item.checked == "1" ? "0" : "1";
      }
      let obj = {
        productNum: item.productNum,
        productId: item.productId,
        checked: item.checked
      };
      userCartEdit(obj).then(response => {
        if (response.status == "1") {
          //alert('更新成功')
        }
      });
    },
    saveProductId(id, count) {
      this.mdShowdelete = true;
      this.productId = id;
      this.productNum = count;
    },
    deleteGood() {
      deleteUserGood({ productId: this.productId }).then(res => {
        if (res.status == "1") {
          alert("删除成功");
          this.$store.commit('updataCartCount', -this.productNum)
          this.getUserCartList();
          this.mdShowdelete = false;
        }
      });
    },
    getUserCartList() {
      userCartList().then(response => {
        console.log(response);
        this.cartList = response.result;
      });
    }
  },
  mounted() {
    this.getUserCartList();
  },
  components: {
    NavHeader,
    NavFooter,
    NavBase,
    Modal
  }
};
</script>
