$(document).ready(()=>{
    var arrcoins = [];
    var arrfav = [];
    var counter = 0;

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
   
    
    // $(".checkinput").click(()=>{
    //     console.log("in");
    // });
    
           
    function createCard(symbol,name,id){
        counter++;
        $("#home-page-content").append(
          `<div class="card text-white bg-secondary mt-3" >
            <div class="card-header">${symbol} 
            <label class="switch">
                <input type="checkbox" class="checkinput" id="customSwitch${symbol}">
                <lable class="slider"></lable>
            </label>
            </div>
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
                    moreInfoButton();
                    toggleButton()
                    search()
                },
                error:function(error){
                   
                }
            });
    }
    function search(){
        $("#searchButton").on("click",()=>{
            let searchInput = $("#theInput").val().toLowerCase();
            $(".card-title").each(function(index,element){
                if($(element).html() == searchInput){
                    let card = $(element).closest(".card")[0];
                    console.log(card)
                    $(".card").hide()
                    $(card).show()
                }else if(searchInput == ""){
                    $(".card").show()
                }
            })
        })
    }
    function toggleButton(){
        $(".checkinput").click(function(){
            let div = $(this).closest(".card")[0];
            console.log(div);
            if($(this).prop('checked')){
                checkFavorites(div);
            }else{

            }
        })
    }
    function checkFavorites(card){
        if(arrfav.length == 5){
            extraCard = card;
            myModal();
            $(".exampleModal").empty();
        }else{
            arrfav.push(card);
        }
    }
    function myModal(){
        $("#modalBody").empty()
        let symbol;
        let name;
        for(let i=0;arrfav.length>i;i++){
            symbol = $(arrfav[i]).find(".card-header").text()
            name = $(arrfav[i]).find("h5").text()
            buildModalBody(symbol,name,i);
            actioveModalSwitch(i,symbol)
        }
        ModalCancelButton()
        $("#exampleModal").modal('show')
    }
    function buildModalBody(symbol,name,index){
        $("#modalBody").append(`
        <div class="col" style="width:30%">
                <div class="row">
                <div class="col">
                    <h4 class="coin-symbol">${symbol}</h4>
                </div>
                <div class="col">
                    <div class="custom-control custom-switch">
                        <input type="checkbox" class="custom-control-input" id="switch${index}" checked>
                        <label class="custom-control-label" for="switch${index}"></label>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <p class="coin-name">${name}</p>
                </div>
            </div>
        </div>
        `);
    }

    function actioveModalSwitch(index,symbol){
        $("#switch"+index).click(function(){
            $(arrfav[0]).find(".custom-control-input").prop('checked',false);
            $(`#customSwitch${symbol}`).prop('checked',false);
            arrfav.splice(index,1);
            arrfav.push(extraCard);
            $('#exampleModal').modal('hide');
        })
    }

    function ModalCancelButton(){
        $("#modalCloser").click(()=>{
            $(extraCard).find(".checkinput").prop('checked',false);
        });
    }
    // function toggleButton(){
    //     $(".checkinput").click(function(){
    //         let toggleValue = $(this).prop("checked")
    //         let div = $(this).closest(".card")[0]
    //         console.log(toggleValue)
    //         if(toggleValue == true){
    //             console.log(div)
    //             arrfav.push(div)
    //         }else if(toggleValue == false){
    //             for(let i =0; i < arrfav.length;i++){
    //                 if(arrfav[i] == div){
    //                     arrfav.splice(i,1)
    //                 }
    //             }
    //         }
    //         if(arrfav.length > 5){
    //             for(let i =0; i <arrfav.length;i++){
    //                 $('.modal-body').append($(arrfav[i]))
    //             } 
                
    //             $("#exampleModal").modal('show')
                
    //         }

    //         });
    // }

    

    function moreInfoButton(){
        $(".moreinfo").on("click",function(event){
            let coinId = event.target.parentElement.children[2].children[0].id;
                waitAjax(coinId)
                let timeout = 120000;
                let current_time = Date.now();
                let available_coin = JSON.parse(localStorage.getItem(`${coinId}`));
                if((available_coin != null) && (current_time - available_coin.ajax_time < timeout)){
                    console.log("from localStorage")
                    $(`#${coinId}`).empty();
                    $(`#${coinId}`).html(`
                    <br>
                    <img class="tumbImage" src="${available_coin.image.thumb}">
                    <br>
                    <span>NIS ₪ value: ${available_coin.market_data.current_price.ils.toFixed(5)}</span>
                    <br>
                    <span>USD $ value: ${available_coin.market_data.current_price.usd.toFixed(5)}</span>
                    <br>
                    <span>EUR € value: ${available_coin.market_data.current_price.eur.toFixed(5)}</span>
                    `)
                }else{
                    $.ajax(
                        {
                            type: 'GET',
                            url:`https://api.coingecko.com/api/v3/coins/${coinId}`,
                            success: function(result){
                                console.log("from ajax")
                                result.ajax_time = Date.now();
                                localStorage.setItem(`${coinId}`, JSON.stringify(result));
                                $(`#${result.id}`).empty();
                                $(`#${result.id}`).html(`
                                <br>
                                <img class="tumbImage" src="${result.image.thumb}">
                                <br>
                                <span>NIS ₪ value: ${result.market_data.current_price.ils.toFixed(5)}</span>
                                <br>
                                <span>USD $ value: ${result.market_data.current_price.usd.toFixed(5)}</span>
                                <br>
                                <span>EUR € value: ${result.market_data.current_price.eur.toFixed(5)}</span>
                                `)
                            }
                        }
                    )
                }
            }
            
            )
            
            // moreInfoContent(coinId);
            // console.log("from ajax");
            // waitAjax(coinId);  
        }
    
    // function moreInfoContent(coinId){

    // }

    function waitAjax(idelemnt){
        $(`#${idelemnt}`).html(`
        <div class="text-center">
            <div class="spinner-border text-dark" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
        `)
    }

   
    
    
})


// $.ajax(
        //     {
        //         type:"GET",
        //         url:`https://api.coingecko.com/api/v3/coins/${coinId}`,
        //         success: function(result){
        //             console.log(result);
        //             $(`#${result.id}`).html(`
        //             <br>
        //             <img class="tumbImage" src="${result.image.thumb}">
        //             <br>
        //             <span>NIS ₪ value: ${result.market_data.current_price.ils.toFixed(5)}</span>
        //             <br>
        //             <span>USD $ value: ${result.market_data.current_price.usd.toFixed(5)}</span>
        //             <br>
        //             <span>EUR € value: ${result.market_data.current_price.eur.toFixed(5)}</span>
        //             `)
        //         },
        //         error:function(error){
        //             $(`#${error.id}`).html(`
        //             <br>
        //             <span>Sorry but: ${error.id} not found</span>
        //             `)
        //         }
        //     });