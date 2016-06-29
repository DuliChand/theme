$(document).ready(function(){

  if ($(".select").length > 0) {
        $(".select").selectbox();
    }

    
    if($(".check-box").length>0) {
        $(".check-box:checked").each(function(i,e){
            $(this).next("label").addClass("label-checked");
        });
        $(".check-box").each(function(i,e){
            $(this).next("label").append("<span class='ie8-icon'></span>");
        });
        $(".check-box+label").on("click", function(){
            var chkbox=$(this).prev(".check-box");
            if(chkbox.prop("checked")) {
                chkbox.prop("checked", false).change();
            } else {
                chkbox.prop("checked", true).change();
            }
        });
        $(".check-box").on("change", function(){
            var chkbox=$(this);
            var labl=chkbox.next("label");
            if(chkbox.prop("checked")) {
                labl.addClass("label-checked");
            } else {
                labl.removeClass("label-checked");
            }
        });
    }
    
    if($(".radio").length>0) {
        $(".radio:checked").each(function(i,e){
            $(this).next("label").addClass("label-checked");
        });//.next("label").addClass("label-checked");
        $(".radio").each(function(i,e){
            $(this).next("label").append("<span class='ie8-icon'></span>");
        });
        $(".radio+label").on("click", function(){
            var chkbox=$(this).prev(".radio");
            if(chkbox.prop("checked")) {
            } else {
                chkbox.prop("checked", true).change();
            }
        });
        $(".radio").on("change", function(){
            var chkbox=$(this);
            var other=$(".radio").not(chkbox);
            other.next("label").removeClass("label-checked");
            var labl=chkbox.next("label");
            if(chkbox.prop("checked")) {
                labl.addClass("label-checked");
            } else {
                labl.removeClass("label-checked");
            }
        });
    }
    
   $('.current-opening').on('click',function(){
  $('.current-opening').css('text-align','left');
$('.toggle-list-hide').toggle();
});

   $('.view-toggle').on('click', function(e) {
  e.preventDefault();
$('.toggle-this').toggle();
  $('.view-toggle').css("display","none");
});   
    
  
    $(".faq-catbox h4").click(function() {
		$('.faq-catbox h4').removeClass('active');
    if($(this).next("div").is(":visible")){
    $(this).next("div").slideUp("slow");
	$(this).removeClass('active');
    } else {
    $(".faq-catbox .toggle-box").slideUp("slow");
    $(this).next("div").slideToggle("slow");
	$(this).addClass('active');
    }
    });

    $(".accordian-area h3").click(function() {
		$('.accordian-area h3').removeClass('active');
    if($(this).next("div").is(":visible")){
    $(this).next("div").slideUp("slow");
	$(this).removeClass('active');
    } else {
    $(".accordian-area .according-box").slideUp("slow");
    $(this).next("div").slideToggle("slow");
	$(this).addClass('active');
    }
    });
   

//*******for Press Room page only*******//
$("#presstab1").on('click', function() {
   $("#presstab1").addClass('active');
   $("#presstab2").removeClass('active');
   $("#presstab3").removeClass('active');
   $("#presstab4").removeClass('active');
   $("#presstab5").removeClass('active');
   $(".presscontent1").show();
   $(".presscontent2").hide();
   $(".presscontent3").hide();
   $(".presscontent4").hide();
   $(".presscontent5").hide();
});

$("#presstab2").on('click', function() {
   $("#presstab1").removeClass('active');
   $("#presstab2").addClass('active');
   $("#presstab3").removeClass('active');
   $("#presstab4").removeClass('active');
   $("#presstab5").removeClass('active');
   $(".presscontent1").hide();
   $(".presscontent2").show();
   $(".presscontent3").hide();
   $(".presscontent4").hide();
   $(".presscontent5").hide();
});

$("#presstab3").on('click', function() {
   $("#presstab1").removeClass('active');
   $("#presstab2").removeClass('active');
   $("#presstab3").addClass('active');
   $("#presstab4").removeClass('active');
   $("#presstab5").removeClass('active');
   $(".presscontent1").hide();
   $(".presscontent2").hide();
   $(".presscontent3").show();
   $(".presscontent4").hide();
   $(".presscontent5").hide();
});

$("#presstab4").on('click', function() {
   $("#presstab1").removeClass('active');
   $("#presstab2").removeClass('active');
   $("#presstab3").removeClass('active');
   $("#presstab4").addClass('active');
   $("#presstab5").removeClass('active');
   $(".presscontent1").hide();
   $(".presscontent2").hide();
   $(".presscontent3").hide();
   $(".presscontent4").show();
   $(".presscontent5").hide();
});

$("#presstab5").on('click', function() {
   $("#presstab1").removeClass('active');
   $("#presstab2").removeClass('active');
   $("#presstab3").removeClass('active');
   $("#presstab4").removeClass('active');
   $("#presstab5").addClass('active');
   $(".presscontent1").hide();
   $(".presscontent2").hide();
   $(".presscontent3").hide();
   $(".presscontent4").hide();
   $(".presscontent5").show();
});






 



	
/*****this is for top static navi*****/

if (!window.location.origin) {
 	window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
}

$( "#cmsPageLinks_container" ).on( "click", function() {

	var redirectURL = /*window.location.origin + "/" + */$( "#cmsPageLinks" ).val();

    window.location.replace(redirectURL);
	
});


});
