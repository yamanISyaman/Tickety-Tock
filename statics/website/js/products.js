document.addEventListener("DOMContentLoaded", function() {

    assignEvents();
    getData();
});


function getData(page=1) {

    let lang = document.documentElement.lang;
    
    fetch(`/${lang}/products`, {
        method: 'POST',
        body: JSON.stringify({
            filter: createObject(),
            page: page})
    })
    .then(response => response.json())
    .then(result => {

        // clear the current products
        let container = document.getElementById("products-container");
        container.innerHTML = "";

        // find the div element with the id "empty-message"
        let message = document.getElementById("empty-message");
        if (result.products.length === 0) {
            // Change the message display style to block
            message.style.display = "block";
        } else {
            // If the array is not empty, change the display style to none
            message.style.display = "none";
        }
        result.products.forEach((product) => {
            createShopItem(product);
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
    // Get the id and the data-value of the current button
    var id = buttons[i].id;
    var value = Number(buttons[i].dataset.value);
    // Check if the object already has a property with the same id
    if (obj.hasOwnProperty(id)) {
      // If yes, push the value to the existing array
      obj[id].push(value);
    } else {
      // If not, create a new property with the id and assign an array with the value
      obj[id] = [value];
    }
  }
  // Return the object
  return obj;
}


function createShopItem(data) {
  let lang = document.documentElement.lang;
  // Select the products-container element by its id
  let container = document.getElementById("products-container");

  // Create a new div element with the class of shop-item and the appropriate column classes
  let item = document.createElement("div");
  item.className = "shop-item col-lg-2 col-md-4 col-sm-12";

  //the style property
  item.style.visibility = "visible";
  item.style.animationDuration = "2000ms";
  item.style.animationDelay = "0ms";
  item.style.animationName = "fadeIn";

  // Create the inner-box element and append it to the item element
  let innerBox = document.createElement("div");
  innerBox.className = "inner-box";
  item.appendChild(innerBox);

  // Create the image element and append it to the inner-box element
  let image = document.createElement("div");
  image.className = "image";
  innerBox.appendChild(image);

  // Create the anchor element with the data.url as the href attribute and append it to the image element
  let anchor = document.createElement("a");
  anchor.href = `/${lang}/products/${data.name}_${data.id}`;
  anchor.alt = data.name;
  image.appendChild(anchor);

    // Create an empty img element
    let img = document.createElement("img");

    // Set the src and alt attributes
    img.setAttribute("src", data.image);
    img.setAttribute("alt", "");
    anchor.appendChild(img);

    
    if (data.tag) {
        // Create the tag-banner element with the data.tag as the text content and append it to the image element
        let tagBanner = document.createElement("div");
        tagBanner.className = "tag-banner";
        tagBanner.textContent = data.tag;
        image.appendChild(tagBanner);
    }

  // Create the lower-content element and append it to the inner-box element
  let lowerContent = document.createElement("div");
  lowerContent.className = "lower-content";
  innerBox.appendChild(lowerContent);

  // Create the heading element with the data.name as the text content and the data.slug as the href attribute and append it to the lower-content element
  let heading = document.createElement("h3");
  let link = document.createElement("a");
  link.href = `/${data.slug}`;
  link.textContent = data.name;
  heading.appendChild(link);
  lowerContent.appendChild(heading);

  // Append the item element to the container element
  container.appendChild(item);
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
          
          checkForResetedCase();
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
        // Call the makeResetButton() function
        makeResetButton();
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
    checkForResetedCase();
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
        
        // Get the value of the search input
          var searchValue = searchInput.value;

          // Check if the search input is empty
          if (searchValue === "") {
            // Call the checkForIdeal function
            checkForResetedCase();
          } else {
            // Call the makeResetButton function with the value of the search input
            makeResetButton(searchValue);
          }
    });
}




function checkForResetedCase() {

    // Get the search input element by its id
    var searchInput = document.getElementById("search");
    var searchValue = searchInput.value;
      
    // Get the elements with both class "all-filter" and "pressed"
    var pressedFilters = document.querySelectorAll(".all-filter.pressed");
    // Get the elements with only class "all-filter"
    var allFilters = document.querySelectorAll(".all-filter");

    if (pressedFilters.length == allFilters.length && searchValue === "") {
        // Get the element with the id "reset-filter-button"
        var button = document.getElementById("filter-reset");
        // Remove the button element from the document
        if (button) {
            button.remove();
        }
    }
}



            
// This function creates a button element with the text from the data-text attribute of the div element
function createButton() {
  // Get the div element with the class "reset-btn-container"
  var div = document.querySelector(".reset-btn-container");
  // Get the text from the data-text attribute of the div element
  var text = div.dataset.text;
  // Create a button element with the same attributes as the given button
  var button = document.createElement("BUTTON");
  button.id = "filter-reset";
  button.className = "theme-btn btn-style-four";
  button.style.visibility = "visible";
  button.style.animationDuration = "1500ms";
  button.style.animationDelay = "0ms";
  button.style.animationName = "fadeInUp";
  // Create a span element with the text from the data-text attribute of the div element
  var span = document.createElement("SPAN");
  span.className = "txt";
  span.textContent = text;
  // Append the span element to the button element
  button.appendChild(span);
  // Return the button element
  return button;
}

// This function adds a click event listener to the button
function addButtonListener(button) {
  // Add a click event listener to the button element
  button.addEventListener("click", function() {
    // Get all the elements with the class "all-filter"
    var filters = document.querySelectorAll(".all-filter");
    // Loop through the filters
    for (var i = 0; i < filters.length; i++) {
      // Get the current filter element
      var filter = filters[i];
      // Call the function pressChildAll(element) with the filter element as the argument
      pressChildAll(filter);
    }

    // clear the search input field
    var input = document.getElementById("search");
    // Set the input value to an empty string
    input.value = "";
      
    // Remove the button element from the document
    button.remove();
    getData();
  });
}


// create a reset button
function makeResetButton() {
    // Call the createButton() function and store the result in a variable
    var button = createButton();
    // Call the addButtonListener() function with the button element as the argument
    addButtonListener(button);
    // Get the div element with the class "reset-btn-container"
    var div = document.querySelector(".reset-btn-container");
    if (div.innerHTML === "") {
        // Append the button element to the div element
        div.appendChild(button);
    }
}


// pagination
function createPagination(page, has_next, has_prev, num_pages) {
    // clear old pagination
    let div = document.querySelector(".shop-pagination");
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

