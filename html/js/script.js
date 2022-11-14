"use strict";

const tooltipMockup = [
  {
    itemName: "water",
    labelName: "PAINKILLER",
    statsData: [
      {
        label: "damage",
        stats: 80,
      },
      {
        label: "critical",
        stats: 20,
      },
    ],
  },
  {
    itemName: "WEAPON_BAT",
    labelName: "weapon bat",
    statsData: [
      {
        label: "damage",
        stats: 50,
      },
    ],
  },
  {
    itemName: "WEAPON_BAT2",
    labelName: "weapon bat2",
    statsData: [
      {
        label: "damage",
        stats: 80,
      },
      {
        label: "critical",
        stats: 50,
      },
    ],
  },
];

// Main
$(function init() {
  window.addEventListener("message", (event) => {
    console.log("Event Data:", event.data);
    switchDisplay(event.data);
    const divItem = document.querySelectorAll("#items .grid-items .item");
    // tooltip(tooltipMockup);
    onClickBuyItem();
    onClickAddQuantity();
    onClickClaimItem();
    scrollMouseWheel();
  });
});

function switchDisplay(items) {
  if (items.display) {
    $("#body").show();
    if (items.type === "ui") {
      console.log("Set Item", items);

      $("#items").append(createItemElement(items.itemdata, items.URL_Images));
      $("#weapon").append(
        createItemElement(items.weaponList, items.URL_Images)
      );
      $("#fashion").append(
        createItemElement(items.fashionList, items.URL_Images)
      );
      $("#gachapon").append(
        createItemElement(items.gachaList, items.URL_Images)
      );
      $("#reward").append(
        createRewardHeaderElement(items.rewardpoint),
        createRewardItemElement(
          items.rewardList,
          items.URL_Images,
          items.rewardpoint
        )
      );
      updateProfile(items);
      tooltip(tooltipMockup);
    } else if (items.type === "update") {
      console.log("Update Item", items);
      updateProfile(items);
    } else if (items.type === "alert") {
      toastMessage(items.showtype, items.text);
    }
  } else {
    $("#body").hide();
    const gridItemElement = document.querySelectorAll(".grid-items");
    gridItemElement.forEach((element) => {
      removeItemElement(element);
    });
    const gridRewardElement = document.querySelector(".grid-reward");
    removeItemElement(gridRewardElement);
    const rewardWrapElement = document.querySelector(".reward-wrap");
    removeItemElement(rewardWrapElement);
  }
}
document.onkeyup = function (data) {
  if (data.which == 27) {
    $.post("http://SETUP_Area/disable", "{}");
  }
};

function updateProfile(item) {
  $(".username").html(item.name);
  $(".img-profile").attr("src", item.avatar);
  $(".black-cash").html(item.blackmoney);
  $(".point").html(item.rewardpoint);
  disabledReward(item.rewardList);
  const widthBar = calcReward(item.rewardList, item.rewardpoint);
  $(".bar").width(`${widthBar}%`);
}

(function onClickTabs() {
  $(".tab-link").on("click", function () {
    const categoryId = $(this).data("category");
    $(".tab-link, .box").removeClass("is-active");
    $(this).addClass("is-active");
    $(categoryId).addClass("is-active");
    loadingAnimate(categoryId);
  });
})();

function onClickAddQuantity() {
  const quantityNav = document.querySelectorAll(".quantity-nav");
  const inputForm = document.querySelectorAll('.quantity input[type="number"]');
  const itemPrice = document.querySelectorAll(".item-content p");

  quantityNav.forEach((quantity, index) => {
    const btnUp = quantity.firstElementChild;
    const btnDown = quantity.lastElementChild;
    const maxForm = inputForm[index].getAttribute("max");
    const minForm = inputForm[index].getAttribute("min");
    const oldPrice = parseFloat(itemPrice[index].innerHTML);

    btnUp.onclick = function () {
      const inputValue = inputForm[index].value;
      let oldValue = parseFloat(inputValue);
      let newValue = 0;
      oldValue >= maxForm ? (newValue = oldValue) : (newValue = oldValue + 1);
      inputForm[index].value = newValue;
      itemPrice[index].innerHTML = oldPrice * newValue;
    };

    btnDown.onclick = function () {
      const inputValue = inputForm[index].value;
      let oldValue = parseFloat(inputValue);
      let newValue = 0;
      oldValue <= minForm ? (newValue = oldValue) : (newValue = oldValue - 1);
      inputForm[index].value = newValue;
      itemPrice[index].innerHTML = oldPrice * newValue;
    };

    inputForm[index].onkeyup = function () {
      const inputValue = parseFloat(inputForm[index].value);
      if (inputValue >= 1 && inputValue <= maxForm) {
        let newPrice = oldPrice * inputValue;
        itemPrice[index].innerHTML = newPrice;
      } else if (inputValue >= maxForm) {
        inputForm[index].value = maxForm;
        itemPrice[index].innerHTML = oldPrice * maxForm;
      }
    };
    inputForm[index].onchange = function () {
      const inputValue = parseFloat(inputForm[index].value);
      if (inputValue < 1 || !inputValue) {
        inputForm[index].value = 1;
        itemPrice[index].innerHTML = oldPrice * 1;
      }
    };
  });
}

// Alert type: success or warning
function toastMessage(type, message, timeout = 5000) {
  const toastContainer =
    document.querySelector(".toast-container") || createContainer();
  const divToast = document.createElement("div");
  divToast.classList.add("toast");
  divToast.classList.add(`${type}`);
  const toastContent = document.createElement("div");
  toastContent.classList.add("toast-content");
  const toastLabel = document.createElement("p");
  toastLabel.classList.add("toast-label");
  toastLabel.innerHTML = type;
  const toastMessage = document.createElement("span");
  toastMessage.classList.add("toast-message");
  toastMessage.innerHTML = message;
  toastContent.append(toastLabel, toastMessage);
  divToast.append(toastContent);
  toastContainer.prepend(divToast);
  requestAnimationFrame(() => {
    divToast.classList.add("show");
  });
  removeToast(timeout);
}

function createContainer() {
  const toastContainer = document.createElement("div");
  toastContainer.classList.add("toast-container");
  document.querySelector(".container").append(toastContainer);
  return toastContainer;
}

function removeToast(value) {
  const toast = document.querySelectorAll(".toast");
  toast.forEach((element) => {
    setTimeout(() => {
      requestAnimationFrame(() => {
        element.classList.remove("show");
        element.classList.add("hide");
      });
    }, value);
    setTimeout(() => {
      element.remove();
    }, value + 500);
  });
}

function socialMedia(platform) {
  const Platforms = {
    facebook: "https://www.facebook.com/areaesport999",
    instagram: "https://www.instagram.com/",
    youtube: "https://www.youtube.com/",
  };
  if (platform == "facebook")
    window.invokeNative("openUrl", Platforms.facebook);
  else if (platform == "instagram")
    window.invokeNative("openUrl", Platforms.instagram);
  else window.invokeNative("openUrl", Platforms.youtube);
}

function createCashElement() {
  const divCash = document.createElement("div");
  divCash.classList.add("profile-cash", "black-cash");
  return divCash;
}

function createItemElement(dataItem, urlImage) {
  const divGridItem = document.createElement("div");
  divGridItem.classList.add("grid-items");
  dataItem.forEach((item) => {
    const divItems = document.createElement("div");
    divItems.classList.add("item", "tooltip");
    const itemContent = createItemContent(item, urlImage);
    const itemFooter = createItemFooter();
    divItems.append(itemContent, itemFooter);
    divGridItem.append(divItems);
  });
  return divGridItem;
}

function createItemContent(item, urlImage) {
  // Element ItemContent
  const divItemContent = document.createElement("div");
  divItemContent.classList.add("item-content");
  const h5 = document.createElement("h5");
  h5.setAttribute("data-name-item", item.item);
  h5.innerHTML = item.label;
  const imgItem = document.createElement("img");
  imgItem.src = `${urlImage}${item.item}.png`;
  const p = document.createElement("p");
  p.setAttribute("data-price", item.price);
  p.innerHTML = item.price;
  p.classList.add("cash-icon");

  divItemContent.append(h5, imgItem, p);
  return divItemContent;
}

function createItemFooter() {
  // Element: ItemFooter
  const divItemFooter = document.createElement("div");
  divItemFooter.classList.add("item-footer");
  const divQuantity = document.createElement("div");
  divQuantity.classList.add("quantity");
  const inputQuantity = document.createElement("input");
  inputQuantity.setAttribute("type", "number");
  inputQuantity.setAttribute("value", 1);
  inputQuantity.setAttribute("min", 1);
  inputQuantity.setAttribute("max", 1000);
  const divQuantityNav = document.createElement("div");
  divQuantityNav.classList.add("quantity-nav");
  const quantityUp = document.createElement("div");
  quantityUp.classList.add("quantity-button", "quantity-up");
  quantityUp.innerHTML = "+";
  const quantityDown = document.createElement("div");
  quantityDown.classList.add("quantity-button", "quantity-down");
  quantityDown.innerHTML = "-";
  const buttonBuyItem = document.createElement("button");
  buttonBuyItem.classList.add("buy-item", "btn-hover");
  buttonBuyItem.innerHTML = "Buy";

  divQuantityNav.append(quantityUp, quantityDown);
  divQuantity.append(inputQuantity, divQuantityNav);
  divItemFooter.append(divQuantity, buttonBuyItem);
  return divItemFooter;
}

function removeItemElement(child) {
  child.parentNode.removeChild(child);
}

// Tooltips
function tooltip(data) {
  if (data.length != 0) {
    data.forEach((item) => {
      const itemElement = $(".item")
        .find(`[data-name-item="${item.itemName}"]`)
        .parent()
        .parent();
      if (itemElement.length != 0)
        itemElement.append(creatTooltipElement(item));
    });
  }

  const categoryId = ["items", "weapon", "fashion", "gachapon", "reward"];
  categoryId.forEach((category) => tooltipPosition(category));
}

function tooltipPosition(categoryId) {
  const category = document.querySelectorAll(
    `#${categoryId} .grid-items .item`
  );
  let count = [];
  for (let i = 2; i < category.length; i += 4) {
    count.push(i);
    if (i != category.length - 1) count.push(i + 1);
  }
  if (categoryId == 'reward') {
    const reward = document.querySelectorAll('#reward .grid-reward .item');
    const last = reward.length - 1;
    const rewardLast = reward[last].querySelector('.tooltip-content');
    const rewardLast2 = reward[last - 1].querySelector('.tooltip-content');
    if (reward.length > 2 && rewardLast) rewardLast.dataset.position = 'left';
    if (reward.length > 3 && rewardLast2) rewardLast2.dataset.position = 'left';
    return;
  }
  count.forEach((i) => {
    const tooltipContent = category[i].querySelector('.tooltip-content');
    if (tooltipContent) tooltipContent.dataset.position = 'left';
  });
}

// Tooltips Element
function creatTooltipElement(value) {
  const tooltipContent = document.createElement("div");
  tooltipContent.classList.add("tooltip-content");
  tooltipContent.dataset.nameItem = value.labelName;
  tooltipContent.setAttribute("data-position", "right");

  value.statsData.forEach((stats) => {
    const label = document.createElement("label");
    const spanLabel = document.createElement("span");
    spanLabel.classList.add("label-detail");
    spanLabel.innerHTML = stats.label;
    spanLabel.dataset.statsDetail = `(${stats.stats})`;
    const spanStats = document.createElement("span");
    spanStats.classList.add("stats");
    const p = document.createElement("p");
    p.style.width = `${stats.stats}%`;
    spanStats.append(p);
    label.append(spanLabel, spanStats);
    tooltipContent.append(label);
  });
  return tooltipContent;
}

function onClickListHome() {
  const homeBox = document.querySelectorAll(".home-box");
  homeBox[0].onclick = function () {
    routeHomeList($(this), "#items");
  };
  homeBox[1].onclick = function () {
    routeHomeList($(this), "#weapon");
  };
  homeBox[2].onclick = function () {
    routeHomeList($(this), "#reward");
  };
}

function routeHomeList(thisItem, categoryId) {
  $(".tab-link, .box").removeClass("is-active");
  $(categoryId).addClass("is-active");
  $(`.tab-link[data-category="${categoryId}"]`).addClass("is-active");
  const newItem = thisItem.data("newItem");
  const itemContent = $(`.item-content h5[data-name-item="${newItem}"]`)
    .parent()
    .parent();
  itemContent.addClass("animate-item");
  setTimeout(() => {
    itemContent.removeClass("animate-item");
  }, 2000);
}

// Modal
function openModal() {
  const modal = document.querySelector(".modal");
  modal.showModal();
}

function closeModal() {
  const modal = document.querySelector(".modal");
  const close = document.querySelector(".modal-header .close");
  const btnClose = document.querySelector(".modal-footer .btn-cancel");
  close.onclick = () => modal.close();
  btnClose.onclick = () => modal.close();
  window.onclick = (event) => {
    if (event.target == modal) modal.close();
  };
}

function onConfirm(item) {
  const modal = document.querySelector(".modal");
  const btnConfirm = document.querySelector(".modal-footer .btn-confirm");

  btnConfirm.onclick = () => {
    console.log("Modal Confirm", { ...item });
    $.post(
      "http://SETUP_Area/Onbuyitem",
      JSON.stringify({
        name: item.itemName,
        cata: item.category,
        count: item.itemQuantity,
      })
    );
    clearQuantity();
    modal.close();
  };
}

function onClickBuyItem() {
  const btnBuyItem = document.querySelectorAll(".buy-item");
  const allItem = document.querySelectorAll(".item-content");
  const quantity = document.querySelectorAll('.quantity input[type="number"]');
  btnBuyItem.forEach((item, index) => {
    item.addEventListener("click", function () {
      const itemLabel = allItem[index].children[0];
      const itemQuantity = quantity[index].value;
      const itemName = itemLabel.dataset.nameItem;
      const categoryId = document.querySelector(".is-active").dataset.category;
      const category = $(categoryId).attr("id");
      openModal();
      onConfirm({ itemName, category, itemQuantity, index });
      closeModal();
    });
  });
}

function clearQuantity() {
  const inputForm = document.querySelectorAll('.quantity input[type="number"]');
  const itemPrice = document.querySelectorAll(".item-content p");
  inputForm.forEach((item) => {
    item.value = 1;
  });
  itemPrice.forEach((price) => {
    price.innerHTML = price.dataset.price;
  });
}

(function mergeHome() {
  const boxHome = document.querySelector(".box#home");

  const homeCarousel = createHomeCarousel();
  const homeList = createHomeList();
  boxHome.append(homeCarousel, homeList);
  onClickListHome();
})();

function createHomeCarousel(type = "picture") {
  const homeCarousel = document.createElement("div");
  homeCarousel.classList.add("home-carousel");
  let carousel;
  if (type == "video") {
    const video = document.createElement("video");
    video.classList.add("img-fluid");
    video.autoplay = true;
    video.loop = true;
    video.muted = true;

    const source = document.createElement("source");
    source.src = "https://mdbcdn.b-cdn.net/img/video/Tropical.mp4";
    source.type = "video/mp4";
    video.append(source);
    carousel = video;
  } else if (type == "picture") {
    const picture = document.createElement("picture");
    picture.classList.add("img-fluid");

    const img = document.createElement("img");
    img.src =
      "https://cdn.discordapp.com/attachments/739363217436049439/961337385482866738/area_training.png";
    picture.append(img);
    carousel = picture;
  }
  const btnSocial = createButtonSocial();
  homeCarousel.append(carousel, btnSocial);
  return homeCarousel;
}

function createButtonSocial() {
  const arrSocial = [
    {
      name: "facebook",
      src: "https://cdn.discordapp.com/attachments/739363217436049439/961956880861790219/facebook.webp",
    },
    {
      name: "instagram",
      src: "https://cdn.discordapp.com/attachments/739363217436049439/961957441321467904/instagram.webp",
    },
    {
      name: "youtube",
      src: "https://cdn.discordapp.com/attachments/739363217436049439/961956880861790219/facebook.webp",
    },
  ];
  const divBtnSocial = document.createElement("div");
  divBtnSocial.classList.add("btn-social");

  arrSocial.forEach((social) => {
    const img = document.createElement("img");
    const button = document.createElement("button");
    button.setAttribute("onclick", `socialMedia('${social.name}')`);
    img.src = social.src;
    button.append(img);
    divBtnSocial.append(button);
  });
  return divBtnSocial;
}

function createHomeList() {
  const arrNewItem = [
    {
      name: "Item1",
      src: "https://cdn.discordapp.com/attachments/739363217436049439/961349718963785788/picture-1.png",
    },
    {
      name: "Item2",
      src: "https://cdn.discordapp.com/attachments/739363217436049439/961349718699548732/picture-2.png",
    },
    {
      name: "Item_3",
      src: "https://cdn.discordapp.com/attachments/739363217436049439/961349719198674964/picture-3.png",
    },
  ];
  const divHomeList = document.createElement("div");
  divHomeList.classList.add("home-list");
  arrNewItem.forEach((item) => {
    const divHomeBox = document.createElement("div");
    divHomeBox.classList.add("home-box");
    divHomeBox.setAttribute("data-new-item", item.name);
    const img = document.createElement("img");
    img.src = item.src;
    divHomeBox.append(img);
    divHomeList.append(divHomeBox);
  });
  return divHomeList;
}

function createRewardHeaderElement(rewardpoint) {
  const rewardWrap = document.createElement("div");
  rewardWrap.classList.add("reward-wrap");
  const rewardHeader = document.createElement("div");
  rewardHeader.classList.add("reward-header");
  const h1 = document.createElement("h1");
  h1.innerHTML = "Reward";
  const span = document.createElement("span");
  span.classList.add("point");
  span.innerHTML = rewardpoint;
  const textRule = document.createElement("p");
  textRule.setAttribute("id", "text-rule");
  textRule.innerHTML =
    'ระบบจะเก็บ "Point" ทุกครั้งที่กดซื้อของ 1 Cash = 1 Point';

  rewardHeader.append(h1, span);
  rewardWrap.append(rewardHeader, textRule);
  return rewardWrap;
}

function createRewardItemElement(dataItem, urlImage, collectPoint) {
  const gridReward = document.createElement("div");
  gridReward.classList.add("grid-reward");
  const rewardBar = document.createElement("div");
  rewardBar.classList.add("reward-bar");
  gridReward.append(rewardBar);
  const bar = document.createElement("div");
  bar.classList.add("bar");
  const widthBar = calcReward(dataItem, collectPoint);
  bar.style.width = `${widthBar}%`;
  rewardBar.append(bar);

  dataItem.forEach((item) => {
    rewardBar.style = `grid-column-end: ${item.tier + 1}`;
    const divItems = document.createElement("div");
    divItems.classList.add("item", "tooltip");
    divItems.style = `grid-column: ${item.tier}`;
    const divItemContent = document.createElement("div");
    divItemContent.classList.add("item-content");
    const h5 = document.createElement("h5");
    h5.setAttribute("data-name-item", item.item);
    h5.innerHTML = item.label;
    const imgItem = document.createElement("img");
    imgItem.src = `${urlImage}${item.item}.png`;
    const p = document.createElement("p");
    p.setAttribute("data-price", item.price);
    p.innerHTML = item.price;
    p.classList.add("reward-icon");
    const buttonClaim = document.createElement("button");
    buttonClaim.classList.add("claim-item", "btn-hover");
    buttonClaim.innerHTML = "Claim";
    // div.item-content => h5, img, p
    divItemContent.append(h5, imgItem, p);
    // div.item => div.item-content
    divItems.append(divItemContent, buttonClaim);
    gridReward.append(divItems);
  });
  return gridReward;
}

function disabledReward(items) {
  const itemElement = document.querySelectorAll(".grid-reward .item");
  const collectPoint = parseInt(document.querySelector(".point").innerHTML);

  let prevPrice = 0;
  if (itemElement.length != 0 && !!items) {
    items.forEach((item, index) => {
      const btnItem = itemElement[index].querySelectorAll("button.claim-item");

      if (item.claimed || collectPoint < item.price) {
        itemElement[index].classList.add("disabled");
        btnItem[0].disabled = true;
        btnItem[0].classList.remove("btn-hover");
        itemElement[index].style.boxShadow = "none";
      }
      if (!item.claimed && collectPoint >= item.price) {
        btnItem[0].disabled = false;
        itemElement[index].style.boxShadow =
          "0 0.06rem 0.9rem 0 rgba(255, 255, 255, 0.5)";
      }
      if (collectPoint >= prevPrice && !item.claimed) {
        itemElement[index].classList.remove("disabled");
      }
      prevPrice = item.price;
    });
  }
}

function onClickClaimItem() {
  const btnClaimItem = document.querySelectorAll(".claim-item");
  btnClaimItem.forEach((item, index) => {
    item.addEventListener("click", function () {
      const allItem = document.querySelectorAll(".box.is-active .item-content");
      const itemLabel = allItem[index].children[0];
      const itemName = itemLabel.dataset.nameItem;
      const categoryId = document.querySelector(".is-active").dataset.category;
      const category = $(categoryId).attr("id");
      openModal();
      onConfirm({ itemName, category, index });
      closeModal();
    });
  });
}

function scrollMouseWheel() {
  const scrollContainer = document.querySelector(".grid-reward");

  scrollContainer.addEventListener("wheel", (event) => {
    event.preventDefault();
    scrollContainer.scrollLeft += event.deltaY;
  });
}

let round = 0;
function loadingAnimate(category) {
  if (round == 0 && category == "#reward") {
    round = 1;
    const rewardBar = document.querySelector(".reward-bar .bar");
    let width = 0;
    let animate = setInterval(() => {
      if (width >= widthBarItem) {
        clearInterval(animate);
        round = 0;
        return;
      }
      width++;
      rewardBar.style.width = `${width}%`;
    }, 10);
  }
}

let widthBarItem;
function calcReward(dataItem, mypoint) {
  const itemPrice = dataItem.map((item) => item.price);
  const quotient = 100 / itemPrice.length;
  let result = 0;
  let sumPrice = 0;
  let prevPrice = 0;
  itemPrice.every((price) => {
    sumPrice += price;
    if (mypoint <= sumPrice || mypoint == price) {
      //* Stack e.g.(Price Item: 100, 500, 1000 stack=> 100, 600, 1600)
      // let diff = mypoint - prevPrice;
      // let percent = (diff / price) * 100;
      //* e.g.(100 500 1000)
      let percent = (mypoint / price) * 100;
      //* Equal e.g.(100, 200, 300 or 200, 400, 600)
      // let diff = mypoint - prevPrice;
      // let percent = (diff / (price - prevPrice)) * 100;
      //*
      result += (percent / 100) * quotient;
      return false;
    } else {
      prevPrice += price;
      result += quotient;
    }
    return true;
  });
  widthBarItem = result;
  return result;
}
