$(document).ready(()=>{
    var arrcoins = [];
    var arrfav = [];

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
        $("#home-page-content").append(
          `<div class="card text-white bg-secondary mt-3" >
            <div class="card-header">${symbol} 
            <label class="switch">
                <input type="checkbox" class="checkinput">
                <span class="slider"></span>
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
                    // $("#home-page-content" ).hide();
                    // $(card).show()
                }else if(searchInput == ""){
                    $(".card").show()
                }
                // if(searchInput == )
                // if(searchInput == $(".card-title").val()){  
                // }
            })
        })
    }

    function toggleButton(){
        $(".checkinput").click(function(){
            let toggletrue = $(this).prop("checked")
            let div = $(this).closest(".card")[0]
            console.log(toggletrue)
            if(toggletrue == true){
                console.log(div)
                arrfav.push(div)
            }else if(toggletrue == false){
                for(let i =0; i < arrfav.length;i++){
                    if(arrfav[i] == div){
                        arrfav.splice(i,1)
                    }
                }
            }
            if(arrfav.length > 5){ 
                $("#exampleModal").modal('show')
                buildModal(div)
            }

            });
    }

    function buildModal(card){
        $("#home-page-content").append(`
        <div class="modal fade" id="exampleModal">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        ${card}
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
        `)
    }

    function moreInfoButton(){
        $(".moreinfo").click((event)=>{
            let coinId = event.target.parentElement.children[2].children[0].id;
            
            moreInfoContent(coinId);
            console.log("from ajax");
            waitAjax(coinId);  
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
                    <span>NIS ₪ value: ${result.market_data.current_price.ils.toFixed(5)}</span>
                    <br>
                    <span>USD $ value: ${result.market_data.current_price.usd.toFixed(5)}</span>
                    <br>
                    <span>EUR € value: ${result.market_data.current_price.eur.toFixed(5)}</span>
                    `)
                },
                error:function(error){
                    $(`#${error.id}`).html(`
                    <br>
                    <span>Sorry but: ${error.id} not found</span>
                    `)
                }
            });
    }

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