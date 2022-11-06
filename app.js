const containerPopup=document.querySelector('.container-poppup');
let addContainer=document.querySelector('.add-container');
const errorPopup=document.querySelector('.error-popup');

let submitContainer=document.querySelector('.submit-container');

const submitBtn=document.querySelector('.button-submit button');


let popupArray= [];

let fullObject={};

let inputDateObject={
    startDate: [],
    endDate: []
}

let startDateValue='';
let endDateValue='';

let inputTarget='';

function initMap(){

    var options={
        center: {lat: 42.3154, lng: 43.3569},
        zoom: 7,
        mapId: "715a3683b7b7bf8a"
      }
    
    map = new google.maps.Map(document.getElementById('map'), options);

    const svgIcon={
        url: './Img/location.png',
        anchor: new google.maps.Point(17, 54),
        scaledSize: new google.maps.Size(35, 35),
    }

    function addmarker(property){

        const marker = new google.maps.Marker({
            position: property.location,
            map: map,
            icon: svgIcon
        })

        marker.addListener('click',()=>{

            containerPopup.innerHTML=`
            <div class="modal-dialog container-child" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h3 class="modal-title">${property.info.title}</h3>
                <button type="button" class="close close-btn " data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body image-city">
              <img src=${property.info.image} alt=${property.info.title} />
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary add-btn">Add</button>
                <button type="button" class="btn btn-secondary close-btn" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        `
            containerPopup.classList.add('visible');

            const closeBtn=document.querySelectorAll('.close-btn');
            const addBtn=document.querySelector('.add-btn');

            closeBtn.forEach(close=>{
              close.addEventListener('click',()=>{
                containerPopup.classList.remove('visible');
              })
            })

            addBtn.addEventListener('click',()=>{

              let propertyfinder=popupArray.find(item=> item.title === property.info.title);
              
                if(!propertyfinder){
                  popupArray.push(property.info);
                } else{
                  errorPopup.classList.add('appear');
                }



               

                updateCart();
                       
             containerPopup.classList.remove('visible');
              
            })

            

       
     })

    }

   

    let MarkerArray=[
        {location: {lat: 41.7151, lng: 44.8271},info: {id: 1,image: './Img/tbilisi.jpg',title: 'Tbilisi'}},
        {location: {lat: 42.2662, lng: 42.7180},info: {id: 2,image: './Img/kutaisi.jpg',title: 'Kutaisi'}},
        {location: {lat: 41.6168, lng: 41.6367},info: {id: 3, image: './Img/batumi.jpg',title: 'Batumi'}},
        {location: {lat: 42.3420, lng: 43.4106},info: {id: 4, image: './Img/sachkhere.jpg',title: 'Sachkhere'}},
    ];

    for(let i=0; i<MarkerArray.length; i++){
        addmarker(MarkerArray[i])
    }


}


function removeClass(products,index){
    popupArray=popupArray.filter(item=>item.id!==products);
if(index === popupArray.length){
    startDateValue='';
    endDateValue='';
}
    
    inputDateObject.startDate=inputDateObject.startDate.filter(item=> item!==inputDateObject.startDate[index]);
    inputDateObject.endDate=inputDateObject.endDate.filter(item => item !== inputDateObject.endDate[index]);

    
    updateCart();
  }



function updateCart(){
    addContainer.innerHTML=" ";
    popupArray.forEach((product,index)=>{
      
      addContainer.innerHTML+=`
      <div class="add-box">
      <div class="box-remove-btn">
         <button class='remove-box'  onclick="removeClass(${product.id},${index})">
             <span><i class="fas fa-times"></i></span>
         </button>
      </div>
      <div class="title">
         <h1>${product.title}</h1>
      </div>

      <div class="input-start">
      <label>Start date: </label>
      <input type="date"/>
      </div>

      <div class="input-last">
      <label>End date: </label>
      <input type="date"/>
      </div>

      <div class="image">
         <img src=${product.image} alt="" />
      </div>
     
      </div>
      `;

      inputsDate();
        
  
     })

     if(popupArray.length!==0){
      submitBtn.classList.add('block-btn');
     } else{
      localStorage.removeItem('CONT');
     }
     
  }

  

  let onChangeinputStart=function(e){
    startDateValue=e.target.value;
    inputDateObject.startDate =inputDateObject.startDate.slice(0,popupArray.length-1)
    inputsDate();
  }

  let onChangeinputLast=function(e){
    endDateValue=e.target.value;
    //inputDateObject.endDate.shift();
    //inputsDate();
  }



function inputsDate(){
    const startDate=document.querySelectorAll('.input-start input');
    const lastDate=document.querySelectorAll('.input-last input');

    if(startDateValue!=='' && !inputDateObject.startDate.includes(startDateValue)){
        inputDateObject.startDate.push(startDateValue);
    }

    if(endDateValue!=='' && !inputDateObject.endDate.includes(endDateValue)){
        inputDateObject.endDate.push(endDateValue);
    }


    let InputTargetDateL =new Date(inputDateObject.endDate[inputDateObject.endDate.length-1]);
    let yearL = InputTargetDateL.getFullYear();
    let monthL = InputTargetDateL.getMonth()+1;
    let dayL = InputTargetDateL.getDate()+1;
    if(monthL <10){
    monthL=`0${monthL}`
    }

    if(dayL <10){
    dayL=`0${dayL}`
    }

    let fullDateL = `${yearL}-${monthL}-${dayL}`; 



    for(let i=0;i<startDate.length;i++){
        if(i==0){
          startDate[i].setAttribute('min','2022-02-09');
          startDate[i].addEventListener('input',onChangeinputStart);
          startDate[i].value=inputDateObject.startDate[i];
        }else{
            startDate[i].setAttribute('min', fullDateL);
            startDate[i].addEventListener('input',onChangeinputStart);
            startDate[i].value=inputDateObject.startDate[i];
        }
        
    }

    for(let i=0;i<lastDate.length;i++){
        if(i==0){
            lastDate[i].setAttribute('min',inputDateObject.startDate[i]);
            lastDate[i].addEventListener('input',onChangeinputLast)
            lastDate[i].value=inputDateObject.endDate[i] || '';
        }else{
            lastDate[i].setAttribute('min',inputDateObject.startDate[i]);
            lastDate[i].addEventListener('input',onChangeinputLast)
            lastDate[i].value=inputDateObject.endDate[i] || '';
        }
        
    }


    

}
  




document.querySelector('.error-close').addEventListener('click',()=>{
    errorPopup.classList.remove('appear');
  })





  submitBtn.addEventListener('click',()=>{
    inputsDate();

     fullObject={
      firstDate: inputDateObject.startDate,
      lastDate: inputDateObject.endDate,
      popupArrayS: popupArray
    }

    if(popupArray.length===0){
      submitBtn.classList.remove('block-btn');
    }
 
    localStorage.setItem('CONT',JSON.stringify(fullObject));

    submitContainer.innerHTML='';

 

    for(let i=0;i<popupArray.length;i++){
      submitContainer.innerHTML+=`
      <div class="submit-child">
        <h5>${fullObject.popupArrayS[i].title}</h5>
        <p>Start date: ${fullObject.firstDate[i]}</p>
        <p>End date: ${fullObject.lastDate[i]}</p>
      </div>
      `
    }

  });