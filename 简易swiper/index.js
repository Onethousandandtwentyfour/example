window.onload = () => {
  const swiperWrapper = document.querySelector(".swiper-outer"),
    slider = document.querySelector(".swiper-inner"),
    sliderItems = document.querySelectorAll(".swiper-item");

  function InitHandler(wrapper, slider, items) {
    console.group("%cswiper初始化...", "color:orange;padding:5px;");
    const firstNode = items[0],
      lastNode = items[items.length - 1],
      cloneFirst = firstNode.cloneNode(true),
      cloneLast = lastNode.cloneNode(true),
      slideWidth = items[0].offsetWidth;
    //添加收尾节点
    console.log("=> 添加收尾节点");
    slider.appendChild(cloneFirst);
    slider.insertBefore(cloneLast, firstNode);
    console.log("end <=");
    //添加事件处理函数
    console.log("=> 添加事件处理函数");
    //pc鼠标事件
    wrapper.onmousedown = dragStart;
    //移动端触摸事件
    wrapper.ontouchstart = dragStart;
    wrapper.ontouchmove = dragAction;
    wrapper.ontouchend = dragEnd;
    //翻页动画结束时间
    slider.ontransitionend = checkIndex;
    console.log("end <=");
    //声明事件处理函数
    //局部变量
    let posX1 = 0,
      posX2 = 0,
      threshold = 100, //移动距离阈值，大于阈值切换到下一个item，否则留在当前item
      initTransX = -slideWidth,
      lastTransX = 0,
      allowShift = true, //回滚动画可用
      index = 0; //当前swiper下标
    //初始位置
    updateTranslate(initTransX);
    //处理鼠标开始移动事件
    function dragStart(e) {
      e = e || window.event;
      e.preventDefault();
      if (!allowShift) {
        return;
      }

      lastTransX = initTransX;
      //pc和移动端 e的属性分开处理
      if (e.type == "touchstart") {
        posX1 = e.touches[0].clientX;
      } else {
        posX1 = e.clientX;
        wrapper.onmousemove = dragAction;
        wrapper.onmouseup = dragEnd;
      }
    }
    //处理鼠标移动中事件
    function dragAction(e) {
      e = e || window.event;
      e.preventDefault();
      if (!allowShift) {
        return;
      }

      if (e.type == "touchmove") {
        posX2 = posX1 - e.touched[0].clientX;
        posX1 = e.touched[0].clientX;
      } else {
        posX2 = posX1 - e.clientX;
        posX1 = e.clientX;
      }
      lastTransX -= posX2;
      updateTranslate(lastTransX);
    }
    //处理鼠标移动结束事件
    function dragEnd(e) {
      e = e || window.event;
      e.preventDefault();
      if (!allowShift) {
        return;
      }

      if (lastTransX - initTransX < -threshold) {
        // console.log("向右");
        shiftSlide(true);
      } else if (lastTransX - initTransX > threshold) {
        // console.log("向左");
        shiftSlide(false);
      } else {
        // console.log("留在当前页");
        updateTranslate(initTransX);
      }
      wrapper.onmousemove = null;
      wrapper.onmouseup = null;
    }

    /**
     * 自动滚动到上/下一页
     * @param {*} direction true 正向 ，false 反向
     * @param {*} action
     */
    function shiftSlide(direction = true) {
      slider.classList.add("shifting");
      if (allowShift) {
        if (direction) {
          initTransX -= slideWidth;
          index++;
        } else {
          initTransX += slideWidth;
          index--;
        }
        updateTranslate(initTransX);
      }
      allowShift = false;
    }
    //更新translateX快捷函数
    function updateTranslate(num) {
      slider.style.transform = `translateX(${num}px)`;
    }
    //判定当前index
    function checkIndex() {
      slider.classList.remove("shifting");
      if (index <= -1) {
        initTransX = -slideWidth * items.length;
        updateTranslate(initTransX);
        index = items.length - 1;
      } else if (index >= items.length) {
        initTransX = -slideWidth;
        updateTranslate(initTransX);
        index = 0;
      }
      allowShift = true;
    }
    console.log("初始化结束");
    console.groupEnd();
  }

  InitHandler(swiperWrapper, slider, sliderItems);
};
