document.addEventListener("DOMContentLoaded", function() {

    assignEvents();
    getData();
});


function getData(page=1) {

    let lang = document.documentElement.lang;
    
    fetch(`/${lang}/blogs`, {
        method: 'POST',
        body: JSON.stringify({
            filter: createObject(),
            page: page})
    })
    .then(response => response.json())
    .then(result => {

        // clear the current products
        let container = document.getElementById("blogs-container");
        container.innerHTML = "";

        // find the div element with the id "empty-message"
        let message = document.getElementById("empty-message");
        if (result.blogs.length === 0) {
            // Change the message display style to block
            message.style.display = "block";
        } else {
            // If the array is not empty, change the display style to none
            message.style.display = "none";
        }
        result.blogs.forEach((blog) => {
            createBlogItem(blog);
        })
        createPagination(page=result.page, has_next=result.has_next, has_prev=result.has_prev, num_pages=result.num_pages);
    })
}


// create an object based on the input and the buttons
function createObject() {
  // Get the value of the input field with id of 'search'
  var searchValue = document.getElementById("search").value;
  // Create an object with a property named 'search' and assign the value to it
  var obj = {search: searchValue};
  // Get all the elements with the classes 'btn-filter' and 'pressed'
  var buttons = document.querySelectorAll(".btn-filter.pressed");
  // Loop through the buttons
  for (var i = 0; i < buttons.length; i++) {
    
    var value = Number(buttons[i].dataset.value);
    if (obj.hasOwnProperty('category')) {
      obj['category'].push(value);
    } else {
        obj['category'] = [value];
    }
  }
  // Return the object
  return obj;
}


function createBlogItem(data) {
    let lang = document.documentElement.lang;
    // Select the products-container element by its id
    let container = document.getElementById("blogs-container");


    // Create outermost div
    let newsBlockThree = document.createElement('div');
    newsBlockThree.className = 'news-block-three';

    // Create inner-box div
    let innerBox = document.createElement('div');
    innerBox.className = 'inner-box';
    newsBlockThree.appendChild(innerBox);

    // Create image-box div
    let imageBox = document.createElement('div');
    imageBox.className = 'image-box';
    innerBox.appendChild(imageBox);

    // Create figure element
    let figure = document.createElement('figure');
    figure.className = 'image';
    imageBox.appendChild(figure);

    // Create img element inside figure
    let img = document.createElement('img');
    img.src = data.image;
    img.alt = data.title;
    figure.appendChild(img);

    // Create lower-content div
    let lowerContent = document.createElement('div');
    lowerContent.className = 'lower-content';
    innerBox.appendChild(lowerContent);

    // Create h3 element inside lower-content
    let h3 = document.createElement('h3');
    let h3Link = document.createElement('a');
    h3Link.href = 'blog-detail.html';
    h3Link.textContent = data.title;
    h3.appendChild(h3Link);
    lowerContent.appendChild(h3);

    // Create div for text
    let textDiv = document.createElement('div');
    textDiv.className = 'text';
    textDiv.textContent = data.summary;
    lowerContent.appendChild(textDiv);

    // Create link-box div
    let linkBox = document.createElement('div');
    linkBox.className = 'link-box';
    lowerContent.appendChild(linkBox);

    // Create a element inside link-box
    let aLink = document.createElement('a');
    aLink.href = `/${lang}/blogs/${data.slug}_${data.id}`;
    aLink.className = 'theme-btn read-more';
    if (lang == 'en')
        {
            aLink.textContent = 'Read more';
        } else if (lang == 'ar') {
            aLink.textContent = 'اقرأ المزيد';
        }
    linkBox.appendChild(aLink);

    // Append the item element to the container element    
    container.appendChild(newsBlockThree);
}

// filter optimization functions:
function pressChildFilter(element) {
    // grab the element's id
    let id = element.id;
    // if element has a class "pressed" -> remove it
    if (element.classList.contains("pressed")) {
        element.classList.remove("pressed");
        // Select all the elements that have the id and the classes "btn-filter" and "pressed"
        var elements = document.querySelectorAll('#' + id + '.btn-filter.pressed');

        // If there are no elements like that
        if (elements.length == 0) {
          // Select the element that has the id and the class "all-filter"
          var element = document.querySelector('#' + id + '.all-filter');
          // Add the class "pressed" to the element
          element.classList.add('pressed');
        }
        return;
    }

    // add the class "pressed" to the element
    element.classList.add("pressed");
    // if an element with the same id and the class: "all-filter" and "pressed" does exist
    let otherElement = document.querySelector("#" + id + ".all-filter.pressed");
    if (otherElement) {
    // then remove the class "pressed" from it
        otherElement.classList.remove("pressed");
  }
}


function pressChildAll(element) {
    // check if the given element has the class "pressed"
    if (element.classList.contains("pressed")) {
        // then do nothing
        return;
    }
    // remove the class "pressed" from all the elements that have the same id as the given element and the class "pressed"
    let id = element.id;
    let pressedElements = document.querySelectorAll("#" + id + ".pressed");
    for (let pressedElement of pressedElements) {
        pressedElement.classList.remove("pressed");
    }
    // add the class "pressed" to the given element
    element.classList.add("pressed");
    getData();
    
}

// assign each event listener function to its element
function assignEvents() {
    // assign events to btn-fliter elements
    let btns = document.querySelectorAll(".btn-filter");
    // loop through each element
    for (let btn of btns) {
        // add an event listener on click
        btn.addEventListener("click", function() {
            // call the pressElement function with the clicked element as the argument
            pressChildFilter(this);
            getData();
        });
    }    
    // assign events to all-fliter elements
    let allbtns = document.querySelectorAll(".all-filter");
    for (let btn of allbtns) {
        // add an event listener on click
        btn.addEventListener("click", function() {
            // call the pressElement function with the clicked element as the argument
            pressChildAll(this);
        });
    }


    // Get the search input element by its id
    var searchInput = document.getElementById("search");
    searchInput.addEventListener("input", function() {
        getData();
    });
}


// pagination
function createPagination(page, has_next, has_prev, num_pages) {
    // clear old pagination
    let div = document.querySelector(".blog-pagination");
    div.innerHTML = "";
    // check if both has_next and has_prev are false
    if (!has_next && !has_prev) {
        // do nothing and return
        return;
    }
    // create the ul element
    let ul = document.createElement("ul");
    ul.className = "clearfix";
    // create the li elements
    let li_prev = document.createElement("li");
    li_prev.className = "prev";
    let a_prev = document.createElement("a");
    a_prev.innerHTML = "<i class='fa fa-angle-double-left'></i>";
    li_prev.appendChild(a_prev);
    ul.appendChild(li_prev);


    if (has_prev) {
        if (num_pages - page === 0 && num_pages > 2) {
            let li_dprepage = document.createElement("li");;
            let a_dprepage = document.createElement("a");
            a_dprepage.textContent = page - 2;
            li_dprepage.appendChild(a_dprepage);
            li_dprepage.addEventListener("click", function() {
                // call this function getData(page - 2)
                getData(page - 2);
            });
            ul.appendChild(li_dprepage);
        }
        let li_prepage = document.createElement("li");;
        let a_prepage = document.createElement("a");
        a_prepage.textContent = page - 1;
        li_prepage.appendChild(a_prepage);
        li_prepage.addEventListener("click", function() {
            // call this function getData(page - 1)
            getData(page - 1);
        });
        ul.appendChild(li_prepage);
    }

    let li_page = document.createElement("li");
    li_page.className = "active";
    let a_page = document.createElement("a");
    a_page.textContent = page;
    li_page.appendChild(a_page);
    ul.appendChild(li_page);

    if (has_next) {
        let li_nexpage = document.createElement("li");;
        let a_nexpage = document.createElement("a");
        a_nexpage.textContent = page + 1;
        li_nexpage.appendChild(a_nexpage);
        li_nexpage.addEventListener("click", function() {
            // call this function getData(page + 1)
            getData(page + 1);
        });
        ul.appendChild(li_nexpage);
        if (num_pages > 2 && page === 1) {
            let li_dnexpage = document.createElement("li");
            let a_dnexpage = document.createElement("a");
            a_dnexpage.textContent = page + 2;
            li_dnexpage.appendChild(a_dnexpage);
            li_dnexpage.addEventListener("click", function() {
                // call this function getData(page + 2)
                getData(page + 2);
            });
            ul.appendChild(li_dnexpage);
        }
    }

    let li_next = document.createElement("li");
    li_next.className = "next";
    let a_next = document.createElement("a");
    a_next.innerHTML = "<i class='fa fa-angle-double-right'></i>";
    li_next.appendChild(a_next);
    ul.appendChild(li_next);

    // check if has_next is true
    if (num_pages - page > 2) {
        // add event listener to its li
        li_next.addEventListener("click", function() {
            getData(page + 2);
        });
    } else {
        // change the background color of that li to gray
        a_next.style.backgroundColor = "#bcbcbc";
    }
    // check if has_prev is true
    if (page > 2) {
        // add event listener to its li
        li_prev.addEventListener("click", function() {
            // call this function getData(page - 2)
            getData(page - 2);
        });
    } else {
        // change the background color of that li to gray
        a_prev.style.backgroundColor = "#bcbcbc";
    }
    // append that ul to the div with the class: "shop-pagination"
    div.appendChild(ul);
}

