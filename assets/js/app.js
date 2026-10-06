var cl=console.log;
const addBtn=document.getElementById("addBtn")
const movieContainer=document.getElementById("movieContainer")
const backdrop=document.getElementById("backdrop")
const movieModel=document.getElementById("movieModel")
const icon=document.getElementById("icon")
const name=document.getElementById("name")
const form=document.getElementById("form")
const image=document.getElementById("image")
const discription=document.getElementById("discription")
const rating=document.getElementById("rating")
const addMovie=document.getElementById("addMovie")
const updateMovie=document.getElementById("updateMovie")
const closeBtn=document.getElementById("closeBtn")
const spinner=document.getElementById("spinner")
const CreatedAt=document.getElementById("CreatedAt");
const Genre=document.getElementById("Genre");
const movieDate = document.getElementById("Date");
const updateAt=document.getElementById("updateAt")


const BASE_URL="https://xhrcrud-default-rtdb.firebaseio.com"
const MOVIE_URL=`${BASE_URL}/movies.json`;


// localstate
let state={
    movieArr:[],
    Edit_id:null,
};


// Rating
function SetRating(rating) {
    if(rating > 7){
        return "badge-success";
    }else if(rating > 5){
    return "badge-warning";
}else{
    return "badge-danger";
}
    
}
function OnToggle() {
    backdrop.classList.toggle("active")
    movieModel.classList.toggle("active")
}


// spinner

function Spinnerhandler() {
  spinner.classList.toggle("d-none");
}

// Snakbar
function Snkabar(msg,icon){
    Swal.fire({
        text:msg,
        icon:icon,
        timer:2000
    });
}

// showUpdatedSmallElement

function showUpdatedSmallElement(updateId) {
  let col = document.getElementById(updateId);
  let updatedSmallElement = col.querySelector(".updatedAt");
  updatedSmallElement.classList.remove("d-none");
}


// objToArr
function ObjToarr(Nestobj){
        state.movieArr = [];

    for(const key in Nestobj){
        Nestobj[key].id=key
        state.movieArr.unshift(Nestobj[key])
    }
}

// MakeApi call fun
function MakeApi(url,method,msgbody=null){
   let  body= msgbody? JSON.stringify(msgbody) : null
   return fetch(url,{
    method:method,
    body:body,
    headers:{
        "Content-Type": "Application/json",
      "Security": "JWT Token"
    
    }
   })
   .then(res=>{
    if(!res.ok){
        throw new Error(`ERROR:${res.sttaus}`);
        
    }
    return res.json();

   })
   .catch((err)=>{
    cl(err)

   })
   .finally(()=>{
    Spinnerhandler();

   })
}

// templating
function Templating(arr){
    let result=``;
    arr.forEach((ele) => {
        result+=`<div class="col-md-3 mt-4" id="${ele.id}">
              <div class="card movieCard">
                <div class="card-header d-flex justify-content-between">
                   <h4 class="m-0">${ele.movieName}</h4>
                   ${
        ele.updatedAt
        ? `<small class="updatedAt">
             Updated At: ${ele.updatedAt}
           </small>`
        : `<small class="CreatedAt">
             Created At: ${ele.createdAt}
           </small>`
    }

                    <h5 class="m-0"><span class="badge ${SetRating(ele.movieRating)} badge-success">${ele.movieRating}</span></h5>   
               </div>
               <div class="card-body">
                  <figure>
                     <img src="${ele.movieImg}" alt="OMG">
                     <figcaption>
                        <h3>${ele.movieName}</h3>
                         <p>${ele.movieDescripion}</p>
                     </figcaption>
                  </figure>
               </div>
               <div class="card-footer d-flex justify-content-between">
                  <button onclick="EditMovie(this)" class="btn btn-sm netflix-sec-color" >Edit</button>
                  <button onclick="DeleteMovie(this)" class="btn btn-sm netflix-pri-Color">Delete</button>
               </div>
              </div>
         </div> 
      </div> `

        
    });
    movieContainer.innerHTML=result;
}





// read
function ShowAllmovie(){
    Spinnerhandler();
    MakeApi(MOVIE_URL,"GET")
    .then(res=>{
        cl(res)
        ObjToarr(res);
        Templating(state.movieArr)
        cl(state.movieArr)

    })
    .catch(err=>{
        cl(err);
    })

}
ShowAllmovie();

// first Api call for create
function CreateMovie(eve){
    eve.preventDefault();
    let Mymovie={
        movieName:name.value.trim(),
        movieImg:image.value.trim(),
        createdAt:CreatedAt.value.trim(),
        // updatedAt:new Date(),
        movieDescripion:discription.value.trim(),
        movieRating:rating.value.trim(),
date:movieDate.value,        
genre:Genre.value.trim(),
    }
    Spinnerhandler();
    MakeApi(MOVIE_URL,"POST",Mymovie)
    .then(res=>{
        cl(res)
    Mymovie.id=res.name;
    state.movieArr.push(Mymovie); 
    creteDiv(Mymovie)
    Snkabar("Movie Added successfully!!","success")



    })
    .catch(err=>{
        cl(err)

    })

}



function creteDiv(Mymovie){
    let div = document.createElement("div");

    div.className = "col-md-3 mt-4";
    div.id = Mymovie.id;

    div.innerHTML = `
        <div class="card movieCard">

            <div class="card-header d-flex justify-content-between">
                <h4 class="m-0">${Mymovie.movieName}</h4>
                
               

                <h5 class="m-0">
                    <span class="badge ${SetRating(Mymovie.movieRating)}">
                        ${Mymovie.movieRating}
                    </span>
                </h5>
            </div>
             <small class="CreatedAt">
                    Created At: ${Mymovie.createdAt}
                </small>

                <small class="updatedAt d-none">
                    Updated At: sddjlkdsjlf
                </small>

            <div class="card-body">
                <figure>
                    <img src="${Mymovie.movieImg}" alt="OMG">

                    <figcaption>
                        <h3>${Mymovie.movieName}</h3>
                        <p>${Mymovie.movieDescripion}</p>
                    </figcaption>
                </figure>
            </div>
            <div  class="card-footer d-flex justify-content-between">
                <button   onclick="EditMovie(this)"class="btn btn-sm netflix-sec-color">Edit </button>
                <button onclick="DeleteMovie(this)" class="btn btn-sm netflix-pri-Color">
                    Delete
                </button>
            </div>

        </div>
    `;

    movieContainer.prepend(div);
    form.reset();
}

// Edit
function EditMovie(eve){
    let Edit_id= eve.closest(".col-md-3").id;
    state.Edit_id=Edit_id;
    let Edobj= state.movieArr.find(e=>e.id===Edit_id);
    name.value=Edobj.movieName;
        image.value=Edobj.movieImg;
        CreatedAt.value=Edobj.createdAt;
        discription.value=Edobj.movieDescripion;
        rating.value=Edobj.movieRating;
        movieDate.value=Edobj.date;        
            Genre.value=Edobj.genre;
        addMovie.classList.add("d-none");
        updateMovie.classList.remove("d-none");
        OnToggle();
        
    

}


//updtae
function UpdateHandler(){
    Spinnerhandler();
    let Update_id=state.Edit_id;
    let Update_url=`${BASE_URL}/movies/${Update_id}.json`
    let Upobj={movieName:name.value.trim(),
        movieImg:image.value.trim(),
        createdAt:CreatedAt.value.trim(),
        updatedAt:new Date().toLocaleString(),
        movieDescripion:discription.value.trim(),
        movieRating:rating.value.trim(),
    date:movieDate.value,       
    genre:Genre.value.trim(),
        id:Update_id
    };
    MakeApi(Update_url,"PATCH",Upobj)
    .then(res=>{
        cl(res);
        let getIndex=state.movieArr.findIndex(b=>b.id===Update_id)
        state.movieArr[getIndex]=Upobj;
        Updatecards(Upobj);
        showUpdatedSmallElement(Update_id)
        addMovie.classList.remove("d-none");
        updateMovie.classList.add("d-none");
        OnToggle();
        form.reset();
        
        state.Edit_id=null;
        })
        .catch(err=>{
            cl(err)
        })
}


// templatingforupdate
function Updatecards(res){
    let div= document.getElementById(res.id);
    div.innerHTML=`<div class="card movieCard">
                <div class="card-header d-flex justify-content-between">
                   <h4 class="m-0">${res.movieName}</h4>
                   <small class="CreatedAt d-none">Created At: ${res.createdAt}</small><br>
                        <small class="updatedAt d-none">Updated At:${res.updatedAt}</small>
                    <h5 class="m-0"><span class="badge ${SetRating(res.movieRating)} badge-success">${res.movieRating}</span></h5>   
               </div>
               <div class="card-body">
                  <figure>
                     <img src="${res.movieImg}" alt="OMG">
                     <figcaption>
                        <h3>${res.movieName}</h3>
                         <p>${res.movieDescripion}</p>
                     </figcaption>
                  </figure>
               </div>
               <div class="card-footer d-flex justify-content-between">
                  <button onclick="EditMovie(this)" class="btn btn-sm netflix-sec-color" >Edit</button>
                  <button onclick="DeleteMovie(this)" class="btn btn-sm netflix-pri-Color">Delete</button>
               </div>
              </div>
         `;
}



// delete

function DeleteMovie(eve){
    let REmove_id= eve.closest(".col-md-3").id;
    const Remove_url=`${BASE_URL}/movies/${REmove_id}.json`
    Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed){
    Spinnerhandler();
    MakeApi(Remove_url,"DELETE")
    .then(res=>{
        cl(res)
        let index= state.movieArr.findIndex(ele=>ele.id===REmove_id)
        state.movieArr.splice(index,1)
        eve.closest(".col-md-3").remove();
        Snkabar("Movie deleted sucessfully!!","success");

    })
    .catch(err=>{
        cl(err)

    })

  }
    
});

}



form.addEventListener("submit",CreateMovie)
addBtn.addEventListener("click",OnToggle);
addMovie.addEventListener("click",OnToggle)
backdrop.addEventListener("click",OnToggle);
icon.addEventListener("click",OnToggle)
closeBtn.addEventListener("click",OnToggle)
updateMovie.addEventListener("click",UpdateHandler)