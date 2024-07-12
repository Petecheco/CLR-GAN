let curPage = 0;
let totalPages = 2;
let bCanScroll = true;

let scrollEvent = 0;

setTimeout(() => window.scrollTo(0,0), 150);

var scrollFunc = function (e) {
    e = e || window.event;

    if (e.wheelDelta) { // Chrominum
        scrollEvent = e.wheelDelta;
    } else if (e.detail) { // Gecko
        scrollEvent = e.detail * -1;
    }
    if (bCanScroll) {
        bCanScroll = false;
        if (scrollEvent < 0) {
            scrollDown();
        }
        else {
            scrollUp();
        }
        setTimeout("bCanScroll = true;", 400)
    }
}

function scrollDown() {
    if (curPage < totalPages) {
        ++curPage;
        scrollTo({
            top: document.getElementsByClassName("c-pg")[0].clientHeight * curPage,
            behavior: "smooth"
        });
    }
}

function scrollUp() {
    if (curPage > 0) {
        --curPage;
        scrollTo({
            top: document.getElementsByClassName("c-pg")[0].clientHeight * curPage,
            behavior: "smooth"
        });
    }
}

let cInfos = document.getElementsByClassName("c-p2-info");

cInfos[0].addEventListener("mouseover", () => {
    bCanScroll = false;
})

cInfos[1].addEventListener("mouseover", () => {
    bCanScroll = false;
})

cInfos[0].addEventListener("mouseout", () => {
    bCanScroll = true;
})

cInfos[1].addEventListener("mouseout", () => {
    bCanScroll = true;
})

if (document.addEventListener) {
    document.addEventListener('DOMMouseScroll', scrollFunc, false);
}//W3C
window.onmousewheel = document.onmousewheel = scrollFunc;

let cBtns = document.getElementsByClassName("c-p2-choose-box")[0].children;
let nowChoose = 0;

cBtns[0].addEventListener('click', () => {
    if (nowChoose == 1) {
        nowChoose = 0;
        cBtns[0].setAttribute('class', 'c-p2-choose-item-choosed');
        showInfo(0);
        cBtns[1].setAttribute('class', 'c-p2-choose-item');
        hideInfo(1);
    }
})

cBtns[1].addEventListener('click', () => {
    if (nowChoose == 0) {
        nowChoose = 1;
        cBtns[1].setAttribute('class', 'c-p2-choose-item-choosed');
        showInfo(1);
        cBtns[0].setAttribute('class', 'c-p2-choose-item');
        hideInfo(0);
    }
})

function showInfo(i) {
    cInfos[i].style = "opacity: 1;";
}

function hideInfo(i) {
    cInfos[i].style = "opacity: 0; max-height: 0px; margin: 0px; padding: 0px; filter: saturate(180%) blur(20px);";
}