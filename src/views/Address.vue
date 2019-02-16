<template>
<div class="checkout-page">
  <nav-header/>
  <nav-base>
    <span>address</span>
  </nav-base>
  <div class="container">
    <div class="checkout-addr">
      <div class="page-title-normal">
        <h2 class="page-title-h2"><span>check out</span></h2>
      </div>
      <!-- process step -->
      <div class="check-step">
        <ul>
          <li class="cur"><span>Confirm</span> address</li>
          <li><span>View your</span> order</li>
          <li><span>Make</span> payment</li>
          <li><span>Order</span> confirmation</li>
        </ul>
      </div>
      <!-- address list -->
      <div class="page-title-normal checkout-title">
        <h2><span>Shipping address</span></h2>
      </div>
      <div class="addr-list-wrap">
        <div class="addr-list">
          <ul>
            <li v-for="(item, index) in addressListFilter"
            :key="index"
            :class="{'check' : checkIndex == index}"
            @click="checkIndex=index;selectedAddrId=item.addressId"
            >
              <dl>
                <dt>{{item.userName}}</dt>
                <dd class="address">{{item.streetName}}</dd>
                <dd class="tel">{{item.tel}}</dd>
              </dl>
              <div class="addr-opration addr-del" @click="sendDelAddress(item.addressId)">
                <a href="javascript:;" class="addr-del-btn">
                  <svg class="icon icon-del"><use xlink:href="#icon-del"></use></svg>
                </a>
              </div>
              <div class="addr-opration addr-set-default">
                <a href="javascript:;"
                class="addr-set-default-btn"
                v-if="!item.isDefault"
                @click="setDefault(item.addressId)"
                ><i>Set default</i></a>
              </div>
              <div class="addr-opration addr-default" v-if="item.isDefault">Default address</div>
            </li>
            <li class="addr-new">
              <div class="add-new-inner">
                <i class="icon-add">
                  <svg class="icon icon-add"><use xlink:href="#icon-add"></use></svg>
                </i>
                <p>Add new address</p>
              </div>
            </li>
          </ul>
        </div>

        <div class="shipping-addr-more">
          <a :class="{'open' : limit > 3}"
             @click="expand"
             class="addr-more-btn up-down-btn" href="javascript:;">
            more
            <i class="i-up-down">
              <i class="i-up-down-l"></i>
              <i class="i-up-down-r"></i>
            </i>
          </a>
        </div>
      </div>

      <!-- shipping method-->
      <div class="page-title-normal checkout-title">
        <h2><span>Shipping method</span></h2>
      </div>
      <div class="lemall-msg-info hidden">
        <span>The region you selected is not within our delivery area. Please select another shipping address within our delivery areas.</span>
      </div>
      <div class="shipping-method-wrap">
        <div class="shipping-method">
          <ul>
            <li class="check">
              <div class="name">Standard shipping</div>
              <div class="price">Free</div>
              <div class="shipping-tips">
                <p>Once shipped，Order should arrive in the destination in 1-7 business days</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="next-btn-wrap">
        <a class="btn btn--m btn--red" @click="goOrder">Next</a>
      </div>
    </div>
  </div>
  <modal :mdShow="mdShowdelAddress" @close="mdShowdelAddress=false">
    <p slot="message">你确定要删除此地址吗？</p>
     <div slot="btnGroup">
        <a @click="delAddress" class="btn btn--m">确定</a>
        <a @click="mdShowdelAddress=false" class="btn btn--m">取消</a>
      </div>
  </modal>
  <nav-footer/>
</div>
</template>

<style>

</style>
<script>
import "./../assets/css/checkout.css";
import NavHeader from "@/components/NavHeader";
import NavFooter from "@/components/NavFooter";
import NavBase from "@/components/NavBase";
import Modal from "@/components/Modal";
import { userAddressList, delUserAddress, setDefault } from 'api/users'
export default {
  name: 'Address',
  data() {
    return {
      addressList: [],
      limit: 3,
      mdShowdelAddress: false,
      selectedAddrId: '',
      addressId: '',
      checkIndex: 0,
    }
  },
  methods: {
    goOrder() {
       this.$router.push({
          path: '/orderConfirm',
          query: {selectedAddrId: this.selectedAddrId}
        })
    },
    setDefault(addressId) { // 设置默认地址
      setDefault({addressId: addressId}).then((res) => {
        console.log(res)
        if (res.status == '1') {
          //alert(res.result);
          this.checkIndex = 0;
          this.getAddressList();
        }
      })
    },
    expand() { // 展开
      if (this.limit == 3) {
        this.limit = this.addressList.length
      } else {
        this.limit = 3
      }
    },
    getAddressList() {
      userAddressList().then((res) => {
        console.log(res);
        if (res.status == '1') {
          this.addressList = res.result.sort(this.compare('isDefault'));
          this.selectedAddrId = this.addressList[0].addressId;
          console.log('this.addressList', this.addressList)
        }
      })
    },
    compare(item) {
      return (a) => {
        let value1 = a[item];
        return value1 ? -1 : 1
      }
    },
    delAddress() {
      console.log('this.addressId', this.addressId)
      delUserAddress({addressId: this.addressId}).then((res) => {
        if (res.status == '1') {
          //alert('删除成功')
          this.getAddressList();
          this.mdShowdelAddress = false;
        }
      })
    },
    sendDelAddress(id) {
      this.addressId = id;
      this.mdShowdelAddress = true;
    }
  },
  computed:{
    addressListFilter() {
      return this.addressList.slice(0, this.limit);
    }
  },
  mounted() {
    this.getAddressList();
  },
  components: {
    NavHeader,
    NavFooter,
    NavBase,
    Modal
  }
}
</script>
