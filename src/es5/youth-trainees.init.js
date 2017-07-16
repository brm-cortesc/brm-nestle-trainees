jQuery(document).ready( ()=>{
	//sliders
	const $perfiles = jQuery('.slider-perfiles');
	const $fases 	= jQuery('.slider-fases');
	const $vacantes = jQuery('.slider-vacantes');

	//config slider mobile

	const configSlide ={
		infinite:true,
		mobileFirst:true,
		centerMode: true,
		dots:false,
		slidesToShow:1,
    	slidesToScroll: 1,
    	adaptiveHeight:true,
    	centerPadding:'1rem',
    	prevArrow: '<a href="#" class="glyphicon slick-prev glyphicon-chevron-left"></a>',
    	nextArrow: '<a href="#" class="glyphicon slick-next glyphicon-chevron-right"> </a>',
    	responsive:[
    		{	
    			breakpoint:768,
    		    settings:'unslick'
    		}
    	]

	};

	//Init de slider 
	$perfiles.slick(configSlide);
	$fases.slick(configSlide);
	$vacantes.slick(configSlide); 


/*No pasar de acá para el DOM ready*/
});