<template>
  <div>
    <nav-header/>
    <nav-base>
      <span>Good</span>
    </nav-base>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a @click="sortGoods" href="javascript:void(0)" class="price">
            Price
            <svg class="icon icon-arrow-short">
              <use xlink:href="#icon-arrow-short"></use>
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd >
                <a
                  @click="filterPrice('all')"
                  :class="{'cur': activate == 'all'}">All</a>
              </dd>
              <dd v-for="(item, index) in priceList" :key="index">
                <a
                  @click="filterPrice(index)"
                  :class="{'cur': activate == index}"
                  href="javascript:void(0)"
                >{{item}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item, index) in goodsItem" :key="index">
                  <div class="pic">
                    <a href="#">
                      <img :src="'static/'+item.productImage" alt>
                    </a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">￥ {{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" @click="addCartFun(item.productId)" class="btn btn--m">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="load-more"
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="busy"
                infinite-scroll-distance="30"
              ><img v-show="loading" src="./../assets/loading/loading-spinning-bubbles.svg"/></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <nav-footer/>
  </div>
</template>
<style>
.load-more{
  height: 100px;
  line-height: 100px;
  text-align: center;
}
</style>

<script>
import "./../assets/css/base.css";
import "./../assets/css/product.css";
import NavHeader from "@/components/NavHeader";
import NavFooter from "@/components/NavFooter";
import NavBase from "@/components/NavBase";
import { goodsList, addCart } from "api/getGoodsList";
export default {
  name: "GoodsList",
  data() {
    return {
      goodsItem: [],
      page: 1,
      pageSize: 8,
      sortFlag: true, // 1 升序 0 降序
      priceList: ["0 - 100", "100 - 500", "500 - 1000", "1000 - 2000"],
      activate: 'all',
      busy: true,
      loading: false
    };
  },
  methods: {
    getGoodsList(flag) {
      let param = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1,
        priceLevel: this.activate
      };
      this.loading = true;
      goodsList(param).then(res => {
        console.log(res,'goodsItem')
        this.loading = false;
        if (res.status == '1') {
          // flag 为 trun 的时候 表示为下滑加载
          if (flag) {
            this.goodsItem = this.goodsItem.concat(res.result.list);
            if (res.result.count < this.pageSize) {
              this.busy = true;
            } else {
              this.busy = false;
            }
          } else {
            this.goodsItem = res.result.list;
            this.busy = false;
          }
        } else {
          this.goodsItem = [];
        }
        // this.goodsItem.forEach((item) => {
        //   console.log(item);
        //   item.productImage = 'static/' + item.productImage;
        // })
      });
    },
    sortGoods() {
      // 排序
      this.sortFlag = !this.sortFlag;
      this.page = 1;
      this.getGoodsList();
    },
    loadMore() {
      this.busy = true;
      setTimeout(() => {
        this.page++;
        this.getGoodsList(true);
      }, 500);
    },
    filterPrice(index) {
      this.activate = index;
      this.page = 1;
      this.getGoodsList();
    },
    addCartFun (productId) { // 添加到购物车
      addCart(productId).then((res) => {
        console.log(res)
        if (res.status == '1') {
          alert('添加成功')
        }
      })
    }
  },
  components: {
    NavHeader,
    NavFooter,
    NavBase
  },
  mounted() {
    this.getGoodsList();
  }
};
</script>
