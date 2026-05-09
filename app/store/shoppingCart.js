export const shoppingCartStore = defineStore('shoppingCart', () => {
    const shoppingCart = ref([]);
    // shoppingCart结构
    /* 
    shoppingCart = {
      id: "", // 购物车id
      productID: "", // 商品id
      productName: "", // 商品名称
      productImg: "", // 商品图片
      price: "", // 商品价格
      num: "", // 商品数量
      maxNum: "", // 商品限购数量
      check: false // 是否勾选
    } */

    const getShoppingCart = computed(() => shoppingCart.value);
    const getNum = computed(() => {
        let totalNum = 0;
        for (let i = 0; i < shoppingCart.value.length; i++) {
            const temp = shoppingCart.value[i];
            totalNum += temp.num;
        }
        return totalNum;
    });
    const getIsAllCheck = computed(() => {
        // 判断是否全选
        // let isAllCheck = true;
        // for (let i = 0; i < shoppingCart.value.length; i++) {
        //     const temp = shoppingCart.value[i];
        //     // 只要有一个商品没有勾选立即return false;
        //     if (!temp.check) {
        //         isAllCheck = false;
        //         return isAllCheck;
        //     }
        // }
        let isAllCheck = shoppingCart.value.every(item => item.check);
        return isAllCheck;
    })
    const getCheckGoods = computed(() => {
        // 获取勾选的商品信息
        // 用于确认订单页面
        // let checkGoods = [];
        // for (let i = 0; i < shoppingCart.value.length; i++) {
        //     const temp = shoppingCart.value[i];
        //     if (temp.check) {
        //         checkGoods.push(temp);
        //     }
        // }
        // return checkGoods;
        return shoppingCart.value.filter(item => item.check);
    })
    const getCheckNum = computed(() => {
        // 获取购物车勾选的商品数量
        // let checkNum = 0;
        // for (let i = 0; i < shoppingCart.value.length; i++) {
        //     const temp = shoppingCart.value[i];
        //     if (temp.check) {
        //         checkNum += temp.num;
        //     }
        // }
        let checkNum = shoppingCart.value.reduce((total, item) => {
            if(item.check) {
                total += item.num;
            }
            return total;
        }, 0);
        return checkNum;
    })
    const getTotalPrice = computed(() => {
        // 获取购物车勾选的商品总价
        // let totalPrice = 0;
        // for (let i = 0; i < shoppingCart.value.length; i++) {
        //     const temp = shoppingCart.value[i];
        //     if (temp.check) {
        //         totalPrice += temp.price * temp.num;
        //     }
        // }
        let totalPrice = shoppingCart.value.reduce((total, item) => {
            if(item.check) {
                total += item.price * item.num;
            }
            return total;
        }, 0);
        return totalPrice;
    })

    function setShoppingCart(data) {
        shoppingCart.value = data;
    }
    function unshiftShoppingCart(data) {
        // 添加购物车
        // 用于在商品详情页点击添加购物车,后台添加成功后，更新vuex状态
        shoppingCart.value.unshift(data);
    }
    function updateShoppingCart(payload) {
        // 更新购物车
        // 可更新商品数量和是否勾选
        // 用于购物车点击勾选及加减商品数量
        if(payload.prop == "num") {
            if(shoppingCart.value[payload.key].maxNum < payload.val) return;
            if(payload.val < 1) return;
        }
        // 根据商品在购物车的数组的索引和属性更改
        shoppingCart.value[payload.key][payload.prop] = payload.val;
    }
    function addShoppingCartNum(productID) {
        // 增加购物车商品数量
        // 用于在商品详情页点击添加购物车,后台返回002，“该商品已在购物车，数量 +1”，更新vuex的商品数量
        for (let i = 0; i < shoppingCart.value.length; i++) {
            const temp = shoppingCart.value[i];
            if (temp.productID == productID) {
                if (temp.num < temp.maxNum) {
                    temp.num++;
                    break;
                }
            }
        }
    }
    function deleteShoppingCart(id) {
        // 删除购物车商品
        // 用于在购物车页面点击删除商品
        for (let i = 0; i < shoppingCart.value.length; i++) {
            const temp = shoppingCart.value[i];
            if (temp.id == id) {
                shoppingCart.value.splice(i, 1);
                break;
            }
        }
    }
    function checkAll(data) {
        for (let i = 0; i < shoppingCart.value.length; i++) {
            const temp = shoppingCart.value[i];
            temp.check = data;
        }
    }

    return {
        shoppingCart,
        getShoppingCart,
        getNum,
        getIsAllCheck,
        getCheckGoods,
        getCheckNum,
        getTotalPrice,
        setShoppingCart,
        unshiftShoppingCart,
        updateShoppingCart,
        addShoppingCartNum,
        deleteShoppingCart,
        checkAll
    }
})