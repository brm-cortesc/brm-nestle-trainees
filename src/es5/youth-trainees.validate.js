const $select = jQuery('.form-group select');
const $input  = jQuery('.form-group input');
const $form   = jQuery('#trainees');

//Estado activo de los campos//
const campoActive = (el) =>{

	jQuery(el)
		.focusin(function() {
			jQuery(this).parent().addClass('active');
			if(jQuery(el).is('select')){
				jQuery(this).find('option').show();
			}
		
		})
		.focusout(function() {

			let $self = jQuery(this);

			if (jQuery($self).val() != '' ){
				jQuery($self).parent().addClass('active')

			}else{
				jQuery($self).parent().removeClass('active')

			}
		});

};

jQuery(document).ready( () =>{

	campoActive($input);
	campoActive($select);

	//Ubicacion de mensaje de error//
	const errorPlacement = (error, element)=>{
		error.insertAfter(element.parent())
	};

	//metodo para aceptar texto con espacios y caracteres especiales

	jQuery.validator.addMethod('letras', function(val, el){
		return this.optional(el) || /^[a-z" "ñÑáéíóúÁÉÍÓÚ,.;]+$/i.test(val);
	});

	$form.validate({
		errorElement: 'div',
		errorClass: 'msn-place',

		rules: {
		  nombre: 			{required:true,letras:true},
		  apellidos: 		{required:true,letras:true },
		  programa: 			{ required:true },
		  correo: 			{required:true,	email:true},
		  departamento: 			{ required:true  },
		  ciudad: 			{ required:true  },
		  direccion: 		{required:true },
		  cv: 			{ required:true, extension: 'pdf ' },
		  terminos: 		{ required:true }

		},

		messages: {
		  nombre: {
		  	required:'Indica un nombre',
		  	letras:'solo se acepta texto'
		  },
		  apellidos: {
		  	required:'Indica apellidos',
		  	letras:'solo se acepta texto'
		  },
		  programa: {
		  	required:'Indica un programa'
		  },
		  correo: {
		  	required:'Indica un corre electr&oacute;nico',
		  	email:'formato inv&aacute;lido'
		  },
		  departamento:{
		  	required:'Selecciona un departamento'
		  },
		  ciudad:{
		  	required:'Selecciona una ciudad'
		  },
		  direccion:
		  	{required:'Indica una direcci&oacute;n'
		  },
		  cv:{
		  	required:'Selecciona tu hoja de vida',
		  	extension: 'formato inv&aacute;lido '
		  },
		  terminos:
		  { required:'Debes leer y aceptar los avisos legales' }

		},
		errorPlacement

	});

	jQuery('.btn-show-form')
		.click(function(e){
			e.preventDefault();
			$form.toggleClass('form-show');
			jQuery(this).toggleClass('active');
		});


/*No pasar de acá para el DOM ready*/
});