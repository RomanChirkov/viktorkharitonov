"use strict";

let file = document.forms["contact__form"]["design"];
const urlHeader = 'http://localhost:8080/brandsforge/php/send-mail-header.php';
const urlContact = 'http://localhost:8080/brandsforge/php/send-mail.php';

let helpTextFormMessage = $('.message-body__hellow');
let messageBodyInput = $('.message-body__message');
let helpText = 'Привет. 👋 Предлагаю обсудить проект';

let advantagesSection = $('.advantages').offset().top - Number((($('.advantages').css('padding-top')).replace('px', '')));
console.log(advantagesSection);

$(window).scroll(function(event) {
  let scrollY = window.scrollY;

  if(scrollY >= advantagesSection) {
    $('.floatCircle').css('visibility', 'visible');
    $('.floatCircle').css('opacity', '1');
  } else {
    $('.floatCircle').css('visibility', 'hidden');
  }
});

function sendHeaderMail() {
  let form_message = $('.form__message')[0];
  let userMessageFormMessage = $(".message-body__message");
  let userNameFormMessage = $(".message-body__username");
  let userEmailFormMessage = $(".message-body__useremail");

  userNameFormMessage.attr('value', get_cookie("user_name"));
  userEmailFormMessage.attr('value', get_cookie("user_email"));

  const formData = new FormData();

  formData.append('message', userMessageFormMessage.val());
  formData.append('user_name', userNameFormMessage.val());
  formData.append('user_email', userEmailFormMessage.val());

  async function sendData(url, data) {
    try {

      const response = await fetch(url, {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      const status = result.status;
      const message = result.message;

      if(status === 'success') {
        $('.contact__form')[0].reset();

        openSendMessagePopUp("complete", ".wrapper__pop-up");
        
      } else {
        alert(message);
      }

      // console.log(status + ' ' + message);

    } catch (error) {
      openSendMessagePopUp("error", ".wrapper__pop-up");
      
      // console.error('Ошибка:', error);
    }
  }

  sendData(urlHeader, formData);
  closeForms();
  form_message.reset();
}

let getSize = (size) => {
  function round(val) {
    return (val / 1024).toFixed(2);
  }

  let count = 0;

  while (size >= 999) {
    count++;
    size = round(size);
  }

  if (count === 1) size = size + ", Kb";
  else size = size + ", Mb";

  return size;
};

function get_cookie(cookie_name) {
  var results = document.cookie.match(
    "(^|;) ?" + cookie_name + "=([^;]*)(;|$)"
  );

  if (results) return unescape(results[2]);
  else return null;
}

function closeForms() {
  $(".icons-wrapper__circle-2").css("z-index", "9");
  $(".icons-wrapper__circle").css("z-index", "10");
  $(".icons-wrapper__circle-2").css("opacity", "0");
  $(".icons-wrapper__circle-2").css("visiblity", "hidden");
  $(".icons-wrapper__circle").css("opacity", "1");
  $(".form__message").css("opacity", "0");
  $(".form__message").css("visibility", "hidden");
  $(".user__contact").css("margin-right", "0");
  $(".form__message").css("margin-right", "0");
  $(".user__contact").css("opacity", "0");
  $(".user__contact").css("display", "flex");
  $(".scroll-wrapper").css("zIndex", "6");

  helpMessageShow();
  messageBodyInput.val('');


  $(".icons-wrapper__circle").css('background', '#8638e4');
  let svgPaperPlane = `<svg class="icons-wrapper__paper__plane"><use xlink:href="icons/sprite.svg#paper_plane"></use></svg>`;

  $(".icons-wrapper__circle").html('').append(svgPaperPlane);
  $(".icons-wrapper__circle").on({
    mouseenter: function () {
      $(".icons-wrapper__circle").css('transform', 'rotate(45deg)');
      $(".icons-wrapper__circle").css('background', '#8638e4');
      $(".icons-wrapper__arrow__right").css('fill', 'white');        
    },
    mouseleave: function () {
      $(".icons-wrapper__circle").css('transform', 'rotate(0)');
      $(".icons-wrapper__circle").css('background', '#8638e4');
      $(".icons-wrapper__arrow__right").css('fill', 'white');        
    }
  });
}

function openSendMessagePopUp(name, element) {
  $(element).fadeIn();
  $(element).css("display", "flex");
  $(`.${name}`).css("display", "flex");
}

file.addEventListener("change", () => {
  let fileInfo = document.forms["contact__form"]["design"].files[0];

  let userDesign = document.querySelector(".user-design");
  let textName = document.querySelector(".wrapper__text-name");
  let textInfo = document.querySelector(".wrapper__text-info");
  let btnClose = document.querySelector(".user-design-close");

  let extension = fileInfo.name.substr(fileInfo.name.indexOf(".") + 1);

  textName.innerText = fileInfo.name.replace("." + extension, "");
  textInfo.innerText = extension.toUpperCase() + " " + getSize(fileInfo.size);
  userDesign.style.display = "flex";

  btnClose.addEventListener("click", () => {
    userDesign.style.display = "none";
    $('.form__design').val('');
  });
});

/** jQuery */

function helpMessageHide () {
  helpTextFormMessage.css('transition', 'all .5s');  
  helpTextFormMessage.css('visibility', 'hidden');
  helpTextFormMessage.css('opacity', '0');
}

function helpMessageShow () {
  helpTextFormMessage.css('transition', 'all .5s');  
  helpTextFormMessage.css('visibility', 'visible');
  helpTextFormMessage.css('opacity', '1');
}

messageBodyInput.on('keyup', () => {
  if(messageBodyInput.val().length >= 1) {
    helpMessageHide();
  } else {
    helpMessageShow();
  }
});


helpTextFormMessage.click(() => {
  messageBodyInput.val(helpText);
  helpMessageHide();
});

$(".form__btn").on("click", function (event) {
  let form = $('.contact__form')[0];
  let btn__submit = $('.form__btn');

  if(form.checkValidity()) {
    event.preventDefault();
  
    const formData = new FormData();
    let fileField = document.forms["contact__form"]["design"].files[0];

    formData.append('name', $('.form_name').val());
    formData.append('phoneNumber', $('.form_phoneNumber').val());
    formData.append('email', $('.form__email').val());
    formData.append('aboutProject', $('.form__aboutProject').val());
    formData.append('design', fileField);

    async function sendData(url, data) {
      try {

        const response = await fetch(url, {
          method: 'POST',
          body: data,
        });

        const result = await response.json();

        const status = result.status;
        const message = result.message;

        if(status === 'success') {
          $('.contact__form')[0].reset();

          openSendMessagePopUp("complete", ".wrapper__pop-up__contact");
          $(".user-design").css('display', 'none');
          
        } else {
          alert(message);
        }

        // console.log(status + ' ' + message);

      } catch (error) {
        openSendMessagePopUp("error", ".wrapper__pop-up__contact");
        $(".user-design").css('display', 'none');

        // console.error('Ошибка:', error);
      }
    }

    sendData(urlContact, formData);
  } else {
    btn__submit.click();
  }
});

// элемент анимации равен высоте секции услуги 

$('.sparkBackground').height($(".services").height());

// pop-up-icon-close
$(".message-send__icon-close").click(() => {
  $(".wrapper__pop-up").fadeOut();
});

//pop-up-btn-close
$(".message-send__btn").click(() => {
  $(".wrapper__pop-up").fadeOut();
});

// pop-up-icon-close__contact
$(".message-send__icon-close__contact").click(() => {
  $(".wrapper__pop-up__contact").fadeOut();
});

//pop-up-btn-close__contact
$(".message-send__btn__contact").click(() => {
  $(".wrapper__pop-up__contact").fadeOut();
});

$(document).ready(function () {
  //anima
  update();

  //footer anchor
  $("#anchor_ref").on("click", "a", function (event) {
    event.preventDefault();
    var id = $(this).attr("href"),
      top = $(id).offset().top;
    $("body,html").animate({ scrollTop: top }, 1500);
  });

  //menu anchor
  $(".menu__list").on("click", "a", function (event) {
    event.preventDefault();
    var id = $(this).attr("href"),
      top = $(id).offset().top;
    $("body,html").animate({ scrollTop: top }, 1500);
  });

  //scroll
  $(".scroll-wrapper").on("click", function (event) {
    event.preventDefault();
    var id = $(this).attr("href"),
      top = $(id).offset().top;
    $("body,html").animate({ scrollTop: top }, 1500);
  });

  //change lang
  $(".header__top-menu").click(function () {
    $(".menu").addClass("open-menu");
  });

  $(".menu__close-wrapper").click(function () {
    $(".menu").removeClass("open-menu");
  });

  $(".ru").click(() => {
    $(".ru").addClass("selected");
    $(".en").removeClass("selected");
  });

  $(".en").click(() => {
    $(".en").addClass("selected");
    $(".ru").removeClass("selected");
  });

  // cards tilt

  if($(window).width() > 800) {
    $(".benefits__list-item").tilt({
      maxTilt: -20,
      glare: false,
      maxGlare: 1,
    });
  }


  // якорь на контакты при клике на кнопки написать
  $(".refContact").on("click", function (event) {
    event.preventDefault();
    var id = $(this).attr("href"),
      top = $(id).offset().top;
    $("body,html").animate({ scrollTop: top }, 1500);
  });

  //form message

  let step = 0;

  //arrow_click
  $(".icons-wrapper__circle").click(function () {
    $(".icons-wrapper__circle").css('transform', 'rotate(0)');
    // $(".icons-wrapper__circle").css('background', '#8638e4');
    // $(".icons-wrapper__arrow__right").css('fill', 'white');      
    if (step === 0) {
      $(".icons-wrapper__circle").on({
        mouseenter: function () {
          $(".icons-wrapper__circle").css('transform', 'rotate(0)');
          $(".icons-wrapper__circle").css('background', '#8638e4');
          $(".icons-wrapper__arrow__right").css('fill', 'white');        
        },
        mouseleave: function () {
          $(".icons-wrapper__circle").css('background', 'white');
          $(".icons-wrapper__arrow__right").css('fill', '#8638e4');        
        }
      });
      $(".form__message").css("visibility", "visible");
      $(".form__message").css("opacity", "1");
      $(".form__message").css("opacity", "1");
      $(".user__contact").css("display", "none");
      $(".scroll-wrapper").css("zIndex", "4");

      let svgArrowRight = `<svg class="icons-wrapper__arrow__right"><use xlink:href="icons/sprite.svg#arrow_right"></use></svg>`;

      $(".icons-wrapper__circle").html('').append(svgArrowRight);
      $(".icons-wrapper__circle").css('background', 'white');


      if($(window).width() > 435) {
        $(".form__message").css("margin-right", "45px");
      } else {
        $(".form__message").css("margin-right", "25px");
      }

      step++;
    } else {
      if ($("#message").val() !== "") {
        if (
          get_cookie("user_name") == null &&
          get_cookie("user_email") == null
        ) {
          if($(window).width() > 435) {
            $(".user__contact").css("margin-right", "45px");
          } else {
            $(".user__contact").css("margin-right", "25px");
          }

          $(".form__message").css("opacity", "0");
          $(".user__contact").css("opacity", "1");

          $(".user__contact").css("display", "flex");
          $(".user__contact").css("visibility", "visible");
          $(".icons-wrapper__circle-2").css("z-index", "10");
          $(".icons-wrapper__circle-2").css("opacity", "1");
          $(".icons-wrapper__circle-2").css("visibility", "visible");
          $(".icons-wrapper__circle").css("z-index", "9");
          $(".icons-wrapper__circle").css("opacity", "0");

          step++;
        } else {
          sendHeaderMail();
          step = 0;
        }
      } else {
        $("#message").css("animation", "validMessage 0.3s ease-in 3");
        setTimeout(() => {
          $("#message").css("animation", "transparent");
        }, 1000);
      }
    }
  });

  // paper_plane click
  $(".icons-wrapper__circle-2").click(function (event) {
    let userContactSubmit = $('.user__contact-send');
    let userContactForm = $('.user__contact')[0];

    if(userContactForm.checkValidity()) {
      event.preventDefault();

      let userNameFormContact = $(".user__contact-name").val();
      let userEmailFormContact = $(".user__contact-email").val();
      
      document.cookie = `user_name=${userNameFormContact}`;
      document.cookie = `user_email=${userEmailFormContact}`;

      sendHeaderMail();
      userContactForm.reset();
      step = 0;

    } else {
      userContactSubmit.click();
    }
  });

  //form message close
  $(".message-header__icon").click(function () {
    closeForms();
    step = 0;
  });

  //back from user_contact to form_message
  $(".user__contact-icon").click(function () {
    $(".icons-wrapper__circle-2").css("z-index", "9");
    $(".icons-wrapper__circle").css("z-index", "10");
    $(".icons-wrapper__circle-2").css("opacity", "0");
    $(".icons-wrapper__circle-2").css("visibility", "hidden");
    $(".icons-wrapper__circle").css("opacity", "1");
    $(".form__message").css("opacity", "1");
    $(".user__contact").css("opacity", "0");
    $(".user__contact").css("display", "none");

    step = 1;
  });
});

/**
 *
 *  animation
 *
 */

 let _correction = 1.335; //1


 if($(window).width() <= 540) {
  _correction = 1.83; //1.359
 }

 class Particle{
    
  constructor(svg, coordinates, friction){
    this.svg = svg
    this.steps = ($(window).height())/3 //window
    this.item = null
    this.friction = friction
    this.coordinates = coordinates
    this.position = this.coordinates.y
    this.dimensions = this.render()
    this.rotation = Math.random() > 0.5 ? "-" : "+"
    this.scale = 0.5 + Math.random()
    this.siner = 200 * Math.random()
  }
  
  destroy(){
    this.item.remove()
  }
  
  move(){
    this.position = this.position - this.friction
    let top = this.position;
    let left = this.coordinates.x + Math.sin(this.position*Math.PI/this.steps) * this.siner;
    this.item.css({
      transform: "translateX("+ left / _correction +"px) translateY("+ top / 1.02 +"px) scale(" + this.scale + ") rotate("+(this.rotation)+(this.position + this.dimensions.height)+"deg)"
    })

    if(this.position < -(this.dimensions.height)){
      this.destroy()
      return false
    }else{
      return true
    }
  }
  
  render(){
    this.item = $(this.svg, {
      css: {
        transform: "translateX("+this.coordinates.x+"px) translateY("+this.coordinates.y+"px)"
      }
    })
    $(".sparkBackground").append(this.item)
    return {
      width: this.item.width(),
      height: this.item.height()
    }
  }
}

const spark1 = '<img src="img/Asset 6@2x.png" alt="diamond-6" class="spark-1 spark"/>';
const spark2 = '<img src="img/Asset 7@2x.png" alt="diamond-7" class="spark-2 spark"/>';
const spark3 = '<img src="img/Asset 8@2x.png" alt="diamond-8" class="spark-3 spark"/>';
const spark4 = '<img src="img/Asset 9@2x.png" alt="diamond-9" class="spark-4 spark"/>';
const spark5 = '<img src="img/Asset 10@2x.png" alt="diamond-10" class="spark-5 spark"/>';
const spark6 = '<img src="img/Asset 11@2x.png" alt="diamond-11" class="spark-6 spark"/>';
const spark7 = '<img src="img/Asset 12@2x.png" alt="diamond-12" class="spark-7 spark"/>';
const spark8 = '<img src="img/Asset 13@2x.png" alt="diamond-13" class="spark-8 spark"/>';
const spark9 = '<img src="img/Asset 14@2x.png" alt="diamond-14" class="spark-9 spark"/>';
const spark10 = '<img src="img/Asset 15@2x.png" alt="diamond-15" class="spark-10 spark"/>';
const spark11 = '<img src="img/Asset 16@2x.png" alt="diamond-16" class="spark-11 spark"/>';
const spark12 = '<img src="img/Asset 17@2x.png" alt="diamond-17" class="spark-12 spark"/>';
const spark13 = '<img src="img/Asset 17@2x.png" alt="diamond-18" class="spark-13 spark"/>';

function randomInt(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

const data = [ 
  spark1, spark2, spark3, spark4, spark5, spark6, spark7,
  spark8/*, spark9, spark10, spark11, spark12, spark13,*/
];

let isPaused = false;
window.onblur = function() {
    isPaused = true;
}.bind(this)
window.onfocus = function() {
    isPaused = false;
}.bind(this)

let particles = []

setInterval(function(){
  if (!isPaused){
    particles.push(
      new Particle(data[randomInt(0,data.length-1)], {
       "x": (Math.random() * $('.sparkBackground').width()),
       "y": $('.sparkBackground').height()
      }, (1.25 + Math.random() * 1.75) )
    )
  }
}, 2200)

function update(){
  particles = particles.filter(function(p){
    return p.move()
  })
  requestAnimationFrame(update.bind(this))
}
