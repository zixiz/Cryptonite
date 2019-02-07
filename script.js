$(document).ready(()=>{
    let arrcoins = [];
    let arrMoreInfo = [];

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
            <button class="btn btn-primary moreinfo" data-toggle="collapse" data-target="#collapseExample${id}" aria-expanded="false" aria-controls="collapseExample${id}">More info</button>
            <div class="collapse" id="collapseExample${id}">
                <div id="${id}">
                
                </div>
            </div>
        </div>`
        )
    }

    function moreInfoButton(){
        $(".moreinfo").click((event)=>{
            let coinId = event.target.parentElement.children[2].children[0].id;
            // $(`#${coinId}`).html(`this is ${coinId} and I'm Great`)
            moreInfoContent(coinId)
            waitAjax(coinId)
        })
    }
    function moreInfoContent(coinId){
        $.ajax(
            {
                type:"GET",
                url:`https://api.coingecko.com/api/v3/coins/${coinId}`,
                success: function(result){
                    console.log(result);
                    $(`#${result.id}`).html(`
                    <br>
                    <img class="tumbImage" src="${result.image.thumb}">
                    <br>
                    <span>NIS value: ${result.market_data.current_price.ils.toFixed(5)}</span>
                    <br>
                    <span>USD value: ${result.market_data.current_price.usd.toFixed(5)}</span>
                    <br>
                    <span>EUR value: ${result.market_data.current_price.eur.toFixed(5)}</span>
                    `)
                },
                error:function(error){
                   
                }
            });
    }

    function waitAjax(idelemnt){
        $(`#${idelemnt}`).html(`
        <div class="text-center">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
        `)
    }
    
    
})