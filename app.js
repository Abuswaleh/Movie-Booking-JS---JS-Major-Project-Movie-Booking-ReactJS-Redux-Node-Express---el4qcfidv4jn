import {fetchMovieAvailability,fetchMovieList} from "./api.js"

const mainEl = document.querySelector(".main-container");
const bookerEl = document.getElementById("booker");
const gridHolderEl = document.querySelector("#booker-grid-holder");
const seatSelectorEl = document.querySelector("#booker>h3");
const bookTicketBtnEl = document.getElementById("book-ticket-btn");
let selectedSeats = [];

bookTicketBtnEl.onclick = confirmPurchaseForm;

function createHtmlEl(nameEl, parentEl, classEl=false, idEl=false, textEl=false){
    const elem = document.createElement(nameEl);
    if(classEl){
        elem.classList.add(classEl);
    }
    if(idEl){
        elem.setAttribute("id", idEl);
    }
    if(textEl){
        elem.textContent = textEl;
    }
    parentEl.appendChild(elem);
    return elem;
}

function createMoviesEl(movie, movieHolderEl){

    const movieLinkEl = createHtmlEl("a", movieHolderEl, "movie-link");
    movieLinkEl.href = "/"+movie.name; //dont needed

    const movieEl = createHtmlEl("div", movieLinkEl, "movie");
    movieEl.setAttribute("data-d", movie.name);

    const movieImgEl = createHtmlEl("div", movieEl, "movie-img-wrapper")
    movieImgEl.style.backgroundImage = `url(${movie.imgUrl})`;
    movieImgEl.style.backgroundSize = "cover";
    const nameEl = createHtmlEl("h4", movieLinkEl, "", "", movie.name);

    movieLinkEl.onclick = ()=>{
        event.preventDefault();
        fetchApiMovieAvailability(movieEl.dataset.d);
    }
}

function createBookingGridEl(seatStart, availability){
    selectedSeats = [];
    const gridEl = createHtmlEl("div",gridHolderEl, "booking-grid");
    for(let i=seatStart; i<seatStart+12; i++){
        const cellEl = createHtmlEl("div", gridEl, "grid-cell", "booking-grid-"+i, i);
        
        if(availability.includes(i)){
            cellEl.classList.add("unavailable-seat")
        }else{
            cellEl.classList.add("available-seat")
            cellEl.onclick = (e)=>{
                const seatId = e.target.textContent;
                if(cellEl.classList.contains("selected-seat")){
                    cellEl.classList.remove("selected-seat");
                    selectedSeats = selectedSeats.filter((elem)=>{
                        return elem !== seatId;
                    });
                }else{
                    cellEl.classList.add("selected-seat");
                    selectedSeats.push(seatId);
                }

                if(selectedSeats.length){
                    bookTicketBtnEl.classList.remove("v-none");
                }else{
                    bookTicketBtnEl.classList.add("v-none");
                }
            }
        }
    }

}

function confirmPurchaseForm(){
    bookerEl.innerHTML = "";
    const confirmSeatEl = createHtmlEl("div", bookerEl, "confirm-purchase");
    const headerText = "Confirm your booking for seat numbers: "+selectedSeats.join(",");
    const headerEl = createHtmlEl("h3", confirmSeatEl, "", "", headerText); 

    const formEl = createHtmlEl("form", confirmSeatEl, "", "customer-detail-form");

    const emailLabelEl = createHtmlEl("label", formEl, "", "", " Email Address ");
    const emailEl = createHtmlEl("input", emailLabelEl);
    const telLabelEl = createHtmlEl("label", formEl, "", "", "Phone Number ");
    const telEl = createHtmlEl("input", telLabelEl);
    emailEl.type = "email";
    emailEl.required = true;
    emailEl.placeholder = "enter your email";
    telEl.type = "tel";
    telEl.required = true;
    telEl.placeholder = "enter your phone";

    const divBtnEl = createHtmlEl("div", formEl);
    const submitBtn = createHtmlEl("button", divBtnEl, "", "", "Purchase");
    submitBtn.type = "submit";
    formEl.onsubmit = successPurchaseMsg;
}

function successPurchaseMsg(){
    const email = bookerEl.querySelector("input[type='email']").value;
    const phone = bookerEl.querySelector("input[type='tel']").value;

    bookerEl.innerHTML = "";
    const successEl = createHtmlEl("div", bookerEl, "", "Success", "Booking Details");

    createHtmlEl("p", successEl, "", "", "Seats: "+selectedSeats.join(","));
    createHtmlEl("p", successEl, "", "", "Phone number: "+phone);
    createHtmlEl("p", successEl, "", "", "Email: "+email);

    const bookAnotherEl = createHtmlEl("button", bookerEl, "", "book-again", "Want to book again?");
    bookAnotherEl.onclick = ()=>{
        location.reload();
    }

}

const fetchAPIMovieList = ()=>{
    const loaderDiv = createHtmlEl("div", mainEl, "", "loader");
    fetchMovieList()
    .then((data)=>{
        loaderDiv.remove();
        const movieHolderEl = createHtmlEl("div", mainEl, "movie-holder");
        data.forEach(movie => {
            createMoviesEl(movie,movieHolderEl);
        });
    })
}

const fetchApiMovieAvailability = (movie)=>{
    seatSelectorEl.classList.remove("v-none")
    const loaderDiv = createHtmlEl("div", bookerEl, "", "loader");
    fetchMovieAvailability(movie)
    .then((data)=>{
        loaderDiv.remove();
        
        gridHolderEl.innerHTML = "";
        createBookingGridEl(1,data);
        createBookingGridEl(13,data);
    });
}

fetchAPIMovieList();
