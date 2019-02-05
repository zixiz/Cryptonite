$(document).ready(()=>{
    let arrcoins = [];

    function loadPage(page){
        
        $.ajax(
            {
                type:"GET",
                url:`${page}.html`,
                success:function(result){
                    $("#content-container").empty();
                    $("#content-container").html(result);
                    if(page == "homepage"){
                        
                        homePageAjCall()
                    }
                }
            }
        )
    }
    loadPage("homepage");
    
    function homePageAjCall(){
        $.ajax(
            {
                type:"GET",
                url:`https://api.coingecko.com/api/v3/coins/list`,
                success: function(result){
                    arrcoins = result;
                    for(let i = 0; i<100;i++){
                        createCard(arrcoins[i].symbol,arrcoins[i].name, arrcoins[i].id);
                    }
                    moreInfoButton()
                },
                error:function(error){
                   
                }
            });
    }
    
    function createCard(symbol,name,id){
        $("#home-page-content").append(
  


        `<div class="card text-white bg-secondary mt-3" >
            <div class="card-header">${symbol}</div>
            <div class="card-body">
            <h5 class="card-title">${name.toLowerCase()}</h5>
            <button class="btn btn-primary" data-toggle="collapse" data-target="#collapseExample${id}" aria-expanded="false" aria-controls="collapseExample${id}">More info</button>
            <div class="collapse" id="collapseExample${id}">
                <div id="${id}">
                oident.
                </div>
            </div>
        </div>`
        )
    }

    function moreInfoButton(){
        $(".collapse").on("click",(event)=>{
            console.log(event)
        })
    }
    
    
})