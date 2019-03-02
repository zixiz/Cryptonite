$(document).ready(()=>{
    var arrcoins = []; // Array for coins
    var arrfav = []; // Favorite array for Toggle and Live Report
    var counter = 0;
    // Ajax init the Page App
    function loadPage(page){
        
        $.ajax(
            {
                type:"GET",
                url:`${page}.html`,
                success:function(result){
                    // $("#content-container").empty();
                    $("#content-container").append(result);
                    if(page == "homepage"){
                        homePageAjCall();
                    }else if(page == "about"){
                      $("#about-content").hide();
                    }
                }
            }
        )
    }
    // Calling homepage, live report and about.
    loadPage("homepage");
    loadPage("liveReport");
    loadPage("about");
    // Click listener for navigation 
    $("#homePageButton").click(function(){
      $("#about-content").hide();
      $("#livereportcontent").hide();
      $("#home-page-content").show();
    })
   $("#liveReportButton").click(function(){
    $("#about-content").hide();
    $("#home-page-content").hide();
    $("#livereportcontent").show();
    liveReport();
   })
   $("#aboutButton").click(function(){
    $("#home-page-content").hide();
    $("#livereportcontent").hide();
    $("#about-content").show();
  })

    

    //Create card for coins
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
    // Home page AJAX call and logics
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
    // Search function
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
    // Toggle checkbox function, listen and logic
    function toggleButton(){
        $(".checkinput").click(function(){
            let div = $(this).closest(".card")[0];
            console.log(div);
            if($(this).prop('checked')){
                checkFavorites(div);
            }else if($(this).prop('checked'),true){
                let uncheckedDiv=arrfav.indexOf(div)
                arrfav.splice(uncheckedDiv,1);
            }
        })
    }
    // Check Favorite array for Modal
    function checkFavorites(card){
        if(arrfav.length == 5){
            extraCard = card;
            myModal();
            $(".exampleModal").empty();
        }else{
            arrfav.push(card);
        }
    }
    // Modal logic - build the favorite coins on Modal body and add a listener for Modal coins toggle
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
        <div class="card text-white bg-secondary mt-1" >
            <div class="card-header">
              <h4 class="coin-symbol">${symbol}</h4>
            </div>
            <div class="custom-control custom-switch">
              <input type="checkbox" class="custom-control-input" id="switch${index}" checked>
              <label class="custom-control-label" for="switch${index}"></label>
            </div>
            <div class="card-body">
              <h5 class="card-title">${name}</h5>
            </div>
          </div>
        `);
    }
    // <div class="card text-white bg-secondary mt-1" >
    //         <div class="card-header">
    //           <h4 class="coin-symbol">${symbol}</h4>
    //         </div>
    //         <div class="custom-control custom-switch">
    //           <input type="checkbox" class="custom-control-input" id="switch${index}" checked>
    //           <label class="custom-control-label" for="switch${index}"></label>
    //         </div>
    //         <div class="card-body">
    //           <h5 class="card-title">${name}</h5>
    //         </div>
    // </div>

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
        $("#modalCloser,#modalLitleCloser").click(()=>{
            $(extraCard).find(".checkinput").prop('checked',false);
        });
    }

    function moreInfoButton(){
        $(".moreinfo").on("click",function(event){
            let coinId = event.target.parentElement.children[2].children[0].id;
                waitAjaxforcoin(coinId)
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
            

        }
    


    function waitAjaxforcoin(idelemnt){
        $(`#${idelemnt}`).html(`
        <div class="text-center">
            <div class="spinner-border text-dark" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
        `)

    }



    function liveReport(){

            if (arrfav.length == 0) {
            $("#livereportcontent").hide();
            $("#home-page-content").show();
            alert("Please choose currencies to analyze using the toggle button.");

        
            }else {

              $("#livereportcontent").empty();

        
              $("livereportcontent").html(`<div id="chartContainer" style="height: 500px; width: 100%;"></div>`);
            
              currency1 = [];
              currency2 = [];
              currency3 = [];
              currency4 = [];
              currency5 = [];
              currency_graph_names =[];
        
              function Get_Data() {
                let one = $(arrfav[0]).find(".card-header").text().toUpperCase()
                let two = $(arrfav[1]).find(".card-header").text().toUpperCase()
                let three = $(arrfav[2]).find(".card-header").text().toUpperCase()
                let four = $(arrfav[3]).find(".card-header").text().toUpperCase()
                let five = $(arrfav[4]).find(".card-header").text().toUpperCase()
                $.ajax({
        
                  type: 'GET',
        
                  url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${one.trim()},${two.trim()},${three.trim()},${four.trim()},${five.trim()}&tsyms=USD`,
        
                  success: function (result) {
        
                    if (result.Response == "Error") {
                      alert("There's no data to analyze from any of your chosen Currencies. Please choose different ones. ");
                      clearInterval(Interval_id);
                      $("#homePageButton").click();
                    }
        
                    else {
                        
                      var time = new Date();
        
                      let counter = 1
        
                      for (let key in result) {
        
                        if (counter == 1) {
        
                          currency1.push({ x: time, y: result[key].USD });
                          currency_graph_names.push(key);
        
                        }
        
                        if (counter == 2) {
        
                          currency2.push({ x: time, y: result[key].USD });
                          currency_graph_names.push(key);
        
                        }
        
                        if (counter == 3) {
        
                          currency3.push({ x: time, y: result[key].USD });
                          currency_graph_names.push(key);
        
                        }
        
                        if (counter == 4) {
        
                          currency4.push({ x: time, y: result[key].USD });
                          currency_graph_names.push(key);
        
                        }
        
                        if (counter == 5) {
        
                          currency5.push({ x: time, y: result[key].USD });
                          currency_graph_names.push(key);
        
                        }
        
                        counter++;
        
                      }
        
                      append_graph();
        
                    }
        
                  },
                  error: function () {
        
                    console.log('Error: ' + result);
        
                  }
        
                })
        
              }
        
              Interval_id = setInterval(function () {
        
                Get_Data();
        
              }, 2000)
        
            }
        
    
        
          function append_graph() {
        
            var chart = new CanvasJS.Chart("livereportcontent",{
              exportEnabled: true,
              animationEnabled: false,
              title: {
                text: "Your top cryptocurrency"
              },
              subtitles: [{
                text: "Hover the charts to see currency rate"
              }],
              axisX: {
                valueFormatString: "HH:mm:ss"
        
              },
              axisY: {
                title: "Currency Rate",
                titleFontColor: "#4F81BC",
                lineColor: "#4F81BC",
                labelFontColor: "#4F81BC",
                tickColor: "#4F81BC",
                includeZero: false
              },
              axisY2: {
                title: "",
                titleFontColor: "#C0504E",
                lineColor: "#C0504E",
                labelFontColor: "#C0504E",
                tickColor: "#C0504E",
                includeZero: false
              },
              toolTip: {
                shared: true
              },
              legend: {
                cursor: "pointer",
                itemclick: toggleDataSeries
              },
              data: [
        
                {
        
                  type: "spline",
                  name: currency_graph_names[0],
                  showInLegend: true,
                  xValueFormatString: "HH:mm:ss",
                  dataPoints: currency1
        
                },
        
                {
        
                  type: "spline",
                  name: currency_graph_names[1],
                  axisYType: "secondary",
                  showInLegend: true,
                  xValueFormatString: "HH:mm:ss",
                  dataPoints: currency2
        
                },
        
                {
        
                  type: "spline",
                  name: currency_graph_names[2],
                  axisYType: "secondary",
                  showInLegend: true,
                  xValueFormatString: "HH:mm:ss",
                  dataPoints: currency3
        
                },
        
                {
        
                  type: "spline",
                  name: currency_graph_names[3],
                  axisYType: "secondary",
                  showInLegend: true,
                  xValueFormatString: "HH:mm:ss",
                  dataPoints: currency4
        
                },
        
                {
        
                  type: "spline",
                  name: currency_graph_names[4],
                  axisYType: "secondary",
                  showInLegend: true,
                  xValueFormatString: "HH:mm:ss",
                  dataPoints: currency5
        
                }
        
              ]
            });
        
            chart.render();
        
            function toggleDataSeries(e) {
              if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
              } else {
                e.dataSeries.visible = true;
              }
              e.chart.render();
            }
        
          }
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