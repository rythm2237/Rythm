// ********** set date ************
// select span
const date = document.getElementById("date");
date.innerHTML = new Date().getFullYear();

// ********** close links ************
const navToggle = document.querySelector(".nav-toggle");
const linksContainer = document.querySelector(".links-container");
const links = document.querySelector(".links");

navToggle.addEventListener("click", function () {
  // linksContainer.classList.toggle("show-links");

  const linksHeight = links.getBoundingClientRect().height;
  const containerHeight = linksContainer.getBoundingClientRect().height;
  if (containerHeight === 0) {
    linksContainer.style.height = `${linksHeight}px`;
  } else {
    linksContainer.style.height = 0;
  }
});

// ********** fixed navbar ************

const navbar = document.getElementById("nav");
const topLink = document.querySelector(".top-link");

window.addEventListener("scroll", function () {
  const scrollHeight = window.pageYOffset;
  const navHeight = navbar.getBoundingClientRect().height;
  if (scrollHeight > navHeight) {
    navbar.classList.add("fixed-nav");
  } else {
    navbar.classList.remove("fixed-nav");
  }
  // setup back to top link

  if (scrollHeight > 500) {
    // console.log("helo");

    topLink.classList.add("show-link");
  } else {
    topLink.classList.remove("show-link");
  }
});
// ********** smooth scroll ************
// select links
const scrollLinks = document.querySelectorAll(".scroll-link");
scrollLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    // prevent default
    e.preventDefault();
    // navigate to specific spot
    const id = e.currentTarget.getAttribute("href").slice(1);
    const element = document.getElementById(id);

    const navHeight = navbar.getBoundingClientRect().height;
    const containerHeight = linksContainer.getBoundingClientRect().height;
    const fixedNav = navbar.classList.contains("fixed-nav");
    let position = element.offsetTop - navHeight;

    if (!fixedNav) {
      position = position - navHeight;
    }
    if (navHeight > 82) {
      position = position + containerHeight;
    }

    window.scrollTo({
      left: 0,
      top: position,
    });
    // close
    linksContainer.style.height = 0;
  });
});
// calculate heights


//using selectors inside the element
const questions = document.querySelectorAll(".question");

questions.forEach(function (question) {
  const btn = question.querySelector(".question-btn");

  btn.addEventListener("click", function () {

    questions.forEach(function (item) {
      if (item !== question) {
        item.classList.remove("show-text");
      }
    });

    question.classList.toggle("show-text");
  });
});

//about
const about = document.querySelector(".about");
const btns = document.querySelectorAll(".tap-btn");
const articles = document.querySelectorAll(".content");
console.log(btns)
about.addEventListener("click", function (e) {
  const id = e.target.dataset.id;
  if (id) {
    // remove selected from other buttons
    btns.forEach(function (btn) {
      btn.classList.remove("active");
    });
    e.target.classList.add("active");
    // hide other articles
    articles.forEach(function (article) {
      article.classList.remove("active");
    });
    const element = document.getElementById(id);
    element.classList.add("active");
  }
});


//slider
let pos=0;
function move(i) {
  pos=i*-100;
  gal.style.left= pos + "%";
  // body...
}

right.onclick=function () {
  if (pos > -400){
    pos = pos - 100;
    gal.style.left= pos + "%";
  }
  else if(pos == -400){
    pos = 0;
    gal.style.left= pos + "%";
  }
}

left.onclick=function () {
  if (pos < 0){
    pos = pos + 100;
    gal.style.left= pos + "%";
  }

}



//Galery


function popup(i){
  overlay.className= "show"
  pop.className= "show" 
  big_img.src= "img/" + i + ".jpg"
}
function closeAll(){
  overlay.className= "hide"
  pop.className= "hide"    
}
function creation(image, title, des, price){
  let it = document.createElement("div")
      it.className = "items hide"
          
          let im = document.createElement("img")
              im.src = "img/" + image
          let mas = document.createElement("div")
              mas.className = "info"

                  let h = document.createElement("h2")
                  h.innerHTML = title
                  let par = document.createElement("p")
                  par.innerHTML = des
                  let sp = document.createElement("span")
                  sp.innerHTML = price
                  let anc = document.createElement("a")
                  anc.innerHTML = "Buy"
                  anc.href = "#"
mas.appendChild(h)
mas.appendChild(par)
mas.appendChild(sp)
mas.appendChild(anc)

it.appendChild(im)
it.appendChild(mas)
return it
}


let cols = document.querySelectorAll("#all > .sut")
function attachment(i){
  let p1 = (i % 14 + 1) + ".jpg"
  let p2 = "Product" + (i + 1)
  let p3 = "Detals" + (i + 1)
  let p4 = (Math.floor(Math.random() * 20))*1000 + "Ft"

  let el = creation(p1,p2,p3,p4)
  el.className = "items show"
  el.onclick = function(){
      popup(i % 14 + 1)
  }

  cols[i % 4].appendChild(el)
}
for (i=0; i<8; i++){
  setTimeout ("attachment(" + i +  ")", 300*i)
}


